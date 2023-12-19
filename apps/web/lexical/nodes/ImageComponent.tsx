import type {
	GridSelection,
	LexicalEditor,
	NodeKey,
	NodeSelection,
	RangeSelection,
} from 'lexical';

import useUploadDocumentImage from '@hooks/api/useUploadDocumentImage';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';
import { useClickOutside } from '@mantine/hooks';
import { dataURLtoFile } from '@utils/file';
import clsx from 'clsx';
import {
	$getNodeByKey,
	$getSelection,
	$isNodeSelection,
	$setSelection,
	CLICK_COMMAND,
	COMMAND_PRIORITY_LOW,
	DRAGSTART_COMMAND,
	KEY_BACKSPACE_COMMAND,
	KEY_DELETE_COMMAND,
	KEY_ENTER_COMMAND,
	KEY_ESCAPE_COMMAND,
	SELECTION_CHANGE_COMMAND,
} from 'lexical';
import * as React from 'react';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import ImageResizer from '../ui/ImageResizer';
import { $isImageNode } from './ImageNode';

const imageCache = new Set();

function useSuspenseImage(src: string) {
	if (!imageCache.has(src)) {
		throw new Promise(resolve => {
			const img = new Image();
			img.src = src;
			img.onload = () => {
				imageCache.add(src);
				resolve(null);
			};
		});
	}
}

function LazyImage({
	altText,
	className,
	imageRef,
	src,
	width,
	height,
	maxWidth,
}: {
	altText: string;
	className: string | null;
	height: 'inherit' | number;
	imageRef: { current: null | HTMLImageElement };
	maxWidth: number;
	src: string;
	width: 'inherit' | number;
}): JSX.Element {
	// useSuspenseImage(src);
	return (
		// eslint-disable-next-line @next/next/no-img-element
		<img
			className={className || undefined}
			src={src}
			alt={altText}
			ref={imageRef}
			style={{
				height,
				maxWidth,
				width,
			}}
			draggable="false"
		/>
	);
}

type Props = {
	altText: string;
	caption: LexicalEditor;
	captionStr: string;
	height: 'inherit' | number;
	maxWidth: number;
	nodeKey: NodeKey;
	resizable: boolean;
	showCaption: boolean;
	src: string;
	width: 'inherit' | number;
	captionsEnabled: boolean;
};

