import Link from 'next/link';

import { Logo } from '@components/landing/Logo';

import Meteors from '@components/ui/meteors';

function BackgroundIllustration(props) {
	return (
		<svg
			viewBox="0 0 1090 1090"
			aria-hidden="true"
			fill="none"
			preserveAspectRatio="none"
			{...props}
		>
			<circle cx={545} cy={545} r="544.5" />
			<circle cx={545} cy={545} r="480.5" />
			<circle cx={545} cy={545} r="416.5" />
			<circle cx={545} cy={545} r="352.5" />
		</svg>
	);
}

export function AuthLayout({ title, subtitle, children }) {
	return (
		<main className="flex pt-16 sm:py-28 bg-gray-50 items-center justify-center">
			<div className="mx-auto flex items-center w-full max-w-2xl min-w-2xl flex-col px-4 sm:px-6">
				<Link href="/" aria-label="Home">
					<Logo className="h-10 max-w-min" />
				</Link>
				<div></div>
				<div className="relative mt-12 sm:mt-16">
					{/* TODO: Fix z-index of background illustration */}
					{/* <BackgroundIllustration
						width="1090"
						height="1090"
						className="absolute -top-7 left-1/2 -z-10 h-[788px] -translate-x-1/2 stroke-gray-300/30 [mask-image:linear-gradient(to_bottom,white_20%,transparent_75%)] sm:-top-9 sm:h-auto text-black"
					/> */}
					<h1 className="text-center text-2xl font-medium tracking-tight text-gray-900">
						{title}
					</h1>
					{subtitle && (
						<p className="mt-3 text-center text-lg text-gray-600">{subtitle}</p>
					)}
				</div>
				<div className="-mx-4 mt-10 flex-auto bg-white px-4 py-10 shadow-lg shadow-gray-900/10 sm:mx-0 sm:flex-none sm:rounded-lg sm:p-24">
					{children}
				</div>
			</div>
		</main>
	);
}
