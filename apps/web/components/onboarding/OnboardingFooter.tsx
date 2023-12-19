import { Container } from '@components/landing/Container';
import { Logomark } from '@components/landing/Logo';

export function OnboardingFooter() {
	return (
		<footer className="border-t border-gray-200 bg-gray-50">
			<Container>
				<div className="flex flex-col items-start justify-between gap-y-12 pb-6 pt-16 lg:flex-row lg:items-center lg:py-16">
					<div>
						<div className="flex items-center text-gray-900">
							<Logomark className="h-10 w-10 flex-none fill-primary" />
							<div className="ml-4">
								<p className="text-base-font font-semibold">Isaac</p>
								<p className="mt-1 text-sm">
									Academic Writing. As it should be.
								</p>
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col items-center border-t border-gray-200 pb-12 pt-8 md:flex-row-reverse md:justify-between md:pt-6">
					<p className="mt-6 text-sm text-gray-500 md:mt-0">
						&copy; AI et al, Inc. {new Date().getFullYear()}. All rights
						reserved.
					</p>
				</div>
			</Container>
		</footer>
	);
}
