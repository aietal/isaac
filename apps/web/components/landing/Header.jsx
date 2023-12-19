import { Container } from '@components/landing/Container';
import { Logo } from '@components/landing/Logo';
import { NavLinks } from '@components/landing/NavLinks';
import {
	LandingButton,
	landingButtonVariants,
} from '@components/ui/button-landing';
import { Popover } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useUser } from '../../context/user';

function MenuIcon(props) {
	return (
		<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
			<path
				d="M5 6h14M5 18h14M5 12h14"
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function ChevronUpIcon(props) {
	return (
		<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
			<path
				d="M17 14l-5-5-5 5"
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function MobileNavLink({ children, ...props }) {
	return (
		<Popover.Button
			as={Link}
			className="block text-base leading-7 tracking-tight text-gray-700"
			{...props}
		>
			{children}
		</Popover.Button>
	);
}

export function Header() {
	const { user, logout } = useUser();
	return (
		<header className="bg-gray-50">
			<nav>
				<Container className="relative z-50 flex justify-between py-8">
					<div className="relative z-10 flex items-center gap-16">
						<Link href="/" aria-label="Home">
							<Logo className="h-10 w-auto" />
						</Link>
						<div className="hidden lg:flex lg:gap-10">
							<NavLinks />
						</div>
					</div>
					<div className="flex items-center gap-6">
						<Popover className="lg:hidden">
							{({ open }) => (
								<>
									<Popover.Button
										className="relative z-10 -m-2 inline-flex items-center rounded-lg stroke-gray-900 p-2 hover:bg-gray-200/50 hover:stroke-gray-600 active:stroke-gray-900 [&:not(:focus-visible)]:focus:outline-none"
										aria-label="Toggle site navigation"
									>
										{({ open }) =>
											open ? (
												<ChevronUpIcon className="h-6 w-6" />
											) : (
												<MenuIcon className="h-6 w-6" />
											)
										}
									</Popover.Button>
									<AnimatePresence initial={false}>
										{open && (
											<>
												<Popover.Overlay
													static
													as={motion.div}
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													exit={{ opacity: 0 }}
													className="fixed inset-0 z-0 bg-gray-300/60 backdrop-blur"
												/>
												<Popover.Panel
													static
													as={motion.div}
													initial={{ opacity: 0, y: -32 }}
													animate={{ opacity: 1, y: 0 }}
													exit={{
														opacity: 0,
														y: -32,
														transition: { duration: 0.2 },
													}}
													className="absolute inset-x-0 top-0 z-0 origin-top rounded-b-2xl bg-gray-50 px-6 pb-6 pt-32 shadow-2xl shadow-gray-900/20"
												>
													<div className="space-y-4">
														<MobileNavLink href="#secondary-features">
															Features
														</MobileNavLink>
														<MobileNavLink href="#reviews">
															Reviews
														</MobileNavLink>
														<MobileNavLink href="#pricing">
															Pricing
														</MobileNavLink>
														<MobileNavLink href="#faqs">FAQs</MobileNavLink>
													</div>

													{user ? (
														<div className="mt-8 flex flex-col gap-4">
															<Link
																href="/editor"
																className={landingButtonVariants({
																	variant: 'default',
																})}
															>
																Go to editor
															</Link>
															<LandingButton onClick={logout} variant="ghost">
																Sign out
															</LandingButton>
														</div>
													) : (
														<div className="mt-8 flex flex-col gap-4">
															<LandingButton asChild>
																<Link href="/signup">
																	Start writing for free
																</Link>
															</LandingButton>
															<LandingButton
																asChild
																variant="outline"
																className="bg-gray-50"
															>
																<Link href="/signin">Sign in</Link>
															</LandingButton>
														</div>
													)}
												</Popover.Panel>
											</>
										)}
									</AnimatePresence>
								</>
							)}
						</Popover>
						<div className="hidden md:inline-flex gap-2">
							{user ? (
								<>
									<Link
										href="/editor"
										className={landingButtonVariants({ variant: 'default' })}
									>
										Go to editor
									</Link>

									<LandingButton onClick={logout} variant="ghost">
										Sign out
									</LandingButton>
								</>
							) : (
								<>
									<LandingButton
										asChild
										variant="outline"
										className="hidden lg:flex bg-gray-50"
									>
										<Link href="signin">Sign in </Link>
									</LandingButton>

									<LandingButton asChild className="hidden lg:flex">
										<Link href="signup"> Start writing for free</Link>
									</LandingButton>
								</>
							)}
						</div>
					</div>
				</Container>
			</nav>
		</header>
	);
}
