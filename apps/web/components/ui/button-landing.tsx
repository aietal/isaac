import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@components/lib/utils';

const landingButtonVariants = cva(
	'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-[#FAF8F3] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
	{
		variants: {
			variant: {
				default: 'bg-[#0c0d1d] text-[#F5F8FA] hover:bg-[#0c0d1d]/90',
				destructive: 'bg-[#FF0000] text-[#F5F8FA] hover:bg-[#FF0000]/90',
				outline:
					'border border-[#D4D4D4] bg-[#FAF8F3] hover:bg-[#191711]/[0.08] hover:text-[#1C233B] shadow-sm',
				secondary: 'bg-[#F2F2F4] text-[#191A1D] hover:bg-[#F2F2F4]/80',
				ghost: 'hover:bg-[#191711]/[0.08] hover:[#1C233B]',
				link: 'text-[#0c0d1d] underline-offset-4 hover:underline',
			},
			size: {
				default: 'h-10 px-4 py-2',
				sm: 'h-9 rounded-md px-3',
				lg: 'h-11 rounded-md px-8',
				icon: 'h-10 w-10',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof landingButtonVariants> {
	asChild?: boolean;
}

const LandingButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : 'button';
		return (
			<Comp
				className={cn(landingButtonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);
LandingButton.displayName = 'Button';

export { LandingButton, landingButtonVariants };
