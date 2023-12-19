import useLexicalEditorStore from '@context/lexicalEditor.store';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { BLUR_COMMAND, COMMAND_PRIORITY_LOW, FOCUS_COMMAND } from 'lexical';
import React, { useEffect, useState } from 'react';

const FocusStatePlugin = () => {
	const [editor] = useLexicalComposerContext();
	const { setEditorFocused, editorFocused } = useLexicalEditorStore();

	useEffect(
		() =>
			editor.registerCommand(
				BLUR_COMMAND,
				() => {
					setEditorFocused(false);
					return false;
				},
				COMMAND_PRIORITY_LOW,
			),
		[],
	);

	useEffect(
		() =>
			editor.registerCommand(
				FOCUS_COMMAND,
				() => {
					setEditorFocused(true);
					return false;
				},
				COMMAND_PRIORITY_LOW,
			),
		[],
	);

	return null;
};

export default FocusStatePlugin;
