import { Container } from '@components/landing/Container';
import { Logo } from '@components/landing/Logo';
import { PricingCard } from '@components/landing/PricingCard';
import { pricingPlans } from 'data/pricingPlans';
import Link from 'next/link';

export default function Onboarding() {
	return (
		<>
			<main className="bg-gray-50 h-screen">
				<section
					id="pricing"
					aria-labelledby="pricing-title"
					className="border-t border-gray-200 py-20 sm:py-32 bg-gray-50"
				>
					<div className="mx-auto max-w-min">
						<Link href="/" aria-label="Home">
							<Logo className="h-10 max-w-min" />
						</Link>
					</div>
					<Container className="">
						<div className="mx-auto max-w-2xl text-center">
							<h2
								id="pricing-title"
								className="text-3xl font-medium tracking-tight text-gray-900"
							>
								You&apos;re one click away.
							</h2>
							<p className="mt-2 text-lg text-gray-600">
								Simple and straightforward pricing. No tricks.
							</p>
						</div>

						<div className="flex flex-col mx-auto mt-8 sm:mt-16 max-w-2xl items-center justify-center gap-x-4 sm:gap-x-8 gap-y-5 sm:gap-y-10 md:flex-row md:max-w-none">
							{pricingPlans
								.filter(i => !!i.priceId)
								.map(plan => (
									<PricingCard key={plan.name} {...plan} authenticated />
								))}
						</div>
						<p className="text-center my-10">
							Or stay on our{' '}
							<Link href="/editor" className="text-isaac font-bold">
								free plan
							</Link>{' '}
						</p>
					</Container>
				</section>
			</main>
		</>
	);
}
