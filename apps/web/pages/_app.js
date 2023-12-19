import UserProvider from '@context/user';
import 'focus-visible';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { QueryClientProvider } from 'react-query';
import { IntercomProvider } from 'react-use-intercom';
import queryClient from 'utils/reactQuery';
import '../styles/globals.scss';

const ErrorBoundary = dynamic(() => import('@components/ErrorBoundary'), {
	ssr: false,
});

const TooltipProvider = dynamic(
	() => import('@components/ui/tooltip').then(module => module.TooltipProvider),
	{
		ssr: false,
	},
);

const Toaster = dynamic(
	() => import('react-hot-toast').then(module => module.Toaster),
	{ ssr: false },
);

function MyApp({ Component, pageProps }) {
	const [isMounted, setIsMounted] = useState(false);
	const INTERCOM_APP_ID = 'gzq1mrxe';

	useEffect(() => {
		import('mixpanel-browser').then(mixpanel => {
			mixpanel.default.init('ae6442cbfc6362b98e44a235a3694a54', {
				debug: false,
			});
		});

		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return (
		<>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<ErrorBoundary>
				<QueryClientProvider client={queryClient}>
					{/* //TODO: Remove user provider  */}
					<UserProvider>
						<IntercomProvider appId={INTERCOM_APP_ID}>
							<TooltipProvider delayDuration={400}>
								<Component {...pageProps} />
								<Toaster position="top-center" />
							</TooltipProvider>
						</IntercomProvider>
					</UserProvider>
				</QueryClientProvider>
			</ErrorBoundary>
		</>
	);
}

export default MyApp;
