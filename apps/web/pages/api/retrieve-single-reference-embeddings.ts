import { createEmbedding } from '@utils/create_embedding';
import { getDbInstance } from '@utils/pgClient';
import { NextApiRequest, NextApiResponse } from 'next';

function toSql(value) {
	if (!Array.isArray(value)) {
		throw new Error('expected array');
	}
	return JSON.stringify(value);
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const { prompt, uploadId } = req.body as {
		prompt: string;
		uploadId: string;
	};

	try {
		const input = {
			input: prompt,
			model: 'text-embedding-ada-002',
		};

		const db = getDbInstance(); // Initialize the database connection

		// Get upload_id from query parameters

		if (!uploadId) {
			return res
				.status(400)
				.json({ error: 'Missing uploadId query parameter' });
		}

		const embedding = await createEmbedding(input);
		const documents = await db.query(
			`
            SELECT *
            FROM document_embeddings
            WHERE to_tsvector('english', content) @@ plainto_tsquery('english', $1)  -- Full text search
            AND upload_id = $2  -- Use the provided upload_id
            ORDER BY embedding <-> vector($3)  -- Semantic search
            LIMIT 5
            `,
			[prompt, uploadId, toSql(embedding)],
		);
		console.log({ documents });

		res.json(documents);
	} catch (error) {
		console.error(error);
		res.status(500).send('Server Error');
	}
}
