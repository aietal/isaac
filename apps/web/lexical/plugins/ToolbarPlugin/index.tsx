import { Button } from '@components/ui/button';

import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@components/ui/tooltip';
import { useUIStore } from '@context/ui.store';
import { useUser } from '@context/user';
import {
	$isCodeNode,
	getCodeLanguages,
	getDefaultCodeLanguage,
} from '@lexical/code';
import { $generateHtmlFromNodes } from '@lexical/html';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $isListNode, ListNode } from '@lexical/list';
import BlockOptionsDropdown from '@lexical/plugins/ToolbarPlugin/components/BlockOptionsDropdown';
import CodeSelect from '@lexical/plugins/ToolbarPlugin/components/CodeSelect';
import InsertObjectDropdown from '@lexical/plugins/ToolbarPlugin/components/InsertObjectDropdown';
import JustifyTextDropdown from '@lexical/plugins/ToolbarPlugin/components/JustifyTextDropdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $isHeadingNode } from '@lexical/rich-text';
import { $isAtNodeEnd } from '@lexical/selection';
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import generatePDF from '@lexical/utils/generatePDF';
import clsx from 'clsx';
import { toolbarOffset } from 'data/style.data';
import {
	$createTextNode,
	$getNodeByKey,
	$getSelection,
	$isRangeSelection,
	CAN_REDO_COMMAND,
	CAN_UNDO_COMMAND,
	createCommand,
	FORMAT_TEXT_COMMAND,
	SELECTION_CHANGE_COMMAND,
} from 'lexical';
import {
	Bold,
	Code,
	Download,
	Italic,
	Loader2,
	Strikethrough,
	Underline,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SSE } from 'sse.js';
import { useKeyboardShortcut } from '../../../hooks/useKeyboardShortcut';

const LowPriority = 1;
const supportedBlockTypes = new Set([
	'paragraph',
	'quote',
	'code',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'ul',
	'ol',
]);

const FONT_SIZE_OPTIONS = [
	['10px', '10px'],
	['11px', '11px'],
	['12px', '12px'],
	['13px', '13px'],
	['14px', '14px'],
	['15px', '15px'],
	['16px', '16px'],
	['17px', '17px'],
	['18px', '18px'],
	['19px', '19px'],
	['20px', '20px'],
];

export const INSERT_COMPLETION_COMMAND = createCommand(
	'CREATE_COMPLETION_COMMAND',
);

function getSelectedNode(selection) {
	const anchor = selection.anchor;
	const focus = selection.focus;
	const anchorNode = selection.anchor.getNode();
	const focusNode = selection.focus.getNode();
	if (anchorNode === focusNode) {
		return anchorNode;
	}
	const isBackward = selection.isBackward();
	if (isBackward) {
		return $isAtNodeEnd(focus) ? anchorNode : focusNode;
	} else {
		return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
	}
}

