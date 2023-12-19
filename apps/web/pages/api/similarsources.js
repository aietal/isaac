import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const createCompletion = async (req, res) => {
	const completion = await openai.createCompletion({
		model: 'text-davinci-002',
		prompt: generatePrompt(req.body.citation),
		temperature: 0.6,
		max_tokens: 512,
	});
	res.status(200).json({ similarsources: completion.data.choices[0].text });
};

function generatePrompt(citation) {
	return `Show me similar papers to the following one:

 ${citation}
`;
}

export default createCompletion;
