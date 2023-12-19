import { useUser } from '@context/user';
import { QKFreeAIToken } from '@hooks/api/useFreeTierLimit.get';
import useDocumentTabs from '@hooks/useDocumentTabs';
import useGetEditorRouter from '@hooks/useGetEditorRouter';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createHeadingNode } from '@lexical/rich-text';
import { useLocalStorage } from '@mantine/hooks';
import { generateOutlineHeaderPrompt } from '@utils/promptBuilder';
import { AIModelLocalStorageKey } from 'data/aiModels.data';
import { $createParagraphNode, $createTextNode, $getSelection } from 'lexical';
import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { SSE } from 'sse.js';
// type Props = {}

const OutlinesGeneratorPlugin = () => {
	const { query, projectId, push } = useGetEditorRouter();
	const generateHeader = query['generate-header'] === 'true';
	const { activeDocument } = useDocumentTabs();
	const [editor] = useLexicalComposerContext();
	const queryClient = useQueryClient();
	const [llmModel] = useLocalStorage({ key: AIModelLocalStorageKey });
	const { user } = useUser();

	// Trigger
	useEffect(() => {
		if (generateHeader && activeDocument) {
			const source = new SSE(
				`/api/inline-prompt?userId=${user?.id}&llmModel=${
					llmModel || 'gpt-3.5-turbo'
				}`,
				{
					payload: generateOutlineHeaderPrompt(activeDocument.label),
				},
			);

			let isFirstLine = true;
			let isFirstWord = false;

			source.addEventListener('message', function (e) {
				const binaryString = atob(e.data);
				const eventMessage = decodeURIComponent(escape(binaryString))
				if (eventMessage === '[DONE]') {
					editor.update(() => {
						const selection = $getSelection();
						const paragraphNode = $createParagraphNode();
						const paragraphNode2 = $createParagraphNode();
						selection.insertNodes([paragraphNode, paragraphNode2]);
					});

					source.close();
					queryClient.invalidateQueries([QKFreeAIToken]);
					push(`/editor/${projectId}`);
				} else {
					// remove two line breaks after another from the text
					const text = eventMessage.replace(
						/\n\n/g,
						'',
					) as string;

					editor.update(() => {
						const selection = $getSelection();
						if (text === '##') {
							const headingNode = $createHeadingNode('h2');
							const paragraphNode = $createParagraphNode();
							const paragraphNode2 = $createParagraphNode(); // theres a bug when using the same paragraph node
							selection.insertNodes(
								isFirstLine
									? [headingNode]
									: [paragraphNode, paragraphNode2, headingNode],
							);
							isFirstWord = true;
							isFirstLine = false;
						} else {
							const toInsertChunk = isFirstWord ? text.trim() : text;
							selection.insertNodes([$createTextNode(toInsertChunk)]);
							isFirstWord = false;
						}
					});
				}
			});
			source.stream();
		}
	}, [generateHeader, editor]);

	return null;
};

export default OutlinesGeneratorPlugin;
