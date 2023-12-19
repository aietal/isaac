import {
	INSERT_ORDERED_LIST_COMMAND,
	INSERT_UNORDERED_LIST_COMMAND,
	REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { $createHeadingNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import {
	$createParagraphNode,
	$getSelection,
	$isRangeSelection,
} from 'lexical';
import TextBlockStyle from '../../../ui/TextStyleIcon';

import { Button } from '@components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';

import {
	Check,
	ChevronDown,
	Heading1,
	Heading2,
	Heading3,
	Heading4,
	Heading5,
	List,
	ListOrdered,
	Text,
} from 'lucide-react';

const blockTypeToBlockName = {
	code: 'Code Block',
	h1: 'Part',
	h2: 'Section',
	h3: 'Subsection',
	h4: 'Subsubsection',
	h5: 'Paragraph',
	ol: 'Numbered List',
	paragraph: 'Standard',
	quote: 'Quote',
	ul: 'Bulleted List',
};

// TODO: Swich component to shadcn UI
function BlockOptionsDropdown({ editor, blockType }) {
	const formatParagraph = () => {
		if (blockType !== 'paragraph') {
			editor.update(() => {
				const selection = $getSelection();

				if ($isRangeSelection(selection)) {
					$setBlocksType(selection, () => $createParagraphNode());
				}
			});
		}
	};

	const formatHeading = headingSize => {
		if (blockType !== headingSize) {
			editor.update(() => {
				const selection = $getSelection();

				if ($isRangeSelection(selection)) {
					$setBlocksType(selection, () => $createHeadingNode(headingSize));
				}
			});
		}
	};

	const formatBulletList = () => {
		if (blockType !== 'ul') {
			editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND);
		} else {
			editor.dispatchCommand(REMOVE_LIST_COMMAND);
		}
	};

	const formatNumberedList = () => {
		if (blockType !== 'ol') {
			editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND);
		} else {
			editor.dispatchCommand(REMOVE_LIST_COMMAND);
		}
	};

	const size = 18;
	const strokeWidth = 1.5;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="block-controls px-2"
					aria-label="Formatting Options"
				>
					<div className="flex inline-flex items-center justify-between w-auto">
						<TextBlockStyle style={blockType} />
						<p className="w-auto mx-3 font-normal">
							{blockTypeToBlockName[blockType]}
						</p>
						<ChevronDown size={18} strokeWidth={1.5} />
					</div>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="center" sideOffset={10} className="w-[180px]">
				<DropdownMenuItem onClick={formatParagraph}>
					<Text
						className="mr-2 h-4 w-4"
						size={size}
						strokeWidth={strokeWidth}
					/>{' '}
					<span> Standard</span>{' '}
					{blockType === 'paragraph' ? (
						<Check
							className="h-4 w-4 absolute right-1"
							size={size}
							strokeWidth={strokeWidth}
						/>
					) : undefined}
				</DropdownMenuItem>

				<DropdownMenuSeparator />
				<DropdownMenuLabel className="text-xs">Sectioning</DropdownMenuLabel>

				<DropdownMenuItem onClick={() => formatHeading('h1')}>
					<Heading1
						className="mr-2 h-4 w-4"
						size={size}
						strokeWidth={strokeWidth}
					/>{' '}
					<span> Part </span>
					{blockType === 'h1' ? (
						<Check
							className="h-4 w-4 absolute right-1"
							size={size}
							strokeWidth={strokeWidth}
						/>
					) : undefined}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => formatHeading('h2')}>
					<Heading2
						className="mr-2 h-4 w-4"
						size={size}
						strokeWidth={strokeWidth}
					/>{' '}
					<span>Section</span>
					{blockType === 'h2' ? (
						<Check
							className="h-4 w-4 absolute right-1"
							size={size}
							strokeWidth={strokeWidth}
						/>
					) : undefined}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => formatHeading('h3')}>
					<Heading3
						className="mr-2 h-4 w-4"
						size={size}
						strokeWidth={strokeWidth}
					/>{' '}
					<span>Subsection</span>
					{blockType === 'h3' ? (
						<Check
							className="h-4 w-4 absolute right-1"
							size={size}
							strokeWidth={strokeWidth}
						/>
					) : undefined}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => formatHeading('h4')}>
					<Heading4
						className="mr-2 h-4 w-4"
						size={size}
						strokeWidth={strokeWidth}
					/>{' '}
					<span> Subsubsection</span>
					{blockType === 'h4' ? (
						<Check
							className="h-4 w-4 absolute right-1"
							size={size}
							strokeWidth={strokeWidth}
						/>
					) : undefined}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => formatHeading('h5')}>
					<Heading5
						className="mr-2 h-4 w-4"
						size={size}
						strokeWidth={strokeWidth}
					/>{' '}
					<span>Paragraph</span>
					{blockType === 'h5' ? (
						<Check
							className="h-4 w-4 absolute right-1"
							size={size}
							strokeWidth={strokeWidth}
						/>
					) : undefined}
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuLabel className="text-xs">Lists</DropdownMenuLabel>

				<DropdownMenuItem onClick={formatBulletList}>
					<List
						className="mr-2 h-4 w-4"
						size={size}
						strokeWidth={strokeWidth}
					/>{' '}
					<span>Bullet List</span>
					{blockType === 'ul' && <span className="active" />}
					{blockType === 'ul' ? (
						<Check
							className="h-4 w-4 absolute right-1"
							size={size}
							strokeWidth={strokeWidth}
						/>
					) : undefined}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={formatNumberedList}>
					<ListOrdered
						className="mr-2 h-4 w-4"
						size={size}
						strokeWidth={strokeWidth}
					/>{' '}
					<span>Numbered List</span>
					{blockType === 'ol' ? (
						<Check
							className="h-4 w-4 absolute right-1"
							size={size}
							strokeWidth={strokeWidth}
						/>
					) : undefined}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default BlockOptionsDropdown;
