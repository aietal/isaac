import { TextDocument } from '@hooks/api/useGetDocuments';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { isString } from 'lodash';
import { useEffect, useState } from 'react';

function RestoreStatePlugin({ document, saveDocument }) {
	const [editor] = useLexicalComposerContext();
	const [currentDocument, setCurrentDocument] = useState<TextDocument>();

	useEffect(() => {
		if (
			document &&
			document.text &&
			(!currentDocument || document.id !== currentDocument.id)
		) {
			// save before switching to new document
			const isEmptyState = editor.getEditorState()._nodeMap.size === 1;
			if (currentDocument && !isEmptyState) {
				saveDocument(editor.getEditorState(), currentDocument);
			}

			const editorState = editor.parseEditorState(
				isString(document.text) ? JSON.parse(document.text) : document.text,
			);
			editor.setEditorState(editorState);
			editor.focus();
			setCurrentDocument(document);
		}
	}, [currentDocument, document, editor, saveDocument]);

	return null;
}

export default RestoreStatePlugin;
