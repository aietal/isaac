import { Button } from '@components/ui/button';
import { Textarea } from '@components/ui/textarea';
import { useUIStore } from '@context/ui.store';
import useCreateDocumentThread from '@hooks/api/useDocumentThreads.create';
import { $wrapSelectionInMarkNode } from '@lexical/mark';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { createDOMRange, createRectsFromDOMRange } from '@lexical/selection';
import clsx from 'clsx';
import { $getSelection, $isRangeSelection } from 'lexical';
import { Check, X } from 'lucide-react';
import * as React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useLayoutEffect from '../../../shared/useLayoutEffect';

const topOffset = 139;

type Props = {
	documentId: string; // serves as a key of the generated input box
};

function CommentInputBox({ documentId }: Props) {
	const [editor] = useLexicalComposerContext();
	const [comment, setComment] = useState('');
	const [top, setTop] = useState(0);
	const { mutate: createDocumentThread } = useCreateDocumentThread();
	const inputBoxRef = React.useRef(null);
	const {
		editorScrollTop,
		activeSidebar,
		showDocumentComments,
		showCommentInputBox,
		setShowInputBox,
	} = useUIStore(
		({
			showCommentInputBox,
			editorScrollTop,
			activeSidebar,
			showDocumentComments,
			setShowDocumentComments,
			setShowInputBox,
		}) => ({
			editorScrollTop,
			activeSidebar,
			showDocumentComments,
			showCommentInputBox,
			setShowDocumentComments,
			setShowInputBox,
		}),
	);

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
					const { left, bottom, width, height } = range.getBoundingClientRect();
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
						const color = '255, 212, 0';
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

	const addInlineComment = () => {
		const id = uuidv4();
		editor.update(async () => {
			const selection = $getSelection();
			if ($isRangeSelection(selection)) {
				const quote = selection.getTextContent();

				// Perform API calls here
				createDocumentThread({
					id,
					quote,
					documentId,
					comment,
				});

				const focus = selection.focus;
				const anchor = selection.anchor;
				const isBackward = selection.isBackward();

				// Wrap content in a MarkNode
				$wrapSelectionInMarkNode(selection, isBackward, id);

				// Make selection collapsed at the end
				if (isBackward) {
					focus.set(anchor.key, anchor.offset, anchor.type);
				} else {
					anchor.set(focus.key, focus.offset, focus.type);
				}
			}
		});
		setShowInputBox(false);
		setComment('');
	};

	const cancelComment = useCallback(() => {
		editor.update(() => {
			const selection = $getSelection();
			// Restore selection
			if (selection !== null) {
				selection.dirty = true;
			}
		});
		setShowInputBox(false);
	}, [editor]);

	// Triggers update location
	useLayoutEffect(() => {
		updateLocation();
		const container = selectionState.container;
		const body = document.body;
		if (body !== null && showCommentInputBox) {
			body.appendChild(container);
			return () => {
				body.removeChild(container);
			};
		}
	}, [selectionState.container, updateLocation, showCommentInputBox]);

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
	}, [activeSidebar, showDocumentComments, updateLocation]);

	// autofocus input
	useEffect(() => {
		if (showCommentInputBox && inputBoxRef) {
			inputBoxRef.current.focus();
		}
	}, [showCommentInputBox]);

	return (
		<div
			className={clsx(
				'absolute transition-all border border-gray-200 dark:border-gray-800 w-full shadow-sm bg-white dark:bg-neutral-950 rounded',
				showCommentInputBox ? 'opacity-100' : 'opacity-0 pointer-events-none',
			)}
			style={{ top: `${top}px`, zIndex: 10000 }}
		>
			<Textarea
				ref={inputBoxRef}
				className="p-1 resize-none border-none"
				placeholder="Write comment to the quote..."
				onChange={e => setComment(e.target.value)}
				value={comment}
				onKeyDown={e => {
					if (e.key === 'Enter' && !e.shiftKey) {
						e.preventDefault();
						addInlineComment();
					}
				}}
			/>
			{/* <RichTextArea
        autofocus={showCommentInputBox && documentId === activeDocument?.source}
        contentClassName="border-0 bg-inherit"
        keyPressEvent={{
          onEscapePress: cancelComment,
          onModEnterPress: comment ? addInlineComment : undefined,
        }}
        onChange={editorState =>
          setComment(
            editorState.read(() => {
              return $rootTextContent();
            }),
          )
        }
      /> */}
			<div className="absolute bottom-0 right-0 flex gap-2 p-2 w-full justify-end">
				<Button
					variant="ghost"
					size="icon"
					onClick={cancelComment}
					className={clsx('p-1 h-8 w-8 text-muted-foreground ')}
				>
					<X strokeWidth={1.4} size={18} />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					onClick={addInlineComment}
					disabled={!comment}
					className={clsx('p-1 h-8 w-8 text-muted-foreground ')}
				>
					<Check size={18} strokeWidth={1.4} />
				</Button>
			</div>
		</div>
	);
}

export default CommentInputBox;
