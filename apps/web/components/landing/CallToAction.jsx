import { CircleBackground } from '@components/landing/CircleBackground';
import { Container } from '@components/landing/Container';
import { LandingButton } from '@components/ui/button-landing';
import Link from 'next/link';

export function CallToAction() {
	return (
		<section
			id="get-free-shares-today"
			className="relative overflow-hidden bg-gray-900 py-20 sm:py-28"
		>
			<div className="absolute left-20 top-1/2 -translate-y-1/2 sm:left-1/2 sm:-translate-x-1/2">
				<CircleBackground color="#fff" className="animate-spin-slower" />
			</div>
			<Container className="relative">
				<div className="mx-auto max-w-md sm:text-center">
					<h2 className="text-3xl font-medium tracking-tight text-white sm:text-4xl">
						Isaac is waiting for you
					</h2>
					<p className="mt-4 text-lg text-gray-300">
						Start writing your first paper in just 30 seconds. <br /> Once you
						start, you won&apos;t want to stop.
					</p>
					<div className="mt-8 flex justify-center">
						<LandingButton asChild variant="secondary">
							<Link href="/signup">Start writing for free</Link>
						</LandingButton>
					</div>
				</div>
			</Container>
		</section>
	);
}
