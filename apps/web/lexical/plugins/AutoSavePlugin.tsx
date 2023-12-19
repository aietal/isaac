import useLexicalEditorStore from '@context/lexicalEditor.store';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { $getSelection } from 'lexical';
import { EditorState } from 'lexical/LexicalEditorState';
import React from 'react';

type Props = {
	saveDocument: (editorState: EditorState) => void;
};

function AutoSavePlugin({ saveDocument }: Props) {
	const { setActiveEditor, setActiveSelectionText } = useLexicalEditorStore(
		s => ({
			setActiveEditor: s.setActiveEditor,
			setActiveSelectionText: s.setActiveSelectionText,
		}),
	);

	return (
		<OnChangePlugin
			onChange={(editorState, editor) => {
				setActiveEditor(editor);
				editor.update(() => {
					const selection = $getSelection();
					const text = selection?.getTextContent();
					setActiveSelectionText(text);
				});
				saveDocument(editorState);
			}}
		/>
	);
}

export default AutoSavePlugin;
