import clsx from 'clsx';
import React, { ReactNode } from 'react';

type Props = {
	isActive?: boolean;
	onClick?: () => void;
	children: ReactNode;
};

const ToolbarButton = ({ isActive, onClick, children }: Props) => {
	return (
		<button
			className={clsx(
				'dark:hover:bg-[#dfe8fa4d] hover:bg-[#191711]/[0.08]',
				'flex items-center text-stone-700 cursor-pointer px-2 py-1 dark:text-neutral-300',
				isActive && 'font-bold bg-[#191711]/[0.08] ',
			)}
			onClick={onClick}
			aria-label="Format Bold"
		>
			{children}
		</button>
	);
};

export default ToolbarButton;
