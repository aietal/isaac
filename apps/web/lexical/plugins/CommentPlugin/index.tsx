import { useUIStore } from '@context/ui.store';
import { useGetDocumentCommentThreads } from '@hooks/api/useDocumentThreads.get';
import { $createMarkNode, $isMarkNode, MarkNode } from '@lexical/mark';
import CommentContainer from '@lexical/plugins/CommentPlugin/component/CommentContainer';
import CommentInputBox from '@lexical/plugins/CommentPlugin/component/CommentInputBox';
import CommentThreadCard from '@lexical/plugins/CommentPlugin/component/CommentThreadCard';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister, registerNestedElementResolver } from '@lexical/utils';
import { $getNodeByKey, COMMAND_PRIORITY_EDITOR, createCommand } from 'lexical';
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { ThreadPosition } from 'types/threadComments';

export const INSERT_INLINE_COMMAND = createCommand('INSERT_INLINE_COMMAND');
export const INSERT_AI_COMMENT = createCommand('INSERT_AI_COMMENT');

// type CommentsPanelListProps = {};

type Props = {
	documentId: string;
};

export default function CommentPlugin({ documentId }: Props) {
	const [editor] = useLexicalComposerContext();
	const [threadPosition, setThreadPosition] = useState<ThreadPosition[]>([]);
	const { data: threads } = useGetDocumentCommentThreads();

	// ? This should be a state
	const markNodeMap = useMemo(() => {
		return new Map<string, Set<string>>();
	}, []);
	const [activeMarkKey, setActiveMarkKey] = useState<string>();
	const editorScroll = useUIStore(s => s.editorScrollTop);
	const showDocumentComments = useUIStore(s => s.showDocumentComments);
	const setShowCommentInputBox = useUIStore(s => s.setShowInputBox);
	const setShowDocumentComments = useUIStore(s => s.setShowDocumentComments);

	// Initialize all Mark Nodes
	useEffect(() => {
		const markNodeKeysToIDs = new Map();
		return mergeRegister(
			registerNestedElementResolver(
				editor,
				MarkNode,
				from => {
					const createdMarkNodes = $createMarkNode(from.getIDs());
					return createdMarkNodes;
				},
				(from, to) => {
					// Merge the IDs
					const ids = from.getIDs();
					ids.forEach(id => {
						to.addID(id);
					});
				},
			),
			editor.registerMutationListener(MarkNode, mutations => {
				editor.getEditorState().read(() => {
					for (const [key, mutation] of mutations) {
						const node = $getNodeByKey(key);
						let ids: string[] = [];
						if (mutation === 'destroyed') {
							ids = markNodeKeysToIDs.get(key) || [];

							// TODO: THink on how to handle delete thread => give warning to user if they wanted to delete comments as well
						} else if ($isMarkNode(node)) {
							ids = node.getIDs();
						}

						// Add event listener to mark elements
						if (mutation === 'created') {
							const elem = editor.getElementByKey(key);
							if (elem) {
								elem.addEventListener('mouseenter', () =>
									setActiveMarkKey(key),
								);
								elem.addEventListener('mouseleave', () =>
									setActiveMarkKey(undefined),
								);
								elem.addEventListener('click', () =>
									setShowDocumentComments(true),
								);
							}
						}

						for (let i = 0; i < ids.length; i++) {
							const id = ids[i];
							let markNodeKeys = markNodeMap.get(id);
							markNodeKeysToIDs.set(key, ids);

							if (mutation === 'destroyed') {
								if (markNodeKeys !== undefined) {
									markNodeKeys.delete(key);
									if (markNodeKeys.size === 0) {
										markNodeMap.delete(id);
									}
								}
							} else {
								if (markNodeKeys === undefined) {
									markNodeKeys = new Set();
									markNodeMap.set(id, markNodeKeys);
								}
								if (!markNodeKeys.has(key)) {
									markNodeKeys.add(key);
								}
							}
						}
					}
				});
			}),

			editor.registerCommand(
				INSERT_INLINE_COMMAND,
				() => {
					window.getSelection()?.removeAllRanges();
					setShowCommentInputBox(true);
					return true;
				},
				COMMAND_PRIORITY_EDITOR,
			),
		);
	}, [editor, markNodeMap]);

	// Implement on change lister, split this from the main initializer because of the dependency array
	useEffect(() => {
		editor.registerUpdateListener(({ editorState, tags }) => {
			editorState.read(() => {
				const keys = [...markNodeMap.entries()].map(([k, v], idx) => ({
					threadId: k,
					markNodeKey: [...v][0],
					idx,
				}));
				let _yCurrent: number;
				let _yPrev: number;
				let _x = 0;

				// Create thead positioning and stacking
				const threadPosition: ThreadPosition[] = keys.map((key, idx) => {
					const elem = editor.getElementByKey(key.markNodeKey);

					if (elem) {
						// mark styling
						elem?.classList.add('bg-yellow-200', 'dark:bg-yellow-300');

						//  get top position //TODO: use notion approach to stack cards without the overlap
						const elemY = elem.getBoundingClientRect().y + editorScroll;

						if (idx === 0) {
							_yPrev = elemY;
							_yCurrent = elemY;
							return { ...key, y: _yPrev, x: 0 };
						} else {
							const y = _yPrev !== elemY ? elemY : _yCurrent + 15;
							const x = _yPrev !== elemY ? 0 : _x + 15;
							_x = x;
							_yPrev = elemY;
							_yCurrent = y;
							return { ...key, y, x };
						}
					}
				});

				if (threadPosition?.length) {
					setThreadPosition(threadPosition);
				}
			});
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editorScroll, editor, markNodeMap, showDocumentComments]);

	// Add listener to mark node
	useEffect(() => {
		const elem = editor.getElementByKey(activeMarkKey);
		if (elem !== null) {
			elem?.classList.replace('bg-yellow-200', 'bg-green-200');
			elem?.classList.replace('dark:bg-yellow-300', 'dark:bg-green-400');
		}
		return () => {
			elem?.classList.replace('bg-green-200', 'bg-yellow-200');
			elem?.classList.replace('dark:bg-green-400', 'dark:bg-yellow-300');
		};
	}, [activeMarkKey, editor, markNodeMap]);

	return (
		<>
			<CommentContainer>
				<CommentInputBox documentId={documentId} />
				{threads?.map((thread, idx) => {
					const thisThread = threadPosition.find(
						t => t?.threadId === thread.id,
					);
					return (
						<CommentThreadCard
							threadId={thread.id}
							idx={thisThread?.idx || idx}
							y={thisThread?.y || 0}
							x={thisThread?.x || 0}
							hovered={activeMarkKey === thisThread?.markNodeKey}
							markNodeKey={thisThread?.markNodeKey}
							quote={thread.quote}
							key={thread.id}
							comments={thread.comments}
							onHover={hovered =>
								hovered
									? setActiveMarkKey(thisThread?.markNodeKey)
									: setActiveMarkKey(undefined)
							}
						/>
					);
				})}
			</CommentContainer>
		</>
	);
}