export default function ToolbarPlugin({ documentName }) {
	const [editor] = useLexicalComposerContext();
	const [canUndo, setCanUndo] = useState(false);
	const [canRedo, setCanRedo] = useState(false);
	const [blockType, setBlockType] = useState('paragraph');
	const [selectedElementKey, setSelectedElementKey] = useState(null);
	const inputFile = useRef<HTMLInputElement | null>(null);
	const [codeLanguage, setCodeLanguage] = useState('');
	const [isLink, setIsLink] = useState(false);
	const [isBold, setIsBold] = useState(false);
	const [isItalic, setIsItalic] = useState(false);
	const [isUnderline, setIsUnderline] = useState(false);
	const [isStrikethrough, setIsStrikethrough] = useState(false);
	const [isCode, setIsCode] = useState(false);
	const [html, setHtml] = useState<any>();
	const [json, setJson] = useState<any>();
	const { user } = useUser();
	const language = user?.editor_language;
	const [pdfExportLoading, setPdfExportLoading] = useState(false);

	const updateToolbar = useCallback(() => {
		const selection = $getSelection();

		if ($isRangeSelection(selection)) {
			const anchorNode = selection.anchor.getNode();

			const element =
				anchorNode.getKey() === 'root'
					? anchorNode
					: anchorNode.getTopLevelElementOrThrow();
			const elementKey = element.getKey();
			const elementDOM = editor.getElementByKey(elementKey);
			if (elementDOM !== null) {
				setSelectedElementKey(elementKey);
				if ($isListNode(element)) {
					const parentList = $getNearestNodeOfType(anchorNode, ListNode);
					const type = parentList ? parentList.getTag() : element.getTag();
					setBlockType(type);
				} else {
					const type = $isHeadingNode(element)
						? element.getTag()
						: element.getType();
					setBlockType(type);
					if ($isCodeNode(element)) {
						setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage());
					}
				}
			}
			// Update text format
			setIsBold(selection.hasFormat('bold'));
			setIsItalic(selection.hasFormat('italic'));
			setIsUnderline(selection.hasFormat('underline'));
			setIsStrikethrough(selection.hasFormat('strikethrough'));
			setIsCode(selection.hasFormat('code'));

			// Update links
			const node = getSelectedNode(selection);

			const parent = node.getParent();
			if ($isLinkNode(parent) || $isLinkNode(node)) {
				setIsLink(true);
			} else {
				setIsLink(false);
			}
		}
	}, [editor]);

	// Updating editor
	useEffect(() => {
		return mergeRegister(
			editor.registerUpdateListener(({ editorState }) => {
				editorState.read(() => {
					updateToolbar();
					setHtml($generateHtmlFromNodes(editor));
					// setJson(editorState.toJSON());
				});
			}),
			editor.registerCommand(
				SELECTION_CHANGE_COMMAND,
				(_payload, newEditor) => {
					updateToolbar();
					return false;
				},
				LowPriority,
			),
			editor.registerCommand(
				CAN_UNDO_COMMAND,
				payload => {
					setCanUndo(payload);
					return false;
				},
				LowPriority,
			),
			editor.registerCommand(
				CAN_REDO_COMMAND,
				payload => {
					setCanRedo(payload);
					return false;
				},
				LowPriority,
			),
			editor.registerCommand(
				INSERT_COMPLETION_COMMAND,
				() => {
					complete();
					return false;
				},
				LowPriority,
			),
		);
	}, [editor, updateToolbar]);

	const codeLanguages = useMemo(() => getCodeLanguages(), []);
	const onCodeLanguageSelect = useCallback(
		e => {
			editor.update(() => {
				if (selectedElementKey !== null) {
					const node = $getNodeByKey(selectedElementKey);
					if ($isCodeNode(node)) {
						node.setLanguage(e.target.value);
					}
				}
			});
		},
		[editor, selectedElementKey],
	);

	const insertLink = useCallback(() => {
		if (!isLink) {
			editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
		} else {
			editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
		}
	}, [editor, isLink]);

	// the following function is triggered when the user uses cmd + i or ctrl + i and autocompletes the text with one or two sentences

	async function complete() {
		const selection = window.getSelection();

		if (selection.rangeCount === 0) {
			console.log('No selection');
			return;
		}
		const range = selection.getRangeAt(0);
		const preCursorRange = range.cloneRange();
		preCursorRange.selectNodeContents(editor.getRootElement());
		preCursorRange.setEnd(range.endContainer, range.endOffset);
		const text = preCursorRange.toString();

		// if text is longer than 750 characters keep only the last 750 characters
		const textCompletion = text.length > 750 ? text.slice(-750) : text;

		const source = new SSE('/api/completion', {
			payload: `Complete the following text with one or two sentences. If the text is shorter than three words, you must say "Please write at least three words and try again. Kindly - Isaac 🧑‍🚀". Your output must be in ${language}: ${textCompletion}.`,
		});

		source.addEventListener('message', function (e) {
			const binaryString = atob(e.data);
			const eventMessage = decodeURIComponent(escape(binaryString));
			if (eventMessage === '[DONE]') {
				source.close();
			} else {
				const text = eventMessage;

				editor.update(() => {
					const selection = $getSelection();
					selection.insertNodes([$createTextNode(text)]);
				});
			}
		});
		source.stream();
	}

	// this triggers the complete function when the user uses cmd + i or ctrl + i
	useKeyboardShortcut('i', complete, true, false);

	const activePanel = useUIStore(s => s.activePanel);
	const editorWidth = useUIStore(s => s.editorWidth);

	return (
		<>
			<div
				className={`${
					editorWidth > 800 ? 'w-full  ' : 'w-min'
				}  flex  justify-center ${'dark:from-black dark:via-black from-white via-white'} to-transparent fixed z-10`}
				style={{ top: toolbarOffset }}
			>
				<div
					className={clsx(
						'toolbar',
						'rounded-lg shadow-lg px-4 py-2 mb-3 [&>section]:flex ',
						'dark:bg-neutral-900 dark:backdrop-blur dark:border dark:border-white/20 dark:shadow-none dark:dark-theme',
						'bg-[#fbfbfa]',
						activePanel
							? 'max-w-2xl mt-0 xl:space-x-0 2xl:space-x-6 space-x-6 flex-wrap w-96 xl:w-full justify-center flex '
							: 'mt-0',
					)}
				>
					{/* <section>
						<Button
							variant="ghost"
							disabled={!canUndo}
							onClick={() => {
								// eslint-disable-next-line @typescript-eslint/ban-ts-comment
								// @ts-ignore
								editor.dispatchCommand(UNDO_COMMAND);
							}}
							className="px-2"
							aria-label="Undo"
						>
							<Undo size={18} strokeWidth={1.5} />
						</Button>
						<Button
							variant="ghost"
							disabled={!canRedo}
							onClick={() => {
								// eslint-disable-next-line @typescript-eslint/ban-ts-comment
								// @ts-ignore
								editor.dispatchCommand(REDO_COMMAND);
							}}
							className="px-2"
							aria-label="Redo"
						>
							<Redo size={18} strokeWidth={1.5} />
						</Button>
					</section> */}

					{blockType === 'code' ? (
						<section>
							<CodeSelect
								onChange={onCodeLanguageSelect}
								options={codeLanguages}
							/>
						</section>
					) : (
						<>
							<section>
								{supportedBlockTypes.has(blockType) && (
									<BlockOptionsDropdown editor={editor} blockType={blockType} />
								)}

								<Button
									variant="ghost"
									onClick={() => {
										editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
									}}
									className="px-2"
									aria-label="Format Bold"
								>
									<Bold size={18} strokeWidth={1.5} />
								</Button>
								<Button
									variant="ghost"
									onClick={() => {
										editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
									}}
									className="px-2"
									aria-label="Format Italics"
								>
									<Italic size={18} strokeWidth={1.5} />
								</Button>
								<Button
									variant="ghost"
									onClick={() => {
										editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
									}}
									className="px-2"
									aria-label="Format Underline"
								>
									<Underline size={18} strokeWidth={1.5} />
								</Button>
								<Button
									variant="ghost"
									onClick={() => {
										editor.dispatchCommand(
											FORMAT_TEXT_COMMAND,
											'strikethrough',
										);
									}}
									className="px-2"
									aria-label="Format Strikethrough"
								>
									<Strikethrough size={18} strokeWidth={1.5} />
								</Button>
								<Button
									variant="ghost"
									onClick={() => {
										editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
									}}
									aria-label="Insert Code"
									className="px-2"
								>
									<Code size={18} strokeWidth={1.5} />
								</Button>

								<JustifyTextDropdown />
								<InsertObjectDropdown />
								<Button
									variant="ghost"
									onClick={async () => {
										await generatePDF(documentName, html, {
											onMutate: () => setPdfExportLoading(true),
											onSettled: () => {
												setPdfExportLoading(false);
											},
										});
									}}
								>
									{pdfExportLoading ? (
										<span className="text items-center inline-flex gap-1">
											<Loader2 size={18} className="animate-spin shrink-0" />{' '}
										</span>
									) : (
										<Tooltip delayDuration={300}>
											<TooltipTrigger asChild>
												<span className={clsx(!activePanel && 'text')}>
													<Download size={18} color="#777" />
												</span>
											</TooltipTrigger>
											<TooltipContent side="top" sideOffset={20}>
												Export the current document in PDF format
											</TooltipContent>
										</Tooltip>
									)}
								</Button>
							</section>
						</>
					)}
				</div>
			</div>
		</>
	);
}
