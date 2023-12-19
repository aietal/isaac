import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
	$getSelection,
	CommandListenerPriority,
	COMMAND_PRIORITY_NORMAL,
	GridSelection,
	NodeSelection,
	RangeSelection,
	SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { useEffect } from 'react';

export default function useSelectionEffect(
	handler: (
		selection: RangeSelection | NodeSelection | GridSelection,
	) => boolean | void,
	priority: CommandListenerPriority = COMMAND_PRIORITY_NORMAL,
) {
	const [editor] = useLexicalComposerContext();
	useEffect(() => {
		return editor.registerCommand(
			SELECTION_CHANGE_COMMAND,
			() => (handler($getSelection()) ?? false) as boolean,
			priority,
		);
	}, [editor]);
}
