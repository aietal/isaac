import { Button } from '@components/ui/button';
import { Textarea } from '@components/ui/textarea';
import { useUIStore } from '@context/ui.store';
import useDeleteDocumentThread from '@hooks/api/useDocumentThreads.delete';
import useCreateThreadComment from '@hooks/api/useThreadsComments.create';
import useDeleteThreadComment from '@hooks/api/useThreadsComments.delete';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useClickOutside, useHover, useMergedRef } from '@mantine/hooks';
import { getRelativeDate } from '@utils/dateUtils';
import clsx from 'clsx';
import { Check, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { ThreadComment, ThreadPosition } from 'types/threadComments';

type Props = {
	comments: ThreadComment[];
	hovered: boolean;
	quote?: string;
	onHover?: (hovered: boolean) => void;
} & Partial<ThreadPosition>;

const yOffset = 135;
const CommentThreadCard = ({
	threadId,
	comments,
	hovered,
	markNodeKey,
	onHover,
	y,
	x,
}: Props) => {
	const [editor] = useLexicalComposerContext();
	const [expand, setExpand] = useState(false);
	const showCommentInputBox = useUIStore(s => s.showCommentInputBox);
	const { ref: hoverRef, hovered: hoveredInternal } = useHover();
	const clickOutsideRef = useClickOutside(() => {
		setExpand(false);
	});

	const mergedRef = useMergedRef(hoverRef, clickOutsideRef);

	const { mutateAsync: deleteMainThread } = useDeleteDocumentThread(editor);
	const { mutateAsync: addComment } = useCreateThreadComment();
	const { mutateAsync: deleteSubComment } = useDeleteThreadComment();
	// get comment based on date
	const [firstComment, ...remainingComments] = comments.reverse();
	const minimizeComments = remainingComments.length > 1 && !expand;

	useEffect(() => {
		onHover?.(hoveredInternal);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hoveredInternal]);

	const handleDeleteMainThread = (e: React.MouseEvent) => {
		e.stopPropagation();
		comments.length > 1
			? confirm('Are you sure to delete the comment?') &&
			  deleteMainThread({ threadId, markNodeKey })
			: deleteMainThread({ threadId, markNodeKey });
	};

	if (y === 0) {
		return null;
	}

	return (
		<div
			ref={mergedRef}
			className={clsx(
				'absolute rounded border border-gray-200 dark:border-gray-800 w-full transition-all p-2 bg-white dark:bg-neutral-950',
				hovered || hoveredInternal ? 'shadow-lg scale-105' : 'shadow-xs',
				expand && 'scale-105',
				showCommentInputBox && 'pointer-events-none',
				`mark-node-key-${markNodeKey}`,
			)}
			style={{
				top: y - yOffset,
				left: x,
				zIndex: hovered || expand ? 10000 : 100 + Number(markNodeKey),
			}}
			onClick={() => setExpand(true)}
		>
			<div className="flex justify-between ">
				<div className="text-sm flex gap-2 font-semibold">
					<div className="h-5 w-5 rounded bg-gray-200 flex justify-center dark:bg-neutral-800">
						<span className="text-xs">
							{firstComment.author.slice(0, 2).toUpperCase()}
						</span>
					</div>
					<p className="text-xs mb-2">
						<span className=" font-semibold">{firstComment.author}</span>
						{' · '}
						<span className="opacity-50">
							{getRelativeDate(new Date(firstComment.timeStamp))}
						</span>
					</p>
				</div>
				<div
					className={clsx(
						'text-xs transition-opacity flex gap-1',
						hovered || expand ? 'opacity-100' : 'opacity-0',
					)}
				>
					<Trash
						strokeWidth={1.2}
						size={16}
						className="opacity-50 hover:opacity-80 cursor-pointer text-red-700"
						onClick={handleDeleteMainThread}
					/>
				</div>
			</div>
			<p className="text-sm mt-2 whitespace-pre-wrap">{firstComment.content}</p>
			<div className="flex flex-col gap-2 my-2 ">
				{minimizeComments && (
					<div className="flex justify-center border-t text-sm pt-2 opacity-70">
						{`Show more comments (${remainingComments.length})`}
					</div>
				)}
				{!minimizeComments &&
					remainingComments.map(comment => (
						<SubComment
							key={comment.id}
							author={comment.author}
							onDelete={() =>
								deleteSubComment({ toDeleteId: comment.id, comments, threadId })
							}
							text={comment.content}
							timestamp={new Date(comment.timeStamp)}
						/>
					))}
			</div>
			<SubCommentInput
				isVisible={expand}
				onSubmit={t =>
					addComment({ content: t, previousComments: comments, threadId })
				}
			/>
		</div>
	);
};

export default CommentThreadCard;

type SubCommentInputProps = {
	isVisible: boolean;
	onSubmit: (text: string) => void;
};

const SubCommentInput = ({ isVisible, onSubmit }: SubCommentInputProps) => {
	const [text, setText] = useState('');

	// When it is open resets text to ""
	useEffect(() => {
		if (isVisible) {
			setText('');
		}
	}, [isVisible]);

	return (
		<>
			<div
				className={clsx(
					'relative  transition-all',
					isVisible ? 'h-auto' : 'h-0 overflow-y-hidden',
				)}
			>
				<Textarea
					className="p-1 resize-none"
					onChange={e => setText(e.target.value)}
					value={text}
					onKeyDown={e => {
						if (e.key === 'Enter' && !e.shiftKey) {
							e.preventDefault();
							onSubmit(text);
							setText('');
						}
					}}
				/>
				<div className="absolute flex gap-1 bottom-0 right-0 p-1">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => {
							onSubmit(text);
							setText('');
						}}
						className={clsx('p-1 h-6 w-6 text-muted-foreground ')}
					>
						<Check strokeWidth={1.4} size={16} />
					</Button>
				</div>
			</div>
		</>
	);
};

type SubCommentProps = {
	onDelete: () => void;
	text: string;
	author: string;
	timestamp: Date;
};

const SubComment = ({ onDelete, text, author, timestamp }: SubCommentProps) => {
	const { ref, hovered } = useHover();

	return (
		<div className="border-l-2 border-l-gray-200 pl-3" ref={ref}>
			<div className="flex justify-between">
				<p className="text-xs mb-2">
					<span className=" font-semibold">{author}</span>
					{' · '}
					<span className="opacity-50">{getRelativeDate(timestamp)}</span>
				</p>
				<Trash
					strokeWidth={1.2}
					className={clsx(
						'cursor-pointer text-red-700 transition-opacity',
						hovered ? 'opacity-50 hover:opacity-80' : 'opacity-0',
					)}
					size={16}
					onClick={onDelete}
				/>
			</div>
			<p className="text-sm whitespace-pre-wrap">{text}</p>
		</div>
	);
};
