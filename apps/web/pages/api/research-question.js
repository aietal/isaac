import { performCompletion } from '../../utils/stream_response';

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req, res) {
	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Connection', 'keep-alive');
	res.setHeader('Content-Encoding', 'none');

	await performCompletion(res, {
		model: 'gpt-4-1106-preview',
		messages: [
			{
				role: 'system',
				content: `You are a research assistant that conducts academic literature reviews. You always respond in ${req.query.editorLanguage} If asked a research question, you will give a detailed, nuanced and precise answer. You will provide in-text citations in APA format. Your output should have the following structure: 1. Answer the research question 2. Add two line breaks 3. Write References. 4. Add two line breaks. 5. List the references you used to answer the research question. You list the references in APA format, including URLs if available. You list the references in alphabetical order by the last name of the first author.
		If you are not asked a research question, you respond with "Please ask a research question. Kindly - Isaac 🧑‍🚀". The most important thing is that you never invent sources.`,
			},

			{ role: 'user', content: req.body },
		],
		temperature: 0,
		max_tokens: 4000,
		top_p: 1,
		stream: true,
	});
}
