/* eslint-disable import/no-anonymous-default-export */
export default async function (req, res) {
	const DOI = req.body.search_query;

	const response = await fetch(
		`https://api.citeas.org/product/http://api.citeas.org/product/${DOI}?email=eimen@aietal.com`,
	);

	const data = await response.json();

	console.log({ response });

	res.status(200).json({ citation: data.citations[0].citation });
}
