/* eslint-disable import/no-anonymous-default-export */
export default async function (req, res) {
	const doi = req.body.doi;
	const SEMANTIC_SCHOLAR_API_KEY = process.env.SEMANTIC_SCHOLAR_API_KEY;

	const response = await fetch(
		`https://api.semanticscholar.org/graph/v1/paper/${doi}?fields=title,abstract,authors,url,journal,citationCount,year,openAccessPdf,tldr,citationStyles,publicationTypes,externalIds`,
		{
			method: 'GET',
			headers: {
				'x-api-key': SEMANTIC_SCHOLAR_API_KEY,
			},
		},
	);

	const data = await response.json();

	res.status(200).json({ paperDetails: data });
}
