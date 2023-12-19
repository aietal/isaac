import { Panel, useUIStore } from '@context/ui.store';
import useDocumentTabs from '@hooks/useDocumentTabs';
import { HotkeyItem, useHotkeys } from '@mantine/hooks';
import { hotKeys } from 'data/shortcuts';

const useEditorShortcut = () => {
	const openPanel = useUIStore(s => s.openPanel);
	const closePanel = useUIStore(s => s.closePanel);
	const activePanel = useUIStore(s => s.activePanel);
	const toggleSideBar = useUIStore(s => s.toggleSideBar);
	const showEditorCommand = useUIStore(s => s.setShowEditorCommand);
	const setShowProjectNav = useUIStore(s => s.setShowProjectNav);
	const toggleDocumentComment = useUIStore(s => s.toggleDocumentComment);
	const { toggleDocumentByTabIndex } = useDocumentTabs();

	// Hotkeys for Editor
	useHotkeys([
		[
			`mod+${hotKeys.isaacPanel.key}`,
			() => (activePanel === Panel.CHAT ? closePanel() : openPanel(Panel.CHAT)),
		],
		[
			`mod+${hotKeys.referencePanel.key}`,
			() =>
				activePanel === Panel.REFERENCES
					? closePanel()
					: openPanel(Panel.REFERENCES),
		],
		[
			`mod+${hotKeys.notePanel.key}`,
			() =>
				activePanel === Panel.NOTES ? closePanel() : openPanel(Panel.NOTES),
			{ preventDefault: true },
		],
		[
			`mod+${hotKeys.closePanel.key}`,
			() => closePanel(),
			{ preventDefault: true },
		],
		[
			`mod+${hotKeys.toggleProjectNav.key}`,
			() => setShowProjectNav(true),
			{ preventDefault: true },
		],
		[`mod+${hotKeys.toggleSidebar.key}`, () => toggleSideBar()],
		[`mod+${hotKeys.toggleComment.key}`, () => toggleDocumentComment()],
		[
			`mod+${hotKeys.openCommand.key}`,
			() => showEditorCommand(true, { showAIFunctions: true }),
		],
		['mod+e', () => alert('focus on editor')],
		...[1, 2, 3, 4, 5, 6, 7].map(n => {
			return [`mod+${n}`, () => toggleDocumentByTabIndex(n - 1)] as HotkeyItem;
		}),
	]);
};

export default useEditorShortcut;
