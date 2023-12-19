import { OnboardingFooter } from '@components/onboarding/OnboardingFooter';
import { OnboardingHeader } from '@components/onboarding/OnboardingHeader';
import { Button } from '@components/ui/button';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import Confetti from 'react-confetti';

const Success = () => {
	return (
		<>
			<Head>
				<title>Isaac Editor - Successful Subscription</title>
				<meta
					property="og:title"
					content="Isaac Editor - AI-first Text Editor For Academic Writing"
					key="title"
				/>
				<meta
					name="description"
					content="Isaac Editor - AI-first Text Editor For Academic Writing"
				/>
			</Head>
			<div className="flex flex-col min-h-screen overflow-hidden bg-gray-50 ">
				{/*  Site header */}
				<OnboardingHeader />
				<Confetti />

				<main className="grow bg-gray-50">
					<section className="relative pt-24">
						<div className="relative max-w-6xl mx-auto px-4 sm:px-6">
							<div className="py-12 md:py-8">
								{/* Section header */}
								<div className="max-w-3xl mx-auto text-center pb-4">
									<h2 className="h2 font-red-hat-display mb-4 text-stone-700">
										Thank You for Subscribing! 🎉
									</h2>
									<p className="text-xl text-gray-400">
										You&apos;re awesome. Seriously.
									</p>
								</div>

								<div className="flex flex-col gap-2 items-center justify-center mt-12">
									<Link href="/editor/">
										<Button asChild>
											<Link href="/editor"> Start writing now</Link>
										</Button>
									</Link>
								</div>
							</div>
						</div>
					</section>
				</main>

				<OnboardingFooter />
			</div>
		</>
	);
};

export default Success;
