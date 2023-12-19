import { NextApiRequest } from 'next';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const config = {
	api: {
		externalResolver: true,
	},
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req: NextApiRequest, res) {
	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Connection', 'keep-alive');
	res.setHeader('Content-Encoding', 'none');

	const { messages } = JSON.parse(req.body) as {
		messages: ChatCompletionRequestMessage[];
	};

	const completion = await openai.createCompletion(
		{
			model: 'gpt-3.5-turbo-instruct',
			temperature: 0.6,
			prompt: `
			From the chat conversation below, generate a short title for it.
			Response must be just the title of words between 3 to 8 words.
			The title must be the same language as the language of the conversation.

			conversation:
			${messages.map(i => `${i.role}: ${i.content}.`).join('\n')}
			`,
			stream: true,
		},

		{ responseType: 'stream' },
	);

	// @ts-expect-error
	completion.data.on('data', data => {
		res.write(data.toString());
	});
}
