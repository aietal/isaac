import useAIAssistantStore from '@context/aiAssistant.store';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import { getDOMRangeRect } from '@lexical/utils/getDOMRangeRect';
import { setFloatingElemPosition } from '@lexical/utils/setFloatingElemPosition';
import clsx from 'clsx';
import {
	$getSelection,
	COMMAND_PRIORITY_LOW,
	SELECTION_CHANGE_COMMAND,
} from 'lexical';
import React, { ReactNode, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

type Props = {
	children: ReactNode;
	persist?: boolean;
};

const FloatingToolbarBox = ({ children, persist }: Props) => {
	const [editor] = useLexicalComposerContext();
	const ref = useRef(null);
	const anchorElem = document.body;
	const inEditorAIAssistantOpen = useAIAssistantStore(s => s.open);

	const updateTextFormatFloatingToolbar = useCallback(() => {
		const selection = $getSelection();

		const popupCharStylesEditorElem = ref.current;
		const nativeSelection = window.getSelection();

		if (popupCharStylesEditorElem === null || inEditorAIAssistantOpen) {
			return;
		}
		const rootElement = editor.getRootElement();
		if (
			selection !== null &&
			nativeSelection !== null &&
			!nativeSelection.isCollapsed &&
			rootElement !== null &&
			rootElement.contains(nativeSelection.anchorNode)
		) {
			const rangeRect = getDOMRangeRect(nativeSelection, rootElement);
			setFloatingElemPosition(rangeRect, popupCharStylesEditorElem, anchorElem);
		}
	}, [editor, anchorElem, persist, inEditorAIAssistantOpen]);

	useEffect(() => {
		editor.getEditorState().read(() => {
			updateTextFormatFloatingToolbar();
		});
		return mergeRegister(
			editor.registerUpdateListener(({ editorState }) => {
				editorState.read(() => {
					updateTextFormatFloatingToolbar();
				});
			}),
			editor.registerCommand(
				SELECTION_CHANGE_COMMAND,
				() => {
					updateTextFormatFloatingToolbar();
					return false;
				},
				COMMAND_PRIORITY_LOW,
			),
		);
	}, [editor, updateTextFormatFloatingToolbar]);

	return createPortal(
		<div
			ref={ref}
			className={clsx(
				`flex align-middle absolute z-10 top-0 shadow-xl border border-[#191711]/[0.08] rounded-md`,
				' dark:bg-[#2C2E33] bg-white',
				{ hidden: inEditorAIAssistantOpen },
			)}
			id="ai-assistant-menu"
		>
			{children}
		</div>,
		anchorElem,
	);
};

export default FloatingToolbarBox;