export default function ImageComponent({
	src,
	altText,
	nodeKey,
	width,
	height,
	maxWidth,
	resizable,
	showCaption,
	caption,
	captionStr,
	captionsEnabled,
}: Props): JSX.Element {
	const imageRef = useRef<null | HTMLImageElement>(null);
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const [isSelected, setSelected, clearSelection] =
		useLexicalNodeSelection(nodeKey);
	const [isResizing, setIsResizing] = useState<boolean>(false);
	const [editor] = useLexicalComposerContext();
	const [selection, setSelection] = useState<
		RangeSelection | NodeSelection | GridSelection | null
	>(null);

	const activeEditorRef = useRef<LexicalEditor | null>(null);

	// TODO: Handle delete upload file
	const onDelete = useCallback(
		(payload: KeyboardEvent) => {
			if (isSelected && $isNodeSelection($getSelection())) {
				const event: KeyboardEvent = payload;
				event.preventDefault();
				const node = $getNodeByKey(nodeKey);
				if ($isImageNode(node)) {
					node.remove();
				}
			}
			return false;
		},
		[isSelected, nodeKey],
	);

	const onEnter = useCallback(
		(event: KeyboardEvent) => {
			const latestSelection = $getSelection();
			const buttonElem = buttonRef.current;
			if (
				isSelected &&
				$isNodeSelection(latestSelection) &&
				latestSelection.getNodes().length === 1
			) {
				if (showCaption) {
					// Move focus into nested editor
					$setSelection(null);
					event.preventDefault();
					caption.focus();
					return true;
				} else if (
					buttonElem !== null &&
					buttonElem !== document.activeElement
				) {
					event.preventDefault();
					buttonElem.focus();
					return true;
				}
			}
			return false;
		},
		[caption, isSelected, showCaption],
	);

	const onEscape = useCallback(
		(event: KeyboardEvent) => {
			if (
				// activeEditorRef.current === caption ||
				buttonRef.current === event.target
			) {
				$setSelection(null);
				editor.update(() => {
					setSelected(true);
					const parentRootElement = editor.getRootElement();
					if (parentRootElement !== null) {
						parentRootElement.focus();
					}
				});
				return true;
			}
			return false;
		},
		[caption, editor, setSelected],
	);

	useEffect(() => {
		let isMounted = true;
		const unregister = mergeRegister(
			editor.registerUpdateListener(({ editorState }) => {
				if (isMounted) {
					setSelection(editorState.read(() => $getSelection()));
				}
			}),
			editor.registerCommand(
				SELECTION_CHANGE_COMMAND,
				(_, activeEditor) => {
					activeEditorRef.current = activeEditor;
					return false;
				},
				COMMAND_PRIORITY_LOW,
			),
			editor.registerCommand<MouseEvent>(
				CLICK_COMMAND,
				payload => {
					const event = payload;

					if (isResizing) {
						return true;
					}
					if (event.target === imageRef.current) {
						if (event.shiftKey) {
							setSelected(!isSelected);
						} else {
							clearSelection();
							setSelected(true);
						}
						return true;
					}

					return false;
				},
				COMMAND_PRIORITY_LOW,
			),
			editor.registerCommand(
				DRAGSTART_COMMAND,
				event => {
					if (event.target === imageRef.current) {
						// TODO This is just a temporary workaround for FF to behave like other browsers.
						// Ideally, this handles drag & drop too (and all browsers).
						event.preventDefault();
						return true;
					}
					return false;
				},
				COMMAND_PRIORITY_LOW,
			),
			editor.registerCommand(
				KEY_DELETE_COMMAND,
				onDelete,
				COMMAND_PRIORITY_LOW,
			),
			editor.registerCommand(
				KEY_BACKSPACE_COMMAND,
				onDelete,
				COMMAND_PRIORITY_LOW,
			),
			editor.registerCommand(KEY_ENTER_COMMAND, onEnter, COMMAND_PRIORITY_LOW),
			editor.registerCommand(
				KEY_ESCAPE_COMMAND,
				onEscape,
				COMMAND_PRIORITY_LOW,
			),
		);
		return () => {
			isMounted = false;
			unregister();
		};
	}, [
		clearSelection,
		editor,
		isResizing,
		isSelected,
		nodeKey,
		onDelete,
		onEnter,
		onEscape,
		setSelected,
	]);

	const setShowCaption = () => {
		editor.update(() => {
			const node = $getNodeByKey(nodeKey);
			if ($isImageNode(node)) {
				node.setShowCaption(true);
			}
		});
	};

	const onResizeEnd = (
		nextWidth: 'inherit' | number,
		nextHeight: 'inherit' | number,
	) => {
		// Delay hiding the resize bars for click case
		setTimeout(() => {
			setIsResizing(false);
		}, 200);

		editor.update(() => {
			const node = $getNodeByKey(nodeKey);
			if ($isImageNode(node)) {
				node.setWidthAndHeight(nextWidth, nextHeight);
			}
		});
	};

	const onResizeStart = () => {
		setIsResizing(true);
	};

	const handleCaptionChange = (text: string) => {
		editor.update(() => {
			const node = $getNodeByKey(nodeKey);
			if ($isImageNode(node)) {
				node.setCaptionStr(text);
			}
		});
	};

	const isFocused = isSelected || isResizing;

	useUploadImageToBucket(src, altText, nodeKey, editor);

	const ref = useClickOutside(() => {
		if (captionStr === '') {
			editor.update(() => {
				const node = $getNodeByKey(nodeKey);
				if ($isImageNode(node)) {
					node.setShowCaption(false);
				}
			});
		}
	});
	return (
		<Suspense fallback={null}>
			<>
				<div className="inline-block relative ">
					<LazyImage
						className={isFocused ? `focused` : null}
						src={src}
						altText={altText}
						imageRef={imageRef}
						width={width}
						height={height}
						maxWidth={maxWidth}
					/>

					{resizable && $isNodeSelection(selection) && isFocused && (
						<ImageResizer
							showCaption={showCaption}
							setShowCaption={setShowCaption}
							editor={editor}
							buttonRef={buttonRef}
							imageRef={imageRef}
							maxWidth={maxWidth}
							onResizeStart={onResizeStart}
							onResizeEnd={onResizeEnd}
							captionsEnabled={captionsEnabled}
						/>
					)}
				</div>
				{showCaption && !!caption && (
					<div
						className={clsx(showCaption ? 'h-auto' : 'h-0', 'mt-[-5px]')}
						ref={ref}
					>
						<input
							value={captionStr}
							onChange={e => handleCaptionChange(e.target.value)}
							placeholder="Add Caption"
							className="border-none text-center text-sm h-6 w-full focus:outline-none bg-inherit"
						/>
					</div>
				)}
			</>
		</Suspense>
	);
}

// Handle upload image when component is rendered
const useUploadImageToBucket = (
	src: string,
	altText: string,
	nodeKey: string,
	editor: LexicalEditor,
) => {
	const [updatedPath, setUpdatedPath] = useState<string>();
	const { uploadFile, isUploading } = useUploadDocumentImage();

	// Saving image to database
	useEffect(() => {
		if (src?.startsWith('data:')) {
			const file = dataURLtoFile(src, altText);
			uploadFile(file).then(filePath => {
				setUpdatedPath(filePath);
			});
		}
	}, [src, nodeKey]);

	// Update src node
	useEffect(() => {
		if (updatedPath?.startsWith('https://')) {
			editor.update(() => {
				const node = $getNodeByKey(nodeKey);
				if ($isImageNode(node)) {
					node.setSrc(updatedPath);
				}
			});
		}
	}, [updatedPath]);
};
