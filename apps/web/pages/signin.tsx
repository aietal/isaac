import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import React, { useState } from 'react';

import { AuthLayout } from '@components/landing/AuthLayout';
import { Icons } from '@components/landing/icons';
import { cn } from '@components/lib/utils';
import { LandingButton } from '@components/ui/button-landing';
import { LandingInput } from '@components/ui/input-landing';
import { Label } from '@components/ui/label';

import mixpanel from 'mixpanel-browser';
import { useUser } from '../context/user';

export default function Signin() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const { login, loginWithGoogle } = useUser();

	async function signInWithGoogle(e) {
		e.preventDefault();

		const { error } = await loginWithGoogle();
		mixpanel.track('Sign In', { provider: 'google' });

		if (error) {
			alert('error signing in');
		}
	}

	async function signInWithEmail(e) {
		e.preventDefault();
		setIsLoading(true);

		const { error, data } = await login({ email, password });

		if (error) {
			if (error.status === 400) {
				alert('Invalid email or password');
			} else {
				alert('Error signing in');
			}

			setIsLoading(false);
		} else {
			// Redirect user to Dashboard
			mixpanel.identify(data.user?.id);
			mixpanel.track('Sign In', { provider: 'email' });
			router.push(`/editor/`);
			setIsLoading(false);
		}
	}

	return (
		<>
			<Head>
				<title>Sign In - Isaac</title>
			</Head>
			<AuthLayout
				title="Sign in to your account"
				subtitle={
					<>
						Don’t have an account?{' '}
						<Link
							href="/signup"
							className="underline underline-offset-4 hover:text-[#0c0d1d]"
						>
							Sign up
						</Link>{' '}
						to register.
					</>
				}
			>
				<div className={cn('grid gap-6')}>
					<form onSubmit={signInWithEmail}>
						<div className="flex flex-col gap-4 min-w-[320px] md:min-w-[500px]">
							<div>
								<Label className="text-[#0f172a]" htmlFor="email">
									Email
								</Label>
								<LandingInput
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
								<div className="flex items-center justify-between mb-1">
									<Label className="text-[#0f172a]" htmlFor="password">
										Password
									</Label>
									<div className="text-sm">
										<Link
											href="/forgot-password"
											className="text-[#747476] hover:text-[#0c0d1d]"
										>
											Forgot password?
										</Link>
									</div>
								</div>

								<LandingInput
									id="password"
									placeholder="Choose a secure password"
									type="password"
									autoCapitalize="none"
									autoComplete="off"
									autoCorrect="off"
									className="mb-1"
									onChange={e => setPassword(e.target.value)}
									required
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
								Sign In With Email
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
						onClick={signInWithGoogle}
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
