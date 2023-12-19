/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from 'next';

interface RequestBody {
	search_query: string;
	year_range: string;
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
	const { search_query, year_range }: RequestBody = req.body;
	const SEMANTIC_SCHOLAR_API_KEY = process.env.SEMANTIC_SCHOLAR_API_KEY;

	const response = await fetch(
		`http://api.semanticscholar.org/graph/v1/paper/search?query=${search_query}&year=${year_range}&limit=100&fields=title,abstract,authors,url,journal,citationCount,year,externalIds,openAccessPdf,publicationTypes`,
		{
			method: 'GET',
			headers: {
				'x-api-key': SEMANTIC_SCHOLAR_API_KEY,
			},
		},
	);

	const data = await response.json();
	res.status(200).json({ literature: data.data || [] });
}
