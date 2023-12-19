import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { TRANSFORMERS } from '@lexical/markdown';
import { CitationNode } from '@lexical/nodes/CitationNode';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import clsx from 'clsx';
import {
	$createParagraphNode,
	$createTextNode,
	$getRoot,
	CLEAR_EDITOR_COMMAND,
	COMMAND_PRIORITY_NORMAL,
	EditorState,
	EditorThemeClasses,
	KEY_ESCAPE_COMMAND,
	KEY_MODIFIER_COMMAND,
	LexicalEditor,
} from 'lexical';
import { useEffect, useLayoutEffect } from 'react';

//  TODO: Implement ctrl + enter for submit
type Props = {
	editorState?: EditorState | string;
	onChange?: (editorState: EditorState, editor: LexicalEditor) => void;
	theme?: EditorThemeClasses;
	contentClassName?: string;
	placeholder?: string;
	editable?: boolean;
	autofocus?: boolean;
	onClick?: () => void;
	keyPressEvent?: {
		onEscapePress?: () => void;
		onModEnterPress?: () => void;
	};
};

export default function RichTextArea({
	editorState,
	onChange,
	theme,
	editable = true,
	contentClassName,
	placeholder,
	onClick,
	autofocus,
	keyPressEvent,
}: Props) {
	return (
		<LexicalComposer
			initialConfig={{
				editorState: typeof editorState !== 'string' ? editorState : undefined,
				namespace: 'RichTextArea',
				editable,
				nodes: [
					HeadingNode,
					ListNode,
					ListItemNode,
					QuoteNode,
					CodeNode,
					CodeHighlightNode,
					AutoLinkNode,
					LinkNode,
					CitationNode,
				],
				onError: e => console.log(e),
				theme: theme || basicTheme,
			}}
		>
			<div className="relative" onClick={onClick}>
				<RichTextPlugin
					contentEditable={
						<ContentEditable
							className={clsx(
								'px-3 py-3 focus-visible:outline-none rounded-lg border',
								contentClassName,
							)}
						/>
					}
					placeholder={
						<div className="absolute top-0 p-3 text-sm text-gray-500 pointer-events-none select-none">
							{placeholder !== undefined ? placeholder : 'Enter some text...'}
						</div>
					}
					ErrorBoundary={LexicalErrorBoundary}
				/>
			</div>

			<ListPlugin />
			<CheckListPlugin />
			<MarkdownShortcutPlugin transformers={TRANSFORMERS} />
			<OnChangePlugin onChange={onChange} />
			<HistoryPlugin />
			{autofocus && <AutoFocusPlugin />}
			<CommonShortCutPlugin
				onEscape={keyPressEvent?.onEscapePress}
				onModEnter={keyPressEvent?.onModEnterPress}
			/>
			<ClearEditorPlugin />
			{typeof editorState === 'string' && (
				<ParseStringifiedEditorStatePlugin editorStateStr={editorState} />
			)}
		</LexicalComposer>
	);
}

type ParseStringifiedEditorStatePluginProps = {
	editorStateStr: string;
};

// Enable state to parse editor state in string format
const ParseStringifiedEditorStatePlugin = ({
	editorStateStr,
}: ParseStringifiedEditorStatePluginProps) => {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		if (editorStateStr === '') {
			editor.dispatchCommand(CLEAR_EDITOR_COMMAND, null);
			return;
		}

		try {
			const editorState = editor.parseEditorState(JSON.parse(editorStateStr));
			editor.setEditorState(editorState);
		} catch {
			// * For the case if normal string is passed instead of editor state
			editor.update(() => {
				const root = $getRoot();
				root.clear();
				const p = $createParagraphNode();
				p.append($createTextNode(editorStateStr));
				root.append(p);
			});
			// const editorState = editor.parseEditorState(editorStateStr);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editorStateStr]);

	return null;
};

type CommonShortcutProps = {
	onEscape?: () => void;
	onModEnter?: () => void;
};

const CommonShortCutPlugin = ({
	onEscape,
	onModEnter,
}: CommonShortcutProps) => {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		if (onEscape) {
			editor.registerCommand(
				KEY_ESCAPE_COMMAND,
				event => {
					onEscape();
					return false;
				},
				COMMAND_PRIORITY_NORMAL,
			);
		}

		if (onModEnter) {
			editor.registerCommand(
				KEY_MODIFIER_COMMAND,
				event => {
					if (event.ctrlKey) {
						event.preventDefault();
						event.stopPropagation();
						if (event.key === 'Enter') {
							onModEnter();
						}
					}

					return true;
				},
				COMMAND_PRIORITY_NORMAL,
			);
		}
	}, [onEscape, onModEnter, editor]);

	return null;
};

const basicTheme: EditorThemeClasses = {
	ltr: 'ltr',
	rtl: 'rtl',
	paragraph: 'editor-paragraph',
	quote: 'editor-quote',
	heading: {},
	list: {
		nested: {
			listitem: 'editor-nested-listitem',
		},
		ol: 'rich-text-area-list-ol',
		ul: 'rich-text-area-list-ul',
		listitem: 'rich-text-area-listitem',
	},
	image: 'editor-image',
	link: 'editor-link',
	text: {
		bold: 'editor-text-bold',
		italic: 'editor-text-italic',
		underline: 'editor-text-underline',
		strikethrough: 'editor-text-strikethrough',
		underlineStrikethrough: 'editor-text-underlineStrikethrough',
		code: 'editor-text-code',
	},
};
