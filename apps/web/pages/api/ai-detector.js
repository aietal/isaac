/* eslint-disable import/no-anonymous-default-export */
export default async function (req, res) {
	const options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': process.env.X_RAPID_API_KEY,
			'X-RapidAPI-Host': 'ai-content-detector1.p.rapidapi.com',
		},
	};

	const response = await fetch(
		`https://ai-content-detector1.p.rapidapi.com/?text=${req.body.text}`,
		options,
	);

	const data = await response.json();

	console.log(data);

	res.status(200).json({ data: data });
}
