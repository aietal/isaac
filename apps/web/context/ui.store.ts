import debounce from 'lodash/debounce';
import { create } from 'zustand';

export enum Panel {
	FILE_EXPLORER = 'FILE_EXPLORER',
	CHAT = 'CHAT',
	CHAT_SESSIONS = 'CHAT_SESSIONS',
	LITERATURE_SEARCH = 'SEARCH_LITERATURE',
	REFERENCES = 'REFERENCES',
	NOTES = 'NOTES',
	AI_OUTPUT_LOGS = 'AI_OUTPUT_LOGS',
	ISAAC_SETTINGS = 'ISAAC_SETTINGS',
}

export const SideBarWidth = 300;

type UIStore = {
	// right side
	activePanel?: Panel;
	openPanel: (panel: Panel) => void;
	closePanel: () => void;
	// active reference

	// left side
	activeSidebar?: boolean;
	toggleSideBar: () => void;
	openSidebar: (panel: Panel) => void;
	// settings modal
	settingModalOpen?: boolean;
	setSettingModalOpen: (open: boolean) => void;
	// settings modal
	productGuideModalOpen?: boolean;
	setProductGuideModalOpen: (open: boolean) => void;
	// feedback modal
	feedbackModalOpen?: boolean;
	setFeedbackModalOpen: (open: boolean) => void;
	// create project popover
	createProjectPopoverOpen: boolean;
	setCreateProjectPopoverOpen: (open: boolean) => void;
	// create document popover
	createDocumentPopoverOpen: boolean;
	setCreateDocumentPopoverOpen: (open: boolean) => void;

	// custom instructions modal
	customInstructionsModalOpen: boolean;
	setCustomInstructionsModalOpen: (open: boolean) => void;

	// editor width
	editorWidth?: number;
	setEditorWidth?: (width: number) => void;

	// right panel width
	rightPanelWidth?: number;
	setRightPanelWidth?: (width: number) => void;

	// comments -> //TODO: make this per document instead of global
	showDocumentComments: boolean;
	toggleDocumentComment: () => void;
	setShowDocumentComments: (show: boolean) => void;
	showCommentInputBox: boolean;
	setShowInputBox: (show: boolean) => void;

	// editor scroll position
	editorScrollTop?: number;
	setEditorScrollTop: (top: number) => void;

	//
	showChangelogUpdate: boolean;
	setShowChangelogUpdate: (show: boolean) => void;

	// Editor Command
	showEditorCommand: [
		boolean,
		{ defaultSearch?: string; showAIFunction?: boolean },
	];
	setShowEditorCommand: (
		show: boolean,
		options?: { defaultSearch?: string; showAIFunctions?: boolean },
	) => void;

	// Create Document Modal
	showCreateDocumentModal: [boolean, string | undefined];
	setShowCreateDocumentModal: (show: boolean, defaultTitle?: string) => void;

	// Browse Files Across Documents
	browseFileCommand: boolean;
	setBrowseFileCommand: (show: boolean) => void;

	// Show Equation Modal
	showEquationModal: boolean;
	setShowEquationModal: (show: boolean) => void;

	// Show Project Nav
	showProjectNav: boolean;
	setShowProjectNav: (show: boolean) => void;
};

// TODO: Refactor all action to action
export const useUIStore = create<UIStore>((set, get) => ({
	activePanel: Panel.FILE_EXPLORER,
	openPanel: panelName => {
		set({
			activePanel: panelName,
			showCommentInputBox: false,
			showDocumentComments: false,
		});
	},
	closePanel: () => {
		set({ activePanel: undefined });
	},
	activeSidebar: true,
	toggleSideBar: () => {
		const { activeSidebar } = get();
		set({ activeSidebar: !activeSidebar });
	},
	openSidebar: () => {
		set({ activeSidebar: true });
	},
	settingModalOpen: false,
	setSettingModalOpen: isOpen => set({ settingModalOpen: isOpen }),
	productGuideModalOpen: false,
	setProductGuideModalOpen: isOpen => set({ productGuideModalOpen: isOpen }),
	feedbackModalOpen: false,
	setFeedbackModalOpen: isOpen => set({ feedbackModalOpen: isOpen }),
	createProjectPopoverOpen: false,
	setCreateProjectPopoverOpen: open => set({ createProjectPopoverOpen: open }),
	createDocumentPopoverOpen: false,
	setCreateDocumentPopoverOpen: open => set({ createProjectPopoverOpen: open }),
	customInstructionsModalOpen: false,
	setCustomInstructionsModalOpen: open => {
		set({ customInstructionsModalOpen: open });
	},
	editorWidth: undefined,
	setEditorWidth: editorWidth => set({ editorWidth }),
	rightPanelWidth: undefined,
	setRightPanelWidth: rightPanelWidth => set({ rightPanelWidth }),
	editorScrollTop: 0,
	setEditorScrollTop: debounce(
		editorScrollTop => set({ editorScrollTop }),
		100,
	),
	showDocumentComments: false,
	toggleDocumentComment: () => {
		const { showDocumentComments } = get();
		set({ showDocumentComments: !showDocumentComments });
	},
	setShowDocumentComments: show => {
		set({ showDocumentComments: show });
	},
	showCommentInputBox: false,
	setShowInputBox: show => {
		if (show) {
			set({
				showCommentInputBox: true,
				showDocumentComments: true,
			});
		} else {
			set({ showCommentInputBox: false });
		}
	},
	showChangelogUpdate: false,
	setShowChangelogUpdate: (bool: boolean) => {
		set({ showChangelogUpdate: bool });
	},
	showEditorCommand: [false, undefined],
	setShowEditorCommand: (open, options) => {
		set({ showEditorCommand: [open, options] });
	},

	showCreateDocumentModal: [false, undefined],
	setShowCreateDocumentModal: (bool, defaultTitle) => {
		set({ showCreateDocumentModal: [bool, defaultTitle] });
	},
	browseFileCommand: false,
	setBrowseFileCommand: open => {
		set({ browseFileCommand: open });
	},

	showEquationModal: false,
	setShowEquationModal: (bool: boolean) => {
		set({ showEquationModal: bool });
	},
	showProjectNav: false,
	setShowProjectNav: (bool: boolean) => {
		set({ showProjectNav: bool });
	},
}));
