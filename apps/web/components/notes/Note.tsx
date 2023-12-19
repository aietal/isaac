import RichTextArea from '@components/core/RichTextArea';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import { useHover } from '@mantine/hooks';
import { MoreHorizontal, Trash } from 'lucide-react';
// import { getRelativeDate } from '@utils/dateUtils';
import clsx from 'clsx';
import { EditorState } from 'lexical';
import React from 'react';

type Props = {
	editable?: boolean;
	isNew?: boolean;
	onClick: () => void;
	initialState?: EditorState | string;
	createdAt?: Date;
	onDeleteClick?: () => void;
};

const Note = ({
	editable,
	isNew,
	onDeleteClick,
	onClick,
	initialState,
	createdAt,
}: Props) => {
	const { ref, hovered } = useHover();
	return (
		<div className="relative rounded-md" ref={ref}>
			<RichTextArea
				onClick={onClick}
				editable={!!editable}
				editorState={initialState}
				contentClassName={clsx(
					'text-sm line-clamp-5',
					hovered ? 'shadow-lg dark:border-gray-500' : 'shadow-sm ',
					!editable && 'overflow-y-hidden',
				)}
				placeholder={editable ? 'Write a note...' : ''}
			/>
			{!editable && (
				<>
					<div className="absolute right-0 top-0 flex flex-col h-full justify-between items-end">
						<DropdownMenu>
							<DropdownMenuTrigger>
								<MoreHorizontal
									size={18}
									strokeWidth={1.2}
									className={clsx(
										'mr-2 mt-2 text-muted-foreground transition-opacity cursor-pointer',
										hovered ? 'opacity-100' : 'opacity-0',
									)}
								/>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem
									className="flex space-x-2 text-red-600"
									onClick={onDeleteClick}
								>
									<Trash size={18} strokeWidth={1.2} className={clsx('')} />
									<span>Delete</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>


				</>
			)}
		</div>
	);
};

export default Note;
