import { supabase } from '@utils/supabase';
import { OAuth } from 'oauth';

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req, res) {
	if (req.method === 'POST') {
		console.log(req);
	} else {
		res.status(405).end();
	}
}
