import { LexicalEditor } from 'lexical';
import { create } from 'zustand';

type FloatingInputProps = {
	documentId: string;
	onSubmit?: (text: string) => void;
	placeholder?: string;
};

type TableOfContent = {
	nodeId: string;
	text: string;
	header: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
};

type ProjectStore = {
	activeEditor: LexicalEditor | undefined;
	setActiveEditor: (editor: LexicalEditor | undefined) => void;
	activeSelectionText: string | undefined;
	setActiveSelectionText: (text: string | undefined) => void;
	editorFocused: boolean;
	setEditorFocused: (focus: boolean) => void;
	floatingInputActive?: FloatingInputProps;
	setFloatingInputActive: (payload: FloatingInputProps) => void;
	setTableOfContents: (tableOfContents: TableOfContent[]) => void;
	tableOfContents: TableOfContent[];
};

const useLexicalEditorStore = create<ProjectStore>(set => ({
	activeEditor: undefined,
	activeSelectionText: undefined,
	editorFocused: false,
	floatingInputActive: undefined,
	tableOfContents: [],
	setActiveEditor: editor => set({ activeEditor: editor }),
	setActiveSelectionText: text => set({ activeSelectionText: text }),
	setEditorFocused: focus => set({ editorFocused: focus }),
	setFloatingInputActive: payload => set({ floatingInputActive: payload }),
	setTableOfContents: tableOfContents => set({ tableOfContents }),
}));

export default useLexicalEditorStore;
