import { Container } from '@components/landing/Container';
import { Logo } from '@components/landing/Logo';
import { Button } from '@components/ui/button';
import { useUser } from '@context/user';
import Link from 'next/link';

export function OnboardingHeader() {
	const { user } = useUser();
	return (
		<header className="bg-gray-50">
			<nav>
				<Container className="relative z-50 flex justify-between py-8">
					<div className="relative z-10 flex items-center gap-16">
						<Link href="/" aria-label="Home">
							<Logo className="h-10 w-auto" />
						</Link>
					</div>
					<div className="flex items-center gap-6">
						{user ? (
							<Button className="hidden lg:flex">
								<Link href={`/editor`}>Go To Editor</Link>
							</Button>
						) : (
							<>
								<Button asChild variant="outline" className="hidden lg:flex">
									<Link href="signin">Sign In </Link>
								</Button>
								<Button asChild className="hidden lg:flex">
									<Link href="signup"> Start writing for free</Link>
								</Button>
							</>
						)}
					</div>
				</Container>
			</nav>
		</header>
	);
}
