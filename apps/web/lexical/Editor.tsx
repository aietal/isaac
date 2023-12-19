import { useUIStore } from '@context/ui.store';
import { GrammarlyEditorPlugin } from '@grammarly/editor-sdk-react';
import { useGetDocumentById } from '@hooks/api/useGetDocumentById';
import useUpdateDocument from '@hooks/api/useUpdateDocument';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { MarkNode } from '@lexical/mark';
import { TRANSFORMERS } from '@lexical/markdown';
import { AIOutputNode } from '@lexical/nodes/AIOutputNode';
import { EquationNode } from '@lexical/nodes/EquationNode';
import { ImageNode } from '@lexical/nodes/ImageNode';
import AutoSavePlugin from '@lexical/plugins/AutoSavePlugin';
import FocusStatePlugin from '@lexical/plugins/FocusStatePlugin';
import RestoreStatePlugin from '@lexical/plugins/RestoreStatePlugin';
import TableOfContentPlugin from '@lexical/plugins/TableOfContentPlugin';
import { TableContext } from '@lexical/plugins/TablePlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { CAN_USE_DOM } from '@lexical/shared/canUseDOM';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import clsx from 'clsx';
import { $getRoot, EditorState } from 'lexical';
import dynamic from 'next/dynamic';
import React, { useCallback, useEffect, useState } from 'react';
import { CitationNode } from './nodes/CitationNode';
import AutoLinkPlugin from './plugins/AutoLinkPlugin';
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import { CollapsibleContainerNode } from './plugins/CollapsiblePlugin/CollapsibleContainerNode';
import { CollapsibleContentNode } from './plugins/CollapsiblePlugin/CollapsibleContentNode';
import { CollapsibleTitleNode } from './plugins/CollapsiblePlugin/CollapsibleTitleNode';
import { LinePlaceholderPlugin } from './plugins/LinePlaceholderPlugin';
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin';
import TabFocusPlugin from './plugins/TabFocusPlugin';
import DefaultTheme from './themes/DefaultTheme';

type Props = {
	documentId: string;
	active?: boolean;
};

const HotkeyPlugin = dynamic(() => import('./plugins/HotkeyPlugin'), {
	ssr: false,
});

const ImagesPlugin = dynamic(() => import('./plugins/ImagesPlugin'), {
	ssr: false,
});

const CommandPlugin = dynamic(() => import('./plugins/CommandPlugin'), {
	ssr: false,
});

const CitationPlugin = dynamic(() => import('./plugins/CitationPlugin'), {
	ssr: false,
});

const InlinePromptPlugin = dynamic(
	() => import('./plugins/InlinePromptPlugin'),
	{
		ssr: false,
	},
);

const ResearchQuestionPlugin = dynamic(
	() => import('./plugins/ResearchQuestionPlugin'),
	{
		ssr: false,
	},
);

const DraggableBlockPlugin = dynamic(
	() => import('./plugins/DraggableBlockPlugin'),
	{
		ssr: false,
	},
);

const CommentPlugin = dynamic(() => import('./plugins/CommentPlugin'), {});

const FloatingToolbarPlugin = dynamic(
	() => import('./plugins/FloatingToolbarPlugin'),
	{ ssr: false },
);

const FloatingTextInputPlugin = dynamic(
	() => import('./plugins/FloatingTextInputPlugin'),
	{
		ssr: false,
	},
);

const ToolbarV2Plugin = dynamic(() => import('./plugins/ToolbarV2Plugin'), {
	ssr: false,
});

const OutlinesGeneratorPlugin = dynamic(
	() => import('./plugins/OutlinesGeneratorPlugin'),
	{
		ssr: false,
	},
);

const TableCellActionMenuPlugin = dynamic(
	() => import('@lexical/plugins/TablePlugin/TableActionMenuPlugin'),
	{ ssr: false },
);
const TableCellResizer = dynamic(
	() => import('@lexical/plugins/TablePlugin/TableCellResizer'),
	{ ssr: false },
);

const EquationsPlugin = dynamic(() => import('./plugins/EquationsPlugin'), {
	ssr: false,
});

const DragDropPaste = dynamic(() => import('./plugins/DragDropPastePlugin'), {
	ssr: false,
});

const CollapsiblePlugin = dynamic(() => import('./plugins/CollapsiblePlugin'), {
	ssr: false,
});

const DevPlaygroundPlugin = dynamic(
	() => import('./plugins/DevPlaygroundPlugin'),
	{
		ssr: false,
	},
);

