import { Panel, useUIStore } from '@context/ui.store';
import useDocumentTabs from '@hooks/useDocumentTabs';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { allCommandKeys, hotKeys, tabNumberKeys } from 'data/shortcuts';
import { COMMAND_PRIORITY_NORMAL, KEY_MODIFIER_COMMAND } from 'lexical';
import { useEffect, useRef } from 'react';

const HotkeyPlugin = () => {
	const [editor] = useLexicalComposerContext();
	const openPanel = useUIStore(s => s.openPanel);
	const closePanel = useUIStore(s => s.closePanel);
	const activePanel = useUIStore(s => s.activePanel);
	const toggleSideBar = useUIStore(s => s.toggleSideBar);
	const toggleDocumentComment = useUIStore(s => s.toggleDocumentComment);
	const setShowEditorCommand = useUIStore(s => s.setShowEditorCommand);
	const { toggleDocumentByTabIndex } = useDocumentTabs();
	const pressedKey = useRef<string>();

	// * Register hotkey
	useEffect(() => {
		editor.registerCommand(
			KEY_MODIFIER_COMMAND,
			event => {
				if (event.metaKey || event.ctrlKey) {
					// Check for command key press instead of ctrl key
					if (allCommandKeys.includes(event.key)) {
						event.preventDefault();
						event.stopPropagation();
						pressedKey.current = event.key;
						handleKeyPress();
					}
				}

				return true;
			},
			COMMAND_PRIORITY_NORMAL,
		);
	}, []);

	// * Handle key press
	const handleKeyPress = () => {
		if (pressedKey.current === hotKeys.toggleSidebar.key) {
			toggleSideBar();
		} else if (pressedKey.current === hotKeys.isaacPanel.key) {
			activePanel === Panel.CHAT ? closePanel() : openPanel(Panel.CHAT);
		} else if (pressedKey.current === hotKeys.referencePanel.key) {
			activePanel === Panel.REFERENCES
				? closePanel()
				: openPanel(Panel.REFERENCES);
		} else if (pressedKey.current === hotKeys.notePanel.key) {
			activePanel === Panel.NOTES ? closePanel() : openPanel(Panel.NOTES);
		} else if (pressedKey.current === hotKeys.closePanel.key) {
			closePanel();
		} else if (tabNumberKeys.includes(pressedKey.current)) {
			toggleDocumentByTabIndex(Number(pressedKey.current) - 1);
		} else if (pressedKey.current === hotKeys.toggleComment.key) {
			toggleDocumentComment();
		} else if (pressedKey.current === hotKeys.openCommand.key) {
			setShowEditorCommand(true, { showAIFunctions: true });
		} else if (pressedKey.current === hotKeys.toggleTheme.key) {
			// toggleColorScheme(); // TODO: Rework this
		}
		pressedKey.current = undefined;
	};

	return null;
};

export default HotkeyPlugin;
