import { $isCodeHighlightNode } from '@lexical/code';
import { $isLinkNode } from '@lexical/link';
import { mergeRegister } from '@lexical/utils';
import { $getSelection, LexicalEditor } from 'lexical';
import { useCallback, useEffect, useState } from 'react';

import { getSelectedNode } from '@lexical/utils/getSelectedNode';
import { $isRangeSelection, $isTextNode } from 'lexical';

function useFloatingToolbarStates(editor: LexicalEditor) {
	const [isText, setIsText] = useState(false);
	const [isLink, setIsLink] = useState(false);
	const [isBold, setIsBold] = useState(false);
	const [isItalic, setIsItalic] = useState(false);
	const [isUnderline, setIsUnderline] = useState(false);
	const [isStrikethrough, setIsStrikethrough] = useState(false);
	const [isSubscript, setIsSubscript] = useState(false);
	const [isSuperscript, setIsSuperscript] = useState(false);
	const [isCode, setIsCode] = useState(false);

	const updatePopup = useCallback(() => {
		editor.getEditorState().read(() => {
			// Should not to pop up the floating toolbar when using IME input
			if (editor.isComposing()) {
				return;
			}
			const selection = $getSelection();

			const nativeSelection = window.getSelection();
			const rootElement = editor.getRootElement();

			if (
				nativeSelection !== null &&
				(!$isRangeSelection(selection) ||
					rootElement === null ||
					!rootElement.contains(nativeSelection.anchorNode))
			) {
				setIsText(false);
				return;
			}

			if (!$isRangeSelection(selection)) {
				return;
			}

			const node = getSelectedNode(selection);

			// Update text format
			setIsBold(selection.hasFormat('bold'));
			setIsItalic(selection.hasFormat('italic'));
			setIsUnderline(selection.hasFormat('underline'));
			setIsStrikethrough(selection.hasFormat('strikethrough'));
			setIsSubscript(selection.hasFormat('subscript'));
			setIsSuperscript(selection.hasFormat('superscript'));
			setIsCode(selection.hasFormat('code'));

			// Update links
			const parent = node.getParent();
			if ($isLinkNode(parent) || $isLinkNode(node)) {
				setIsLink(true);
			} else {
				setIsLink(false);
			}

			if (
				!$isCodeHighlightNode(selection.anchor.getNode()) &&
				selection.getTextContent() !== ''
			) {
				setIsText($isTextNode(node));
			} else {
				setIsText(false);
			}
		});
	}, [editor]);

	useEffect(() => {
		document.addEventListener('selectionchange', updatePopup);
		return () => {
			document.removeEventListener('selectionchange', updatePopup);
		};
	}, [updatePopup]);

	useEffect(() => {
		return mergeRegister(
			editor.registerUpdateListener(() => {
				updatePopup();
			}),
			editor.registerRootListener(() => {
				if (editor.getRootElement() === null) {
					setIsText(false);
				}
			}),
		);
	}, [editor, updatePopup]);

	return {
		isText,
		isLink,
		isBold,
		isItalic,
		isStrikethrough,
		isSubscript,
		isSuperscript,
		isUnderline,
		isCode,
	};
}

export default useFloatingToolbarStates;
