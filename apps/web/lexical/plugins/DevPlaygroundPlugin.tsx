import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
	$createParagraphNode,
	$createTextNode,
	$getPreviousSelection,
	$getSelection,
	$isRangeSelection,
	COMMAND_PRIORITY_LOW,
	SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { debounce } from 'lodash';
import React, { useEffect } from 'react';

const DevPlaygroundPlugin = () => {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		return editor.registerCommand(
			SELECTION_CHANGE_COMMAND,
			() => {
				const selection = $getSelection();
				if ($isRangeSelection(selection)) {
					// create node
					// const randomTextNode = $createTextNode('Ibrahim');
					// const newParagraph = $createParagraphNode();
					// // capture nodes & offset
					// const anchorNode = selection.anchor.getNode();
					// const anchorOffset = selection.anchor.offset;
					// const focusedNode = selection.focus.getNode();
					// const focusedOffset = selection.focus.offset;
					// * split
					// const [node1, node2] = focusedNode.splitText(focusedOffset);
					// * insert after the split
					// focusedNode.insertAfter(newParagraph, true);
				}
				return false;
			},
			COMMAND_PRIORITY_LOW,
		);
	}, []);

	return null;
};

export default DevPlaygroundPlugin;
