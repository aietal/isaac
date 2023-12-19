import { getDbInstance } from '@utils/pgClient';

export default async function handler(req, res) {
	// Initialize the client
	const db = getDbInstance();
	if (req.method === 'GET') {
		const userId = req.query.user_id; // Extract user_id from the query parameters
		const projectId = req.query.project_id; // Extract project_id from the query parameters
		const limit = parseInt(req.query.limit) || 50; // Set the default limit to 50 if not provided
		const offset = parseInt(req.query.offset) || 0; // Set the default offset to 0 if not provided
		const search = req.query.search || null; // Extract search text from the query parameters

		if (!userId || !projectId) {
			return res
				.status(400)
				.json({ message: 'userId and projectId are required' });
		}

		try {
			let documents;

			if (search) {
				// If there's a search term, use full-text search.
				const searchTerms = search.split(' ').join(' & ');
				documents = await db.any(
					`SELECT * FROM chat_messages WHERE user_id = $1 AND project_id = $2 AND to_tsvector('english', content) @@ plainto_tsquery('english', $2) ORDER BY created_at DESC LIMIT $3 OFFSET $4`,
					[userId, projectId, limit, offset, searchTerms],
				);
			} else {
				// If there's no search term, fetch all messages.
				documents = await db.any(
					`SELECT * FROM chat_messages WHERE user_id = $1 AND project_id = $2 ORDER BY created_at DESC LIMIT $3 OFFSET $4`,
					[userId, projectId, limit, offset],
				);
			}

			// Return the results.
			res.status(200).json(documents);
		} catch (err) {
			// If there was an error, return it.
			res.status(500).json({ message: err.message });
		}
	} else {
		// If the request method was not GET, return an error.
		res.status(405).json({ message: 'Method not allowed.' });
	}
}
