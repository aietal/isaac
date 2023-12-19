import Ripple from '@components/ui/ripple';
import { useUser } from '@context/user';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

import { Container } from '@components/landing/Container';
import { LandingButton } from '@components/ui/button-landing';

import logoHarvard from '@components/images/logos/harvard.svg';
import logoMichigan from '@components/images/logos/michigan.svg';
import logoStanford from '@components/images/logos/stanford.svg';
import logoYale from '@components/images/logos/yale.svg';

import logoMIT from '@components/images/logos/mit.svg';
import logoRWTH from '@components/images/logos/rwth.svg';

import TypedText from './TypedText';

export function Hero() {
	const { user } = useUser();

	return (
		<div className="overflow-hidden py-4 md:py-40	 lg:pb-32 xl:pb-36">
			{/* <RetroGrid /> */}
			<Container>
				<Ripple />

				<div className="flex flex-col items-center justify-center">
					<div className="text-center max-w-2xl">
						<h1 className="text-5xl font-bold tracking-tight text-gray-900">
							Research, edit, write. <br />
							With AI at your side.
						</h1>

						<p className="mt-4 text-2xl text-gray-600">
							The AI-native workspace for <br className="sm:hidden" />
							<TypedText />
						</p>

						<div className="mt-20 flex flex-wrap gap-x-6 gap-y-4 justify-center">
							{user ? (
								<LandingButton asChild className="z-10">
									<Link href="/editor">Go to editor</Link>
								</LandingButton>
							) : (
								<div className="flex flex-col z-10 ">
									<LandingButton asChild>
										<Link href="/signup">Start writing for free</Link>
									</LandingButton>
									<span className="text-sm mt-2 ml-0.5 text-muted-foreground">
										Free forever. No credit card required. ❤️
									</span>
								</div>
							)}
						</div>
					</div>

					<div className="mt-8 md:mt-20 text-center">
						<p className="text-sm mt-2 font-semibold text-gray-900">
							Join more than +25,179 researchers & students
						</p>
						<ul
							role="list"
							className="mx-auto mt-8 flex max-w-xl flex-wrap justify-center gap-x-10 gap-y-8"
						>
							{[
								['Harvard', logoHarvard],
								['Stanford', logoStanford],
								['Yale', logoYale],
								['Michigan', logoMichigan, 'hidden xl:block'],
								['MIT', logoMIT],
								['RWTH', logoRWTH],
								// ['Cornell', logoCornell],
								// ['HuffPost', logoHuffpost, 'hidden xl:block'],
							].map(([name, logo, className]) => (
								<li key={name} className={clsx('flex', className)}>
									<Image
										src={logo}
										alt={name}
										className="h-8 max-w-min filter grayscale opacity-50"
										unoptimized
									/>
								</li>
							))}
						</ul>
					</div>
				</div>
			</Container>
		</div>
	);
}
