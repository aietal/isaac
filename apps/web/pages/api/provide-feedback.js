import { performCompletion } from '../../utils/stream_response';

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req, res) {
	const completion = await performCompletion(res, {
		model: 'gpt-3.5-turbo',
		messages: [
			{
				role: 'system',
				content: `You are only allowed to answer in ${req.body.language}. You are an intelligent, critical and demanding research assistant that checks academic papers. When you're provided with a text input you list in bullet points, what can be improved about the text input.
        You must grade the text out of 100 on every one of the following categories and say how each category can be improved: clarity, accuracy, structure, and style. You have very high standards for grading. You only give a grade above 70 if there is not much that can be improved about the text input. You always provide specific examples for each categories of things you would change in the text input.
          If you think nothing can be improved, you say "I have no further improvements" in ${req.body.language}. Your answer is always in markdown format. The category headings are always bold and followed by a line break and a horizontal divider after each category.`,
			},
			{
				role: 'user',
				content: generatePrompt(req.body.text, req.body.language),
			},
		],
		temperature: 0.5,
		max_tokens: 3000,
		top_p: 1,
		frequency_penalty: 0,
		presence_penalty: 0,
	}, true);
	res.status(200).json({ feedback: completion });
}

function generatePrompt(text, language) {
	return `The following text input is from my academic paper. Please give me feedback on it. Your feedback must be in ${language}.
  ${text}
  `;
}
