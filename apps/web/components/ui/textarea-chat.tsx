import { cn } from '@components/lib/utils';
import { forwardRef, memo } from 'react';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const TextareaChat = memo(
	forwardRef<HTMLTextAreaElement, TextareaProps>(
		({ className, ...props }, ref) => {
			return (
				<textarea
					className={cn(
						'flex w-full resize-none rounded-md bg-transparent py-2 px-3 placeholder:text-sm placeholder:text-neutral-400 outline-none focus:outline-none focus:border-none focus:ring-0 border-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-50',
						className,
					)}
					ref={ref}
					{...props}
				/>
			);
		},
	),
);
TextareaChat.displayName = 'TextareaChat';

export { TextareaChat };
