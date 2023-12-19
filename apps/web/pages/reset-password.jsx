import { OnboardingFooter } from '@components/onboarding/OnboardingFooter';
import { OnboardingHeader } from '@components/onboarding/OnboardingHeader';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../utils/supabase';

const ResetPassword = () => {
	const [password, setPassword] = useState('');
	const router = useRouter();

	async function updatePassword(e) {
		e.preventDefault();

		const { user, error } = await supabase.auth.update({ password: password });

		if (error) {
			toast.error('Something went wrong');
			return;
		}

		if (user) {
			router.push(`/editor/` + user?.id);
		}
	}

	return (
		<div className="flex flex-col min-h-screen bg-gray-50 overflow-hidden">
			{/*  Site header */}

			<OnboardingHeader />

			{/*  Page content */}
			<main className="grow ">
				{/*  Page illustration */}

				<section className="relative ">
					<div className="max-w-6xl mx-auto px-4  sm:px-6 relative">
						<div className="pt-32 pb-12 md:pt-40 md:pb-20">
							{/* Page header */}
							<div className="max-w-5xl mx-auto text-center pb-12 md:pb-16">
								<h1 className="h1 text-stone-700 mb-4">
									Choose Your New Password
								</h1>
								<span className="text-xl text-neutral-500">
									Please choose a new secure password!
								</span>
							</div>

							{/* Contact form */}

							<form className="max-w-xl mx-auto" onSubmit={updatePassword}>
								<div className="flex flex-wrap -mx-3 mb-5">
									<div className="w-full px-3">
										<label
											className="block text-stone-700 text-sm font-medium mb-1"
											htmlFor="new-password"
										>
											New Password <span className="text-red-600">*</span>
										</label>
										<Input
											id="new-password"
											type="password"
											placeholder="Enter your new password"
											required
											onChange={e => setPassword(e.target.value)}
										/>
									</div>
								</div>
								<div className="flex flex-wrap -mx-3 mb-5">
									<div className="w-full px-3">
										<label
											className="block textstone-700 text-sm font-medium mb-1"
											htmlFor="repeat-new-password"
										>
											Repeat New Password{' '}
											<span className="text-red-600">*</span>
										</label>
										<Input
											id="repeat-new-password"
											type="password"
											placeholder="Repeat your new password"
										/>
									</div>
								</div>

								<Button>
									<span>Update Password</span>
									<svg
										className="w-3 h-3 shrink-0 mt-px ml-2"
										viewBox="0 0 12 12"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											className="fill-current"
											d="M6.602 11l-.875-.864L9.33 6.534H0v-1.25h9.33L5.727 1.693l.875-.875 5.091 5.091z"
										/>
									</svg>
								</Button>
							</form>
						</div>
					</div>
				</section>
			</main>

			{/*  Site footer */}
			<OnboardingFooter />
		</div>
	);
};

export default ResetPassword;
