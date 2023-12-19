import { ManipulateTextMethods } from '@utils/manipulateTextMap';
import { RangeSelection } from 'lexical';
import { ChatMessage, LiteratureSource } from 'types/chat';
import { create } from 'zustand';

// Define the state shape with an interface
interface AIAssistantState {
	open: boolean;
	X: number;
	Y: number;
	cachedSelection?: RangeSelection;
	AITextOutput: string;
	AIOperation?: ManipulateTextMethods;
	literatureReferenceOutput?: LiteratureSource[];
	literatureReferenceOutputLoading?: boolean;
	actions: {
		openModal: () => void;
		closeModal: () => void;
		setCursorPosition: (X: number, Y: number) => void;
		setAITextOutput: (AIOutput: string) => void;
		setAIOperation: (operation: ManipulateTextMethods) => void;
		setCachedSelection: (cachedSelection: RangeSelection) => void;
		setLiteratureReferenceOutput: (cachedSelection: any[]) => void;
		setLiteratureReferenceOutputLoading: (bool: boolean) => void;
		setOpen: (open: boolean) => void;
	};
}

// Create the store with the defined types
const useAIAssistantStore = create<AIAssistantState>(set => ({
	open: false,
	cachedSelection: undefined,
	AITextOutput: '',
	literatureReferenceOutput: undefined,
	literatureReferenceOutputLoading: false,
	X: 0,
	Y: 0,
	AIOperation: undefined,
	actions: {
		openModal: () => set({ open: true }),
		closeModal: () => set({ open: false }),
		setCursorPosition: (X, Y) => {
			set({ X, Y });
		},
		setAITextOutput: (AITextOutput: string) => {
			set({ AITextOutput });
		},
		setAIOperation: AIOperation => {
			set({ AIOperation });
		},
		setLiteratureReferenceOutput: literatureReferenceOutput => {
			set({
				literatureReferenceOutput,
				literatureReferenceOutputLoading: false,
			});
		},
		setLiteratureReferenceOutputLoading: () => {
			set({ literatureReferenceOutputLoading: true });
		},
		setCachedSelection: (cachedSelection: any) => {
			set({ cachedSelection });
		},
		setOpen: (open: boolean) => {
			set({ open });
		},
	},
}));

export default useAIAssistantStore;
