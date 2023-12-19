import {
	$getSelection,
	$isElementNode,
	$isParagraphNode,
	$isRangeSelection,
	$isRootNode,
	$isTextNode,
	COMMAND_PRIORITY_LOW,
	ElementNode,
	RangeSelection,
	SELECTION_CHANGE_COMMAND,
	TextNode,
} from 'lexical';
import { useCallback, useEffect } from 'react';

import { $isImageNode } from '@lexical/nodes/ImageNode';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { getSelectedNode } from '../utils/getSelectedNode';

import { commandKey } from '@lexical/utils/meta';

export const LinePlaceholderPlugin = () => {
	const [editor] = useLexicalComposerContext();

	const displayPlaceholder = useCallback((node: ElementNode | TextNode) => {
		const text = node.getTextContent();
		const element = editor.getElementByKey(node.getKey());
		const placeholder = document.querySelector('.editor-placeholder') as HTMLElement;
		const parentNode = node.getParent();
		const parentIsRoot = $isRootNode(parentNode);
		let childHasImageNode = false;

		if ($isElementNode(node)) {
			childHasImageNode = node.getChildren()?.some(node => $isImageNode(node)) || false;
		}

		if (!text && parentIsRoot && !childHasImageNode) {
			positionPlaceholder(placeholder, element);
		} else {
			hidePlaceholder(placeholder);
		}
	}, [editor]);

	const positionPlaceholder = useCallback((placeholder, element) => {
		const { y: rectY, x: rectX } = element.getBoundingClientRect();
		const { y: parentRectY, x: parentRectX } = placeholder.parentElement.getBoundingClientRect();

		Object.assign(placeholder.style, {
			top: `${rectY - parentRectY}px`,
			left: `${rectX - parentRectX}px`,
			opacity: '1',
		});
	}, []);

	const hidePlaceholder = useCallback(placeholder => {
		Object.assign(placeholder.style, {
			top: '-10000px',
			left: '-10000px',
			opacity: '0',
		});
	}, []);

	const updateCursorPosition = useCallback(() => {
		const selection = $getSelection();

		if (selection && $isRangeSelection(selection)) {
			const node = getSelectedNode(selection as RangeSelection);

			if (node && ($isParagraphNode(node) || $isTextNode(node))) {
				displayPlaceholder(node);
			}
		}

		return false;
	}, [displayPlaceholder]);

	useEffect(() => {
		return editor.registerCommand(
			SELECTION_CHANGE_COMMAND,
			updateCursorPosition,
			COMMAND_PRIORITY_LOW,
		);
	}, [editor, updateCursorPosition]);

	return (
		<div className="editor-placeholder">
			<strong>{commandKey} + K</strong> to insert a command
		</div>
	);
};

