import { Input } from '@components/ui/input';
import useLexicalEditorStore from '@context/lexicalEditor.store';
import { useUIStore } from '@context/ui.store';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { createDOMRange, createRectsFromDOMRange } from '@lexical/selection';
import { useClickOutside } from '@mantine/hooks';
import clsx from 'clsx';
import { $getSelection, $isRangeSelection } from 'lexical';
import { Send } from 'lucide-react';
import * as React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useLayoutEffect from '../../shared/useLayoutEffect';

const topOffset = 185;
const leftOffset = 25;
const inputWidth = 360;

const FloatingTextInputPlugin = () => {
	const [editor] = useLexicalComposerContext();
	const [text, setText] = useState('');
	const floatingInputActive = useLexicalEditorStore(s => s.floatingInputActive);
	const setFloatingInputActive = useLexicalEditorStore(
		s => s.setFloatingInputActive,
	);
	const editorScrollTop = useUIStore(s => s.editorScrollTop);
	const activeSidebar = useUIStore(s => s.activeSidebar);
	const activePanel = useUIStore(s => s.activePanel);
	const [top, setTop] = useState(0);
	const inputBoxRef = React.useRef(null);
	const containerRef = useClickOutside(() => setFloatingInputActive(undefined));

	// Temporary highlight selection
	const selectionState = useMemo(
		() => ({
			container: document.createElement('div'),
			elements: [],
		}),
		[],
	);

	const updateLocation = useCallback(() => {
		editor.getEditorState().read(() => {
			const selection = $getSelection();

			if ($isRangeSelection(selection)) {
				const anchor = selection.anchor;
				const focus = selection.focus;
				const range = createDOMRange(
					editor,
					anchor.getNode(),
					anchor.offset,
					focus.getNode(),
					focus.offset,
				);

				if (range !== null) {
					const { left, bottom, width, height, right } =
						range.getBoundingClientRect();
					setTop(bottom + editorScrollTop - height - topOffset);

					// Selected Text Highlighting
					const selectionRects = createRectsFromDOMRange(editor, range);
					const selectionRectsLength = selectionRects.length;
					let correctedLeft =
						selectionRectsLength === 1 ? left + width / 2 - 125 : left - 125;
					if (correctedLeft < 10) {
						correctedLeft = 10;
					}
					const { container, elements } = selectionState;
					const elementsLength = elements.length;

					for (let i = 0; i < selectionRectsLength; i++) {
						const selectionRect = selectionRects[i];
						let elem = elements[i];
						if (elem === undefined) {
							elem = document.createElement('span');
							elements[i] = elem;
							container.appendChild(elem);
						}
						const color = '45, 100, 170';
						const style = `position:absolute;top:${selectionRect.top}px;left:${selectionRect.left}px;height:${selectionRect.height}px;width:${selectionRect.width}px;background-color:rgba(${color}, 0.3);pointer-events:none;z-index:5;`;
						elem.style.cssText = style;
					}
					for (let i = elementsLength - 1; i >= selectionRectsLength; i--) {
						const elem = elements[i];
						container.removeChild(elem);
						elements.pop();
					}
				}
			}
		});
	}, [editor, selectionState, editorScrollTop]);

	// autofocus input
	useEffect(() => {
		if (floatingInputActive && inputBoxRef) {
			inputBoxRef.current.focus();
		}
	}, [floatingInputActive]);

	// Triggers update location
	useLayoutEffect(() => {
		updateLocation();
		const container = selectionState.container;
		const body = document.body;
		if (body !== null && !!floatingInputActive) {
			body.appendChild(container);
			return () => {
				body.removeChild(container);
			};
		}
	}, [selectionState.container, updateLocation, floatingInputActive]);

	// Keep updating highlighted text position on resize
	useEffect(() => {
		window.addEventListener('resize', updateLocation);

		return () => {
			window.removeEventListener('resize', updateLocation);
		};
	}, [updateLocation]);

	// Update highlighted text when sidebar open/close/change width
	useEffect(() => {
		updateLocation();
	}, [activeSidebar, activePanel, floatingInputActive, updateLocation]);

	return (
		<div
			ref={containerRef}
			className={clsx(
				`absolute text-foreground transition-all border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-neutral-950 rounded-lg border border-input `,
				floatingInputActive ? 'opacity-100' : 'opacity-0 pointer-events-none',
			)}
			style={{
				top: `${top}px`,
				left: `${leftOffset}px`,
				zIndex: 10000,
				width: `${inputWidth}px`,
			}}
		>
			<form
				className="relative flex"
				onSubmit={e => {
					e.preventDefault();
					floatingInputActive.onSubmit?.(text);
					setText('');
					// setFloatingInputActive(undefined);
				}}
			>
				<Input
					ref={inputBoxRef}
					className="p-1 ml-2 resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0"
					placeholder={floatingInputActive?.placeholder || 'Write something'}
					onChange={e => setText(e.target.value)}
					value={text}
				/>
				<button className="pr-3  top-0 right-0" type="submit">
					<Send
						size="18"
						className="mt-0.5 text-neutral-600 dark:peer-focus:text-neutral-500 peer-focus:text-neutral-300"
					/>
				</button>
			</form>
		</div>
	);
};

export default FloatingTextInputPlugin;
