import { Button } from '@components/ui/button';
import { Panel, useUIStore } from '@context/ui.store';
import clsx from 'clsx';
import React, { memo } from 'react';
import { FaUserAstronaut } from 'react-icons/fa';

const BottomLeftFab = memo(() => {
	const openPanel = useUIStore(s => s.openPanel);
	return (
		<div className="flex fixed bottom-5 right-5 z-10 space-x-1 md:hidden">
			<Button
				variant="ghost"
				className={clsx(
					'rounded-full w-min p-3',
					'text-gray-700 dark:text-black',
				)}
				onClick={() => openPanel(Panel.CHAT)}
			>
				<FaUserAstronaut className="lg:mr-2" />
			</Button>
		</div>
	);
});

export default BottomLeftFab;
