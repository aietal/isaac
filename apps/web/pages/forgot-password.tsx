import Head from 'next/head';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { supabase } from '../utils/supabase';

import React, { FormEvent, useState } from 'react';

import { AuthLayout } from '@components/landing/AuthLayout';
import { Icons } from '@components/landing/icons';
import { cn } from '@components/lib/utils';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';

export default function Signin() {
	const [email, setEmail] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [submitted, setSubmitted] = useState<boolean>(false);

	async function sendMagicLink(e: FormEvent) {
		e.preventDefault();
		const { error } = await supabase.auth.signIn(
			{
				email: email,
			},
			{
				redirectTo: 'https://isaaceditor.com/reset-password/',
			},
		);

		if (error) {
			toast.error(error.message);
		}

		setSubmitted(true);

		toast.success('Reset link sent!');
	}

	return (
		<>
			<Head>
				<title>Reset Password - Isaac</title>
			</Head>
			<AuthLayout
				title="Reset Your Password"
				subtitle={
					<>
						Don’t have an account?{' '}
						<Link
							href="/signup"
							className="underline underline-offset-4 hover:text-primary"
						>
							Sign up
						</Link>{' '}
						to register.
					</>
				}
			>
				<div className={cn('grid gap-6')}>
					{submitted ? (
						<div className="max-w-xl mx-auto min-w-[500px] bg-green-600 p-8 rounded-md text-secondary flex inline-flex items-center justify-center">
							<Icons.check className="mr-2 h-4 w-4" />
							<span className="ml-2">Check Your Email</span>
						</div>
					) : (
						<form onSubmit={sendMagicLink}>
							<div className="flex flex-col gap-4 min-w-[500px]">
								<div>
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										placeholder="name@example.com"
										type="email"
										autoCapitalize="none"
										autoComplete="email"
										autoCorrect="off"
										onChange={e => setEmail(e.target.value)}
										required
									/>
									<p className="mt-0.5 text-sm text-muted-foreground">
										Enter your email address to reset your password.
									</p>
								</div>

								<Button
									type="submit"
									disabled={isLoading}
									className="mt-4 w-full"
								>
									{isLoading && (
										<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
									)}
									Reset Password
								</Button>
							</div>
						</form>
					)}
				</div>
			</AuthLayout>
		</>
	);
}
