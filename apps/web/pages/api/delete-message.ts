/* eslint-disable import/no-anonymous-default-export */
import { getDbInstance } from '@utils/pgClient';

export default async function handler(req, res) {
	const db = getDbInstance();
	try {
		const { id } = req.body;

		console.log({ id });

		// Define the SQL DELETE statement and the value to delete
		const query = `
      DELETE FROM chat_messages WHERE id = $1
    `;
		const value = [id];

		// Run the SQL DELETE statement
		await db.none(query, value);

		res.status(200).json({ status: 'success' });
	} catch (err) {
		console.error('Error deleting message from database', err);
		res.status(500).json({ status: 'error', message: err.message });
	}
}
