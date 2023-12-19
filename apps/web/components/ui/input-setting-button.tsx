import { ButtonProps } from '@components/ui/button';
import React from 'react';

const InputSettingButton = (props: ButtonProps) => {
	return (
		<button
			{...props}
			className="flex text-xs items-center gap-1 px-2 py-1 transition-all duration-100 ease-in-out bg-white rounded-md border hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer dark:bg-neutral-950"
		>
			{props.children}
		</button>
	);
};

export default InputSettingButton;
