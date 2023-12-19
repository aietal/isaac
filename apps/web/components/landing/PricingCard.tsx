import { Logomark } from '@components/landing/Logo';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { loadStripe } from '@stripe/stripe-js';
import clsx from 'clsx';
import Link from 'next/link';

function CheckIcon(props) {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
			<path
				d="M9.307 12.248a.75.75 0 1 0-1.114 1.004l1.114-1.004ZM11 15.25l-.557.502a.75.75 0 0 0 1.15-.043L11 15.25Zm4.844-5.041a.75.75 0 0 0-1.188-.918l1.188.918Zm-7.651 3.043 2.25 2.5 1.114-1.004-2.25-2.5-1.114 1.004Zm3.4 2.457 4.25-5.5-1.187-.918-4.25 5.5 1.188.918Z"
				fill="currentColor"
			/>
			<circle
				cx="12"
				cy="12"
				r="8.25"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

interface PricingCardProps {
	name: string;
	price: string;
	description: string;
	features: string[];
	featured?: boolean;
	logomarkClassName: string;
	authenticated: boolean;
	priceId?: string;
	oldPrice?: string;
}

export function PricingCard({
	name,
	price,
	description,
	features,
	featured = false,
	logomarkClassName,
	authenticated,
	priceId,
	oldPrice,
}: PricingCardProps) {
	const processSubscription = priceId => async () => {
		const mixpanel = (await import('mixpanel-browser')).default;
		mixpanel.track('Clicked Subscribe');
		const mode = name === '7 days plan' ? 'payment' : 'subscription';
		const axios = (await import('axios')).default;
		const { data } = await axios.get(`/api/subscription/${priceId}`, {
			params: { mode },
		});
		const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
		await stripe.redirectToCheckout({ sessionId: data.id });
	};
	return (
		<section
			className={clsx(
				'flex flex-col overflow-hidden rounded-3xl p-6 shadow-lg shadow-gray-900/5',
				featured ? 'bg-gray-900 lg:order-non ' : 'bg-white',
			)}
		>
			<h3
				className={clsx(
					'flex items-center text-sm font-semibold',
					featured ? 'text-white' : 'text-gray-900',
				)}
			>
				<Logomark className={clsx('h-6 w-6 flex-none', logomarkClassName)} />
				<span className="ml-4">{name}</span>

				{name === 'Yearly' && (
					<Badge
						className="ml-2 bg-isaac hover:bg-isaac border-isaac"
						variant="default"
					>
						Most Popular
					</Badge>
				)}
			</h3>

			<p
				className={clsx(
					'relative mt-5 flex text-3xl tracking-tight items-center',
					featured ? 'text-white' : 'text-gray-900',
				)}
			>
				{' '}
				<span className="text-muted-foreground line-through text-[25px]">
					{' '}
					{oldPrice}{' '}
				</span>{' '}
				&nbsp;
				{price}
			</p>
			<p
				className={clsx(
					'mt-3 text-sm',
					featured ? 'text-gray-300' : 'text-gray-700',
				)}
			>
				{description}
			</p>
			<div className="order-last mt-6">
				<ul
					role="list"
					className={clsx(
						'-my-2 divide-y text-sm',
						featured
							? 'divide-gray-800 text-gray-300'
							: 'divide-gray-200 text-gray-700',
					)}
				>
					{features.map(feature => (
						<li key={feature} className="flex py-2">
							<CheckIcon
								className={clsx(
									'h-6 w-6 flex-none',
									featured ? 'text-white' : 'text-muted-foreground',
								)}
							/>
							<span className="ml-4">{feature}</span>
						</li>
					))}
				</ul>
			</div>
			{authenticated ? (
				<Button
					className={clsx('mt-6')}
					aria-label={`Get started with the ${name} plan for ${price}`}
					variant={featured ? 'secondary' : 'default'}
					onClick={processSubscription(priceId)}
				>
					{priceId ? 'Subscribe' : 'Sign up for free'}
				</Button>
			) : (
				<Button
					asChild
					className={clsx('mt-6')}
					aria-label={`Get started with the ${name} plan for ${price}`}
					variant={featured ? 'secondary' : 'default'}
				>
					<Link href="/signup">
						{priceId ? 'Sign up to subscribe' : 'Just Sign Up!'}
					</Link>
				</Button>
			)}
		</section>
	);
}
