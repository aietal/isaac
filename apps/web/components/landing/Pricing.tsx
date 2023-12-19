import { Container } from '@components/landing/Container';
import { PricingCard } from '@components/landing/PricingCard';
import { useUser } from '@context/user';
import { pricingPlans } from 'data/pricingPlans';

export function Pricing() {
	const { user } = useUser();
	return (
		<section
			id="pricing"
			aria-labelledby="pricing-title"
			className="border-t border-gray-200 bg-gray-100 py-20 sm:py-32"
		>
			<Container>
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
					{pricingPlans.map(plan => (
						<PricingCard key={plan.name} {...plan} authenticated={!!user} />
					))}
				</div>
				{/* <div className="mx-auto mt-16 max-w-2xl items-center gap-x-8 gap-y-10 sm:mt-20 lg:max-w-xl">
          {pricingPlans.map(plan => (
            <PricingCard key={plan.name} {...plan} />
          ))}
        </div> */}
			</Container>
		</section>
	);
}
