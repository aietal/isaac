import { getDbInstance } from '@utils/pgClient';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServiceSupabase } from '../../utils/supabase';
import { createEmbedding } from '@utils/create_embedding';

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
	const { prompt, projectId } = req.body as {
		prompt: string;
		projectId: string;
	};

	console.log({ prompt, projectId });
	try {
		const input = {
			input: prompt,
			model: 'text-embedding-ada-002',
		};

		const db = getDbInstance(); // Initialize the database connection

		const supabase = getServiceSupabase();

		const { data: projectReferences, error: projectReferencesError } =
			await supabase.from('uploads').select('id').eq('project_id', projectId);

		if (projectReferencesError) {
			// console.log(projectReferencesError); // Commented out the console.log statement
			// Handle the error
		} else {
			const projectReferencesIds = projectReferences.map(item => item.id);
			const embedding = await createEmbedding(input);
			const documents = await db.query(
				`
				SELECT *
				FROM document_embeddings
				WHERE to_tsvector('english', content) @@ plainto_tsquery('english', $1)  -- Full text search
				AND upload_id = ANY($2::uuid[])  -- Filter by upload_id
				ORDER BY embedding <-> vector($3)  -- Semantic search
				LIMIT 5
				`,
				[prompt, projectReferencesIds, toSql(embedding)],
			);
			console.log({ documents });
			res.json(documents);
		}
	} catch (error) {
		console.error(error);
		res.status(500).send('Server Error');
	}
}
