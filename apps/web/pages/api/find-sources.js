import { performCompletion } from '../../utils/stream_response';

export default async function (req, res) {
	const search_query = await performCompletion(
		res,
		{
			model: 'gpt-3.5-turbo',
			messages: [
				{
					role: 'system',
					content:
						'You are a helpful assistant that extracts the most relevant keywords from any statement. You always add a + between every word of your output (eg. income+gpd+growth). You can under no circumstance output more than 5 words. If a keyword has several words you still need to add a + between every word. You return the keywords in the input language and in English. If the input language is in English, you just return in English. The structure should be as follows: First you write the keywords in the input language like so: keyword+keyword+keyword+keyword+keyword then you write "BREAK" and then you write the English keywords like so: keyword+keyword+keyword+keyword+keyword".',
				},

				{ role: 'user', content: req.body.input },
			],
			temperature: 0.0,
			max_tokens: 3500,
			top_p: 1,
			frequency_penalty: 0,
			presence_penalty: 0,
		},
		true,
	);

	// split the search query into parts before and after BREAK in the string to get the keywords in the input language and in English
	const search_query_parts = search_query.split('BREAK');
	const search_query_input_language = search_query_parts[0];
	const search_query_english = search_query_parts[1];

	const response = await fetch(
		`http://api.semanticscholar.org/graph/v1/paper/search?query=${search_query_input_language}&limit=100&fields=title,url,abstract,authors,citationStyles,journal,citationCount,year,externalIds`,
		{
			method: 'GET',
			headers: {
				'x-api-key': 'HuvjUTy0Kv5TIrVU4JGjPS78hcVZiBv7wAbwSHO8',
			},
		},
	);

	const data = await response.json();

	if (!data.data) {
		const response = await fetch(
			`http://api.semanticscholar.org/graph/v1/paper/search?query=${search_query_english}&limit=100&fields=title,url,abstract,authors,citationStyles,journal,citationCount,year,externalIds`,
			{
				method: 'GET',
				headers: {
					'x-api-key': 'HuvjUTy0Kv5TIrVU4JGjPS78hcVZiBv7wAbwSHO8',
				},
			},
		);

		const englishData = await response.json();

		if (!englishData.data) {
			res.status(200).json({ literature: englishData.data });
		} else {
			const rankedResults = englishData.data.sort(
				(a, b) => b.citationCount - a.citationCount,
			);

			// Limit the results to the top 5
			const limitedResults = rankedResults.slice(0, 5);

			res.status(200).json({ literature: limitedResults });
		}
	} else if (data.data) {
		const rankedResults = data.data.sort(
			(a, b) => b.citationCount - a.citationCount,
		);

		// Limit the results to the top 5
		const limitedResults = rankedResults.slice(0, 5);

		res.status(200).json({ literature: limitedResults });
	}
}
