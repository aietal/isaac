import cookie from 'cookie';
import initStripe from 'stripe';
import { supabase } from '../../../utils/supabase';

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
	const { priceId } = req.query;

	const lineItems = [
		{
			price: priceId,
			quantity: 1,
		},
	];

	const session = await stripe.checkout.sessions.create({
		customer: stripe_customer,
		mode: req.query.mode,
		payment_method_types: ['card', 'us_bank_account', 'sepa_debit'],
		line_items: lineItems,
		success_url: 'https://isaaceditor.com/success',
		cancel_url: 'https://isaaceditor.com/cancelled',
		allow_promotion_codes: true,
	});

	res.send({
		id: session.id,
	});
};

export default handler;
