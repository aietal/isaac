import { supabase } from '../../../utils/supabase';

const handler = async (req, res) => {
	// console.log('Received request body:', req.body); // Debug line
	try {
		await supabase.auth.api.setAuthCookie(req, res);
	} catch (error) {
		console.error('Supabase error:', error);
		res.status(500).send(error);
	}
};
export default handler;
