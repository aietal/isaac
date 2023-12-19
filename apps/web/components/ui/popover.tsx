'use client';

import { cn } from '@components/lib/utils';
import * as RadixPopover from '@radix-ui/react-popover';
import { forwardRef } from 'react';

export const Popover = RadixPopover.Root;

export const PopoverTrigger = RadixPopover.Trigger;

export const PopoverAnchor = RadixPopover.Anchor;

export const PopoverContent = forwardRef<
	React.ElementRef<typeof RadixPopover.Content>,
	React.ComponentPropsWithoutRef<typeof RadixPopover.Content>
>(function PopoverContent(
	{ className, align = 'center', sideOffset = 4, ...props },
	ref,
) {
	return (
		<RadixPopover.Portal>
			<RadixPopover.Content
				ref={ref}
				align={align}
				sideOffset={sideOffset}
				className={cn(
					'z-50 w-72 rounded-md border bg-popover animate-in p-4 text-popover-foreground shadow-md outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
					className,
				)}
				{...props}
			/>
		</RadixPopover.Portal>
	);
});
