import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const createCompletion = async (req, res) => {
	const completion = await openai.createCompletion({
		model: 'text-davinci-002',
		prompt: generatePrompt(req.body.text, req.body.language),
		temperature: 0.6,
		max_tokens: 512,
	});
	res.status(200).json({ translation: completion.data.choices[0].text });
};

function generatePrompt(text, language) {
	return `Translate the following text into  ${language} :

 ${text}
`;
}

export default createCompletion;
