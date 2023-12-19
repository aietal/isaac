import * as React from 'react';

import { cn } from '../lib/utils';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

export const shadcnInputStyles =
	'text-black flex h-10 w-full rounded-lg border border-[#d4d4d4] focus:border-[#FAFAF9] bg-transparent px-3 py-2 text-sm ring-offset-[#FAFAF9] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#747476] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

const LandingInput = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(shadcnInputStyles, className)}
				ref={ref}
				{...props}
			/>
		);
	},
);
LandingInput.displayName = 'LandingInput';

export { LandingInput };
