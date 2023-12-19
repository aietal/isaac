/* eslint-disable @typescript-eslint/no-var-requires */
import { buffer } from 'micro';
import initStripe from 'stripe';
import { getServiceSupabase } from '../../utils/supabase';

export const config = { api: { bodyParser: false } };

const handler = async (req, res) => {
	const stripe = initStripe(process.env.STRIPE_SECRET_KEY);
	const signature = req.headers['stripe-signature'];
	const signingSecret = process.env.STRIPE_SIGNING_SECRET;
	const reqBuffer = await buffer(req);

	let event;

	try {
		event = stripe.webhooks.constructEvent(reqBuffer, signature, signingSecret);
	} catch (error) {
		console.log(error);
		return res.status(400).send(`Webhook error: ${error.message}`);
	}

	const supabase = getServiceSupabase();

	const today = new Date();
	const expirationDate = new Date();
	expirationDate.setDate(today.getDate() + 7);

	switch (event.type) {
		case 'customer.subscription.updated':
			await supabase
				.from('profile')
				.update({
					is_subscribed: true,
					interval: event.data.object.items.data[0].plan.interval,
				})
				.eq('stripe_customer', event.data.object.customer);

			break;
		case 'customer.subscription.deleted':
			await supabase
				.from('profile')
				.update({
					is_subscribed: false,
					interval: null,
					plan: null,
				})
				.eq('stripe_customer', event.data.object.customer);
			break;

		case 'payment_intent.succeeded':
			if (event.data.object.amount === 1000) {
				await supabase
					.from('profile')
					.update({
						is_subscribed: true,
						// set expiration_date to today + 7 days
						expiration_date: expirationDate,
						plan: 'weekly',
					})
					.eq('stripe_customer', event.data.object.customer);
			}

			break;
	}

	res.send({ received: true });
};

export default handler;
