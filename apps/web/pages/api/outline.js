/* eslint-disable import/no-anonymous-default-export */
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
	const completion = await openai.createCompletion({
		model: 'text-davinci-003',
		prompt: generatePrompt(req.body.topic),
		temperature: 0.3,
		max_tokens: 1504,
		top_p: 1,
		frequency_penalty: 0,
		presence_penalty: 0,
	});
	res.status(200).json({ outline: completion.data.choices[0].text });
}

function generatePrompt(topic) {
	return ` Create an outline for an academic paper on ${topic}`;
}
