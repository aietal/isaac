import cookie from 'cookie';
import initStripe from 'stripe';
import { supabase } from '../../utils/supabase';

const handler = async (req, res) => {
	const { user } = await supabase.auth.api.getUserByCookie(req);

	if (!user) {
		return res.status(401).send('Unauthorized');
	}

	const token = cookie.parse(req.headers.cookie)['sb:token'];

	supabase.auth.session = () => ({
		access_token: token,
	});

	const {
		data: { stripe_customer },
	} = await supabase
		.from('profile')
		.select('stripe_customer')
		.eq('id', user?.id)
		.single();

	const stripe = initStripe(process.env.STRIPE_SECRET_KEY);

	const session = await stripe.billingPortal.sessions.create({
		customer: stripe_customer,
	});

	res.send({
		url: session.url,
	});
};

export default handler;
