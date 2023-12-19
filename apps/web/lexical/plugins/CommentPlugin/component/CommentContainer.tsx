import { Button } from '@components/ui/button';
import { useUIStore } from '@context/ui.store';
import clsx from 'clsx';
import React, { ReactNode } from 'react';

type Props = {
	children: ReactNode;
};

const CommentContainer = ({ children }: Props) => {
	const showDocumentComments = useUIStore(s => s.showDocumentComments);
	const activePanel = useUIStore(s => s.activePanel);
	const setShowDocumentComments = useUIStore(s => s.setShowDocumentComments);
	return (
		<div
			id="comment-container"
			className={clsx(
				showDocumentComments
					? activePanel
						? 'w-[280px]'
						: 'w-[300px]'
					: 'w-0 overflow-hidden',
				'flex-shrink-0 relative h-screen',
			)}
		>
			{children}
			<Button
				size="sm"
				variant="outline"
				onClick={() => setShowDocumentComments(false)}
				className={clsx(
					'bottom-5 w-[300px] z-[10000] rounded-full text-xs bg-[#fbfbfa] dark:bg-neutral-900 shadow-sm',
					showDocumentComments ? 'fixed' : 'block',
				)}
			>
				Hide Comments
			</Button>
		</div>
	);
};

export default CommentContainer;
