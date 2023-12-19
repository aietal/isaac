import useLexicalEditorStore from '@context/lexicalEditor.store';
import { $createTextNode, $getSelection } from 'lexical';

const useApplyChangesToEditor = () => {
	const { activeEditor, editorFocused } = useLexicalEditorStore();
	const applyChanges = (text: string) => {
		activeEditor.update(() => {
			const selection = $getSelection();
			selection.insertNodes([$createTextNode(text)]);
		});
	};

	return { applyChanges, editorFocused };
};

export default useApplyChangesToEditor;
