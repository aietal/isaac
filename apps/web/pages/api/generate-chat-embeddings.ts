/* eslint-disable import/no-anonymous-default-export */
import { createEmbedding } from '@utils/create_embedding';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const input = req.body.content;
	const embedding = await createEmbedding({
		input,
		model: 'text-embedding-ada-002',
	})
	// Return the embedding to the client side
	res.status(200).json({ status: 'success', embedding: embedding });
}
