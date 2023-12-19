import Head from 'next/head';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { AuthLayout } from '@components/landing/AuthLayout';
import { Icons } from '@components/landing/icons';
import { cn } from '@components/lib/utils';
import { LandingButton } from '@components/ui/button-landing';
import { LandingInput } from '@components/ui/input-landing';
import { Label } from '@components/ui/label';
import { useRouter } from 'next/router';

import mixpanel from 'mixpanel-browser';
import { useUser } from '../context/user';
import { supabase } from '../utils/supabase';

export default function Signup() {
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();
	const { user, loginWithGoogle } = useUser();

	async function signUpWithEmail(e) {
		e.preventDefault();
		setIsLoading(true);
		mixpanel.track('Sign Up', { provider: 'email' });
		const { user, error } = await supabase.auth.signUp({
			email: email,
			password: password,
		});

		if (error) {
			alert('error signing up');
			setIsLoading(false);
		} else {
			// Redirect user to Dashboard
			router.push(`/editor`);
			setIsLoading(false);
		}
	}

	async function signUpWithGoogle(e) {
		e.preventDefault();
		mixpanel.track('Sign Up', { provider: 'google' });

		const { error } = await loginWithGoogle();

		if (error) {
			alert('error signing in');
		}
	}

	useEffect(() => {
		// Redirect to /editor if user exists
		if (user) {
			router.push('/editor');
		}

		// Reload the page if url query params include refresh=true
		if (router.query.refresh) {
			setTimeout(router.reload, 500);
		}
	}, [router, user]);

	return (
		<>
			<Head>
				<title>Sign Up - Isaac</title>
			</Head>
			<AuthLayout
				title="Create your Isaac account"
				subtitle={
					<>
						Already registered?{' '}
						<Link
							href="/signin"
							className="underline underline-offset-4 hover:text-primary"
						>
							Sign in
						</Link>{' '}
						to your account.
					</>
				}
			>
				<div className={cn('grid gap-6')}>
					<form onSubmit={signUpWithEmail}>
						<div className="flex flex-col gap-4 min-w-[320px] md:min-w-[500px]">
							<div>
								<Label className="text-[#0f172a]" htmlFor="email">
									Email
								</Label>
								<LandingInput
									className=""
									id="email"
									placeholder="name@example.com"
									type="email"
									autoCapitalize="none"
									autoComplete="email"
									autoCorrect="off"
									onChange={e => setEmail(e.target.value)}
									required
								/>
							</div>
							<div>
								<Label className="text-[#0f172a]" htmlFor="password">
									Password
								</Label>
								<LandingInput
									id="password"
									className="mb-1"
									placeholder="Choose a secure password"
									type="password"
									autoCapitalize="none"
									autoComplete="off"
									autoCorrect="off"
									onChange={e => setPassword(e.target.value)}
									required
								/>
								<Label className="text-[#0f172a]" htmlFor="repeatPassword">
									Repeat Password
								</Label>
								<LandingInput
									id="reapeatPassword"
									placeholder="Repeat your password"
									type="password"
									autoCapitalize="none"
									autoComplete="off"
									autoCorrect="off"
								/>
							</div>
							<LandingButton
								type="submit"
								disabled={isLoading}
								className="mt-4 w-full"
							>
								{isLoading && (
									<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
								)}
								Sign up with email
							</LandingButton>
						</div>
					</form>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t border-gray-300" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-white px-2 text-[#747476]">
								Or continue with
							</span>
						</div>
					</div>
					<LandingButton
						variant="outline"
						type="button"
						disabled={isLoading}
						onClick={signUpWithGoogle}
						className="bg-white"
					>
						{isLoading ? (
							<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
						) : (
							<Icons.google className="mr-2 h-4 w-4" />
						)}{' '}
						Google
					</LandingButton>
				</div>
			</AuthLayout>
		</>
	);
}
