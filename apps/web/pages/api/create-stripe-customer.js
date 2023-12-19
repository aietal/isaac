import initStripe from 'stripe';
import { getServiceSupabase } from '../../utils/supabase';

const handler = async (req, res) => {
	if (req.query.API_ROUTE_SECRET !== process.env.API_ROUTE_SECRET) {
		return res.status(401).send('You are not authorized to call this API');
	}

	try {
		const stripe = initStripe(process.env.STRIPE_SECRET_KEY);

		const customer = await stripe.customers.create({
			email: req.body.record.email,
		});

		const supabase = getServiceSupabase();

		const { error } = await supabase
			.from('profile')
			.update({
				stripe_customer: customer.id,
			})
			.eq('id', req.body.record.id)
			.select()
			.single();

		if (error) {
			throw error;
		}

		res.send({ message: `stripe customer created: ${customer.id}` });
	} catch (error) {
		res.status(500).json(error.message);
	}
};

export default handler;
