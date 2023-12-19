import { LogoInApp } from '@components/landing/Logo';
import { Badge } from '@components/ui/badge';
import { useUser } from '@context/user';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import React from 'react';

const HeaderLogo = () => {
	const { user } = useUser();
	const { push } = useRouter();

	return (
		<div className={clsx('flex items-center gap-2')}>
			<LogoInApp className="pl-2 h-8 w-auto" />
			<Badge
				className="rounded-xl mt-0.5 py-0 px-1.5 bg-isaac hover:bg-isaac border-isaac"
				onClick={() => push('/#pricing')}
			>
				<span className="text-[10px]">
					{user?.is_subscribed ? 'PRO' : 'FREE'}
				</span>
			</Badge>
		</div>
	);
};

export default HeaderLogo;
