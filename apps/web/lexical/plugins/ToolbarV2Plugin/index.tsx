import { cn } from '@components/lib/utils';
import { useUIStore } from '@context/ui.store';
import useSelectionEffect from '@hooks/lexical/useSelectionEffect';
import useToggle from '@hooks/useToggle';
import { $createCodeNode, $isCodeNode } from '@lexical/code';
import { $createListNode, $isListNode } from '@lexical/list';
import { INSERT_IMAGE_COMMAND } from '@lexical/plugins/ImagesPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import {
	$createHeadingNode,
	$createQuoteNode,
	$isHeadingNode,
	$isQuoteNode,
} from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { INSERT_TABLE_COMMAND } from '@lexical/table';

import { motion } from 'framer-motion';
import {
	$createParagraphNode,
	$getSelection,
	$isParagraphNode,
	$isRangeSelection,
	$isTextNode,
	ElementNode,
	FORMAT_TEXT_COMMAND,
	TextFormatType,
	TextNode,
} from 'lexical';
import {
	AlignJustify,
	Bold,
	Code,
	FunctionSquare,
	Heading1,
	Heading2,
	Heading3,
	Heading4,
	ImagePlus,
	Info,
	Italic,
	List,
	ListOrdered,
	LucideIcon,
	MinusSquare,
	Strikethrough,
	Table,
	TextQuote,
} from 'lucide-react';
import {
	ComponentProps,
	ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';
import DocumentStatsPopover from './DocumentStatsPopover';

type BlockTypeData = {
	name: string;
	icon: LucideIcon;
	create: () => ElementNode;
};

const blockTypeData = {
	h1: {
		icon: Heading1,
		name: 'Section',
		create: () => $createHeadingNode('h1'),
	},
	h2: {
		icon: Heading2,
		name: 'Subsection',
		create: () => $createHeadingNode('h2'),
	},
	h3: {
		icon: Heading3,
		name: 'Subsubsection',
		create: () => $createHeadingNode('h3'),
	},
	h4: {
		icon: Heading4,
		name: 'Part',
		create: () => $createHeadingNode('h4'),
	},
	p: {
		icon: AlignJustify,
		name: 'Paragraph',
		create: () => $createParagraphNode(),
	},
	ol: {
		icon: ListOrdered,
		name: 'Numbered List',
		create: () => $createListNode('number'),
	},
	ul: {
		icon: List,
		name: 'Bulleted List',
		create: () => $createListNode('bullet'),
	},
	blockquote: {
		icon: TextQuote,
		name: 'Quote',
		create: () => $createQuoteNode(),
	},
	code: {
		icon: Code,
		name: 'Code Block',
		create: () => $createCodeNode(),
	},
} satisfies Record<string, BlockTypeData>;

export default function ToolbarV2Plugin() {
	return (
		<div
			role="toolbar"
			className="sticky h-min top-8 left-full  -mr-8 md:-mr-10 flex flex-col gap-4 text-gray-500 dark:text-gray-400 z-10 "
		>
			<BlockTypeButtons />
			<FormatButtons />
			<InsertButtons />
			<DocumentStatsPopover>
				<ToolbarButton label="Document statistics" Icon={Info} />
			</DocumentStatsPopover>
		</div>
	);
}

function Group(props: { children: ReactNode }) {
	return (
		<div role="group" className="flex flex-col relative">
			{props.children}
		</div>
	);
}

/**
 * Collapsible group of buttons. Closes when clicking on anything (button or outside)
 *
 * @example
 * // Heading selector. Shows IconHeading button.
 * // When clicked, shows IconH1, IconH2, IconH3 buttons.
 *
 * <Collapsible toggle={<ToolbarButton Icon={IconHeading} />}>
 * 	<ToolbarButton Icon={IconH1} label="Heading 1" />
 * 	<ToolbarButton Icon={IconH2} label="Heading 2" />
 * 	<ToolbarButton Icon={IconH3} label="Heading 3" />
 * </Collapsible>
 */
function Collapsible(props: {
	children?: ReactNode;
	show?: boolean;
	toggle: ReactNode;
}) {
	const [show, showOn, showOff, toggleShow] = useToggle(props.show);

	useEffect(() => {
		if (props.show) {
			showOn();
		} else {
			showOff();
		}
	}, [props.show]);

	useEffect(() => {
		if (show) {
			setTimeout(() => {
				document.addEventListener('click', showOff);
			}, 0);
			return () => document.removeEventListener('click', showOff);
		}
	}, [show]);

	return (
		<Group>
			<motion.div
				role="button"
				tabIndex={-1}
				onClick={toggleShow}
				animate={show ? 'hide' : 'show'}
				variants={{
					// The higher the delay, the more bounce the close anim has
					show: { height: 'auto', transition: { delay: 0.01 } },
					hide: { height: 0 },
				}}
				transition={{ duration: 0.2, ease: 'circOut' }}
			>
				{props.toggle}
			</motion.div>
			<motion.div
				className="text-gray-700 dark:text-gray-200"
				animate={show ? 'show' : 'hide'}
				variants={{
					show: {
						height: 'auto',
						transitionEnd: {
							overflow: 'visible',
						},
					},
					hide: {
						height: 0,
						opacity: 0,
						overflow: 'hidden',
					},
				}}
				transition={{ duration: 0.2, ease: 'circOut' }}
			>
				{props.children}
			</motion.div>
		</Group>
	);
}

function ToolbarButton({
	Icon,
	label,
	className,
	...props
}: ComponentProps<'button'> & { Icon: LucideIcon; label?: string }) {
	const btn = (
		<button
			{...props}
			className={cn(
				'flex justify-center items-center w-8 h-8 rounded-md hover:bg-gray-100 active:bg-gray-200 hover:text-black transition-all dark:hover:bg-gray-700 dark:active:bg-gray-600 dark:hover:text-white',
				className,
			)}
		>
			<Icon size={20} strokeWidth={1.4} />
		</button>
	);

	if (label) {
		return (
			<div className="relative group/btn">
				{btn}
				<div
					role="tooltip"
					className="group-hover/btn:opacity-100 group-hover/btn:translate-x-0 -translate-x-2 opacity-0 transition-all duration-100 absolute right-full top-1/2 -translate-y-1/2 px-2 py-1 text-sm font-medium whitespace-nowrap bg-white dark:bg-gray-900"
				>
					{label}
				</div>
			</div>
		);
	}

	return btn;
}

// FIXME this doesn't work, it always returns null because the fns $isHeadingNode and such
// are false for some reason
// This means the BlockTypeButton is always showing the h1 icon instead of the icon
// of the node under the cursor.
function getNodeTag(node: TextNode): keyof typeof blockTypeData | null {
	if ($isHeadingNode(node)) {
		return node.getTag() as Exclude<
			ReturnType<typeof node.getTag>,
			'h5' | 'h6'
		>;
	}

	if ($isParagraphNode(node)) return 'p';

	if ($isListNode(node)) {
		return node.getType() === 'number' ? 'ol' : 'ul';
	}

	if ($isQuoteNode(node)) return 'blockquote';

	if ($isCodeNode(node)) return 'code';

	return null;
}

function BlockTypeButtons() {
	const [editor] = useLexicalComposerContext();

	// Node under cursor (or under focus point if multiple nodes are selected)
	const [focusNode, setFocusNode] = useState<TextNode | null>(null);
	const tag = useMemo(() => {
		if (!focusNode) return 'h1';
		const tag = getNodeTag(focusNode);
		if (!tag || !(tag in blockTypeData)) return 'h1';
		return tag;
	}, [focusNode]);

	const data = useMemo<BlockTypeData>(() => blockTypeData[tag], [tag]);

	// Get block type of node under cursor.
	// If it's a text node, set focusNode to it, otherwise set focusNode to null.
	useSelectionEffect(selection => {
		if ($isRangeSelection(selection)) {
			const node = selection.focus.getNode();

			if ($isTextNode(node)) {
				setFocusNode(node);
				return false;
			}
		}

		setFocusNode(null);
	});

	const setNodeType = (createElement: () => ElementNode) =>
		useCallback(() => {
			editor.update(() => {
				const selection = $getSelection();

				if ($isRangeSelection(selection)) {
					$setBlocksType(selection, createElement);
				}
			});
		}, [focusNode, editor]);

	return (
		<Collapsible toggle={<ToolbarButton Icon={data.icon} />}>
			{Object.entries(blockTypeData).map(([type, data]) => (
				<ToolbarButton
					key={type}
					Icon={data.icon}
					onClick={setNodeType(data.create)}
					label={data.name}
				/>
			))}
		</Collapsible>
	);
}

function FormatButtons() {
	// const [hasBold, setHasBold] = useState(false);
	// const [hasItalic, setHasItalic] = useState(false);
	// const [hasStrikethrough, setHasStrikethrough] = useState(false);
	// const [hasUnderline, setHasUnderline] = useState(false);
	// const [hasSubscript, setHasSubscript] = useState(false);
	// const [hasSuperscript, setHasSuperscript] = useState(false);
	// const [hasCode, setHasCode] = useState(false);

	// useSelectionEffect(selection => {
	// 	if ($isRangeSelection(selection)) {
	// 		setHasBold(selection.hasFormat('bold'));
	// 		setHasItalic(selection.hasFormat('italic'));
	// 		setHasUnderline(selection.hasFormat('underline'));
	// 		setHasStrikethrough(selection.hasFormat('strikethrough'));
	// 		setHasSubscript(selection.hasFormat('subscript'));
	// 		setHasSuperscript(selection.hasFormat('superscript'));
	// 		setHasCode(selection.hasFormat('code'));
	// 	}
	// }, COMMAND_PRIORITY_LOW);

	const [editor] = useLexicalComposerContext();

	const dispatchCommand = (format: TextFormatType) =>
		useCallback(() => {
			editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
		}, [editor]);

	return (
		<Group>
			<ToolbarButton Icon={Bold} onClick={dispatchCommand('bold')} />
			<ToolbarButton Icon={Italic} onClick={dispatchCommand('italic')} />
			{/* <ToolbarButton Icon={IconUnderline} onClick={dispatchCommand('underline')} /> */}
			<ToolbarButton
				Icon={Strikethrough}
				onClick={dispatchCommand('strikethrough')}
			/>
			{/* <ToolbarButton Icon={IconSubscript} onClick={dispatchCommand('subscript')} /> */}
			{/* <ToolbarButton Icon={IconSuperscript} onClick={dispatchCommand('superscript')} /> */}
			<ToolbarButton Icon={Code} onClick={dispatchCommand('code')} />
		</Group>
	);
}

function InsertButtons() {
	const [editor] = useLexicalComposerContext();
	const setShowEquationModal = useUIStore(s => s.setShowEquationModal);

	const handleInsertImage = useCallback(
		(files: FileList | null) => {
			const reader = new FileReader();
			reader.onload = function () {
				if (typeof reader.result === 'string') {
					const src = reader.result;
					const filename = files?.[0]?.name || '';
					editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
						src,
						altText: filename,
					});
				}
				return '';
			};
			if (files !== null) {
				reader?.readAsDataURL(files[0]);
			}
		},
		[editor],
	);

	const addTable = useCallback(() => {
		editor.dispatchCommand(INSERT_TABLE_COMMAND, {
			columns: '3',
			rows: '3',
			includeHeaders: false,
		});
	}, [editor]);

	const showFileDialog = useCallback(() => {
		document.getElementById('toolbar_file_input')?.click();
	}, []);

	const showEquationModal = useCallback(() => {
		setShowEquationModal(true);
	}, []);

	const insertDivider = useCallback(() => {
		editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
	}, [editor]);

	return (
		<Group>
			<>
				<ToolbarButton
					label="Image"
					Icon={ImagePlus}
					onClick={showFileDialog}
				/>
				<input
					type="file"
					id="toolbar_file_input"
					accept="image/png, image/gif, image/jpeg"
					className="hidden"
					onChange={e => handleInsertImage(e.target.files)}
				/>
			</>
			<ToolbarButton label="Table" Icon={Table} onClick={() => addTable()} />
			<ToolbarButton
				label="Equation"
				Icon={FunctionSquare}
				onClick={showEquationModal}
			/>
			<ToolbarButton
				label="Divider"
				Icon={MinusSquare}
				onClick={insertDivider}
			/>
		</Group>
	);
}
