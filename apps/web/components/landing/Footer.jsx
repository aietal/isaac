import { Container } from '@components/landing/Container';
import { TextField } from '@components/landing/Fields';
import { Logomark } from '@components/landing/Logo';
import { NavLinks } from '@components/landing/NavLinks';
import { Button } from '@components/ui/button';

export function Footer() {
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
						<nav className="mt-11 flex gap-8">
							<NavLinks />
						</nav>
					</div>
				</div>
				<div className="flex flex-col items-center border-t border-gray-200 pb-12 pt-8 md:flex-row-reverse md:justify-between md:pt-6">
					<form className="invisible flex w-full justify-center md:w-auto">
						<TextField
							type="email"
							aria-label="Email address"
							placeholder="Email address"
							autoComplete="email"
							required
							className="w-60 min-w-0 shrink"
						/>
						<Button type="submit" color="cyan" className="ml-4 flex-none">
							<span className="hidden lg:inline">Join our newsletter</span>
							<span className="lg:hidden">Join newsletter</span>
						</Button>
					</form>
					<p className="mt-6 text-sm text-gray-500 md:mt-0">
						&copy; AI et al, Inc. {new Date().getFullYear()}. All rights
						reserved.
					</p>
				</div>
			</Container>
		</footer>
	);
}
