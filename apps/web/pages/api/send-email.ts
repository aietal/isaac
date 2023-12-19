import { EmailTemplate } from '@components/emails/SignUpEmail';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.query.API_ROUTE_SECRET !== process.env.API_ROUTE_SECRET) {
		return res.status(401).send('You are not authorized to call this API');
	}

	try {
		const data = await resend.emails.send({
			from: 'Eimen at Isaac <eimen@aietal.com>',
			to: [req.body.record.email],
			subject: 'Thanks for signing up!',
			react: EmailTemplate(),
		});

		res.status(200).json(data);
	} catch (error) {
		res.status(400).json(error);
	}
};

export default handler;