const EditorLexical = ({ documentId, active }: Props) => {
	const { data: document } = useGetDocumentById(documentId);
	const [floatingAnchorElem, setFloatingAnchorElem] =
		useState<HTMLDivElement | null>(null);
	const showDocumentComments = useUIStore(s => s.showDocumentComments);
	const onRef = (_floatingAnchorElem: HTMLDivElement) => {
		if (_floatingAnchorElem !== null) {
			setFloatingAnchorElem(_floatingAnchorElem);
		}
	};

	const updateDoc = useUpdateDocument();

	const [isSmallWidthViewport, setIsSmallWidthViewport] =
		useState<boolean>(false);

	useEffect(() => {
		const updateViewPortWidth = () => {
			const isNextSmallWidthViewport =
				CAN_USE_DOM && window.matchMedia('(max-width: 1025px)').matches;

			if (isNextSmallWidthViewport !== isSmallWidthViewport) {
				setIsSmallWidthViewport(isNextSmallWidthViewport);
			}
		};
		updateViewPortWidth();
		window.addEventListener('resize', updateViewPortWidth);

		return () => {
			window.removeEventListener('resize', updateViewPortWidth);
		};
	}, [isSmallWidthViewport]);

	const saveDocument = useCallback(
		(editorState: EditorState) => {
			if (!document) {
				// Handle the case where document is not available
				console.error('Document is not available. Failed to save document.');
				return;
			}

			updateDoc({
				id: document.id,
				editorStateStr: JSON.stringify(editorState),
				debug: {
					text: editorState.read(() => $getRoot().getTextContent()),
					title: document.title,
				},
			});
		},
		[updateDoc, document],
	);

	return (
		<>
			<LexicalComposer
				initialConfig={{
					namespace: `editor-${documentId}`,
					theme: DefaultTheme,
					// editable: active, // TODO: this doesn't work, it introduce bugs
					editorState: null,
					onError: error => console.log(error),
					nodes: [
						HeadingNode,
						ListNode,
						ListItemNode,
						QuoteNode,
						CodeNode,
						CodeHighlightNode,
						TableNode,
						TableCellNode,
						TableRowNode,
						AutoLinkNode,
						LinkNode,
						MarkNode,
						CitationNode,
						ImageNode,
						HorizontalRuleNode,
						EquationNode,
						CollapsibleContainerNode,
						CollapsibleContentNode,
						CollapsibleTitleNode,
						AIOutputNode,
					],
				}}
			>
				<div
					className={clsx(
						!active ? 'hidden h-0' : 'h-full',
						'dark:bg-black bg-white editor-pdf flex flex-col items-center relative w-full  pr-6',
					)}
				>
					<RichTextPlugin
						ErrorBoundary={LexicalErrorBoundary}
						placeholder={null}
						contentEditable={
							<div className="editor-scroller">
								<div
									ref={onRef}
									className="editor flex justify-between relative"
									id="editor-content"
								>
									<ToolbarV2Plugin />
									<GrammarlyEditorPlugin
										className={clsx(
											'grow w-full prose  px-4 md:px-6 pb-28 relative dark:prose-invert',
											showDocumentComments ? 'max-w-3xl' : 'max-w-5xl',
										)}
										config={{
											documentDomain: 'academic',
											introText:
												'Isaac integrates with Grammarly to help you write better.',
										}}
									>
										<ContentEditable className="focus:outline-none" />
									</GrammarlyEditorPlugin>
									{active && <CommentPlugin documentId={document?.id || ''} />}
								</div>
							</div>
						}
					/>

					<MarkdownShortcutPlugin transformers={TRANSFORMERS} />
					<RestoreStatePlugin document={document} saveDocument={saveDocument} />

					{active && (
						<>
							<TabIndentationPlugin />
							<TabFocusPlugin />
							{/* <FloatingToolbarPlugin /> */}
							<FloatingTextInputPlugin />
							<FloatingToolbarPlugin />
							<CommandPlugin />
							<AutoFocusPlugin />
							<LinePlaceholderPlugin />
							<FocusStatePlugin />
							<CodeHighlightPlugin />
							<HistoryPlugin />
							<ListPlugin />
							<LinkPlugin />
							<AutoLinkPlugin />
							<EquationsPlugin />
							<ResearchQuestionPlugin />
							<ListMaxIndentLevelPlugin maxDepth={7} />
							<HotkeyPlugin />
							<DragDropPaste />
							<CollapsiblePlugin />
							<ImagesPlugin />
							<HorizontalRulePlugin />
							<TableOfContentPlugin />
							<InlinePromptPlugin />
							<CitationPlugin />
							<OutlinesGeneratorPlugin />
							<TableContext>
								<>
									<TablePlugin />
									{<TableCellResizer />}
									{floatingAnchorElem && (
										<TableCellActionMenuPlugin
											anchorElem={floatingAnchorElem}
										/>
									)}
								</>
							</TableContext>
							<AutoSavePlugin saveDocument={saveDocument} />
						</>
					)}

					{floatingAnchorElem && active && (
						<DraggableBlockPlugin anchorElem={floatingAnchorElem} />
					)}
					{floatingAnchorElem && !isSmallWidthViewport && (
						<>
							<DraggableBlockPlugin anchorElem={floatingAnchorElem} />
							{/*
                <TableCellActionMenuPlugin
                  anchorElem={floatingAnchorElem}
                  cellMerge={true}
                /> */}
						</>
					)}
					{/* {process.env.NODE_ENV === 'development' && <DevPlaygroundPlugin />} */}
				</div>
			</LexicalComposer>
		</>
	);
};

export default React.memo(EditorLexical);
