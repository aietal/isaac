import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { webSearch } from 'web-browser/ddgSearch';

const userConfig = {
	numWebResults: 3,
	webAccess: true,
	region: 'wt-wt',
	timePeriod: '',
	language: 'en',
	promptUUID: 'default',
	trimLongText: false,
} as const;

async function processQuery(query: string, config: typeof userConfig) {
	const searchRequest = {
		query,
		timerange: config.timePeriod,
		region: config.region,
	};

	return await webSearch(searchRequest, config.numWebResults);
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== 'POST')
		return res.status(405).json({
			error: 'Only POST requests are allowed',
		});

	const { query } = req.body;

	if (!query)
		return res.status(400).json({
			error: 'No query provided',
		});

	const results = await processQuery(query, userConfig);

	if (!results) {
		return res.status(404).json({
			error: 'No results found',
		});
	}

	return res.status(200).json(results);
}
