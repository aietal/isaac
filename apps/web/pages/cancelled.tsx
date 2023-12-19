import { OnboardingReviews } from '@components/landing/OnboardingReviews';
import { OnboardingFooter } from '@components/onboarding/OnboardingFooter';
import { OnboardingHeader } from '@components/onboarding/OnboardingHeader';
import { Button } from '@components/ui/button';
import { Toggle } from '@components/ui/toggle';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@components/ui/tooltip';
import { Clipboard } from 'lucide-react';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { toast } from 'react-hot-toast';

const Cancelled = () => {
	const copyToClipboard = () => {
		navigator.clipboard.writeText('ISAAC50'); //T-75 decide what type of content we want to copy
		toast.success('Discount code copied');
	};

	return (
		<>
			<Head>
				<title>Isaac Editor - Payment Cancelled</title>
				<meta
					property="og:title"
					content="Isaac Editor - AI-first Text Editor For Academic Writing"
					key="title"
				/>
				{/* TODO: Need to Put more description here
            Please follow the guidelines
            https://developer.chrome.com/docs/lighthouse/seo/meta-description/?utm_source=lighthouse&utm_medium=lr#meta-description-best-practices
        */}
				<meta
					name="description"
					content="Isaac Editor - AI-first Text Editor For Academic Writing"
				/>
			</Head>
			<div className="flex flex-col min-h-screen overflow-hidden bg-base ">
				{/*  Site header */}
				<OnboardingHeader />

				<main className="grow bg-gray-50">
					<section className="relative pt-12">
						<div className="relative w-full mx-auto px-4 sm:px-6">
							<div className="py-12 md:py-8">
								{/* Section header */}
								<div className=" mx-auto text-center pb-4">
									<h2 className="text-3xl mb-12 text-foreground">
										Limited-Time Offer!
									</h2>
									<div className="items-center justify-center text-lg space-x-2 md:flex">
										<span>If you change your mind, use</span>
										<span
											onClick={copyToClipboard}
											className="bg-isaac text-gray-50 px-4 rounded-md shadow-md cursor-pointer hover:bg-isaac-darker"
											title="Click to copy"
										>
											ISAAC50
										</span>
										<span>at checkout for a 50% discount!</span>
									</div>
									<p className="text-md mt-4">
										Click below to secure your limited-time discount before
										it&apos;s gone!
									</p>
									<Button asChild className="mt-6 mx-auto bg-black">
										<Link href="/onboarding">Yes, I Want My 50% Off!</Link>
									</Button>
									<OnboardingReviews />
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

export default Cancelled;
