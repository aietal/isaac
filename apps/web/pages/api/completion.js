import { performCompletion } from '../../utils/stream_response'

export default async function (req, res) {
	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Connection', 'keep-alive');
	res.setHeader('Content-Encoding', 'none');

	// if word count is less than 5, return error
	if (req.body.split(' ').length < 5) {
		res.write(
			'data: "Please write a few words and try again. Kindly - Isaac 🧑‍🚀"\n\n',
		);
		return res.end();
	}

	await performCompletion(res, {
		model: 'gpt-3.5-turbo',
		messages: [
			{
				role: 'system',
				content:
					'You are a prolific academic research writing assistant. Your main job is to continue text input by users with one or maximum two perfectly fitting and insightful sentences. You always listen to additional requests from the user.',
			},

			{
				role: 'user',
				content: req.body,
			},
		],
		temperature: 0.3,
		max_tokens: 2000,
		top_p: 1,
		stream: true,
	});

	function generatePrompt(input) {
		return ` The text is:
  ${input}
  `;
	}
}
