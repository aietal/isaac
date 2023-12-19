import { Button } from '@components/ui/button';
import Link from 'next/link';
import React from 'react';

type Props = {
	target: 'AI' | 'storage' | 'model';
};

export const ProPlanUpgradeToast = ({ target }: Props) => {
	return (
		<div className="flex items-center justify-between w-full pl-4">
			<div>
				{target === 'AI' && (
					<>
						<p className="whitespace-nowrap">
							{"You've reached your daily request limit."}
						</p>
						<p className="whitespace-nowrap">
							Upgrade to continue or try again tomorrow.
						</p>
					</>
				)}
				{target === 'storage' && (
					<>
						<p className="whitespace-nowrap">
							{"You've reached your storage limit."}
						</p>
						<p className="whitespace-nowrap">
							Upgrade to get unlimited storage.
						</p>
					</>
				)}
				{target === 'model' && (
					<>
						<p className="whitespace-nowrap">
							{'GPT-4 is only available for Isaac Pro users.'}
						</p>
						<p className="whitespace-nowrap">
							Upgrade to access better models.
						</p>
					</>
				)}
			</div>
			<Button className="ml-2 h-6" variant="outline" asChild>
				<Link href="/onboarding">Upgrade</Link>
			</Button>
		</div>
	);
};

export const reachedTokenLimitToastStyle = { minWidth: 500 };
export const reachedStorageLimitToastStyle = { minWidth: 440 };
