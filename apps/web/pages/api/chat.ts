import { performCompletion } from '../../utils/stream_response';
import { updateTokenUsageForFreeTier } from '@resources/user';
import { AIModels } from 'data/aiModels.data';
import { NextApiRequest } from 'next';
import { ChatCompletionRequestMessage } from 'openai';
import { ChatContext } from 'types/chat';

export const config = {
	api: {
		externalResolver: true,
	},
};

type Payload = {
	userId: string;
	context: ChatContext;
	messages: ChatCompletionRequestMessage[];
	max_tokens: number;
	projectId: string;
	uploadId: string;
	temperature: number;
};

const singleReferenceEndpoint = `${process.env.NEXT_PUBLIC_APP_URL}/api/retrieve-single-reference-embeddings`;
const projectReferenceEndpoint = `${process.env.NEXT_PUBLIC_APP_URL}/api/retrieve-reference-embeddings`;
const realtimeEndpoint = `${process.env.NEXT_PUBLIC_APP_URL}/api/search-web`;

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req: NextApiRequest, res) {
	try {
		res.setHeader('Content-Type', 'text/event-stream');
		res.setHeader('Cache-Control', 'no-cache');
		res.setHeader('Connection', 'keep-alive');
		res.setHeader('Content-Encoding', 'none');

		const {
			userId,
			messages,
			max_tokens,
			temperature,
			projectId,
			uploadId,
			context,
		} = JSON.parse(req.body) as Payload;

		let { llmModel } = JSON.parse(req.body);

		const user = await updateTokenUsageForFreeTier(userId);

		if (!user.is_subscribed) {
			llmModel = AIModels.GPT_3_5;
		}

		let prompt = '';
		if (context === 'references' || context === 'realtime') {
			prompt = messages.pop().content;
		}

		if (context === 'references') {
			const body = uploadId ? { prompt, uploadId } : { prompt, projectId };

			const res = await fetch(
				uploadId ? singleReferenceEndpoint : projectReferenceEndpoint,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(body),
				},
			);

			if (!res.ok) {
				throw new Error(
					`Failed to fetch from reference endpoint: ${res.statusText}`,
				);
			}

			const injectedDoc = await res.json();
			messages.push({
				role: 'user',
				content: `${prompt}\n Document: ${injectedDoc}`,
			});
		}

		if (context === 'realtime') {
			const currentDate = new Date();
			const dateString = currentDate.toString();

			const res = await fetch(realtimeEndpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					query: prompt,
				}),
			});

			if (!res.ok) {
				throw new Error(
					`Failed to fetch from realtime endpoint: ${res.statusText}`,
				);
			}

			const realtimeContext = await res.json();
			messages.push({
				role: 'user',
				content: `Web search results:\n\n ${JSON.stringify(
					realtimeContext,
				)}\nCurrent date:${dateString}\n\nInstructions:Using the provided web search results, write a comprehensive reply to the given query. Make sure to cite results using [[number](URL)] notation after the reference. If the provided search results refer to multiple subjects with the same name, write separate answers for each subject.\nQuery:${prompt} `,
			});
		}

		await performCompletion(res, {
			model: llmModel || 'gpt-3.5-turbo',
			messages,
			temperature,
			max_tokens,
			top_p: 1,
			stream: true,
		})
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ error: 'An error occurred while processing your request.' });
	}
}
