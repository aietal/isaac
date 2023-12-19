'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';
import * as React from 'react';

import { cn } from '@components/lib/utils';

const RangeSlider = React.forwardRef<
	React.ElementRef<typeof SliderPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
	<SliderPrimitive.Root
		ref={ref}
		className={cn(
			'relative flex w-full touch-none select-none items-center',
			className,
		)}
		{...props}
		minStepsBetweenThumbs={1}
	>
		<SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-accent">
			<SliderPrimitive.Range className="absolute h-full bg-primary" />
		</SliderPrimitive.Track>
		<SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border-[3.5px] border-primary bg-secondary ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
		<SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border-[3.5px] border-primary bg-secondary ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
	</SliderPrimitive.Root>
));
RangeSlider.displayName = SliderPrimitive.Root.displayName;

export { RangeSlider };
