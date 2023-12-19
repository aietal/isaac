import { Panel, useUIStore } from '@context/ui.store';
import useGetEditorRouter from '@hooks/useGetEditorRouter';
import ToolbarButton from '@lexical/plugins/FloatingToolbarPlugin/components/FloatingToolbarButton';
import useCreateNote from '@resources/notes';
import { $getSelection, LexicalEditor } from 'lexical';
import { StickyNote } from 'lucide-react';

type Props = {
	editor: LexicalEditor;
};

const CreateNoteToolbarButton = ({ editor }: Props) => {
	const { mutateAsync: createNote } = useCreateNote();
	const openPanel = useUIStore(s => s.openPanel);

	const saveToNote = () => {
		editor.update(() => {
			// TODO: Figure out how to save editor state instead of the text content
			const selection = $getSelection();
			const text = selection.getTextContent();
			createNote(text);
			openPanel(Panel.NOTES);
		});
	};
	return (
		<ToolbarButton onClick={() => saveToNote()}>
			<StickyNote size={16} strokeWidth={1.2} />
		</ToolbarButton>
	);
};

export default CreateNoteToolbarButton;
