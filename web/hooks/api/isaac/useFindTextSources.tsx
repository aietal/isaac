import useAIAssistantStore from '@context/aiAssistant.store';
import useLexicalEditorStore from '@context/lexicalEditor.store';
import { useUser } from '@context/user';
import useGetEditorRouter from '@hooks/useGetEditorRouter';
import { $createAIOutputNode } from '@lexical/nodes/AIOutputNode';
import { LiteratureResponse } from '@resources/literature.api';
import { $getSelection, $isRangeSelection } from 'lexical';
import mixpanel from 'mixpanel-browser';
import { useCallback } from 'react';
import { LiteratureSource } from 'types/chat';

const useFindTextSources = () => {
	const { user } = useUser();
	const { projectId } = useGetEditorRouter();
	const editor = useLexicalEditorStore(s => s.activeEditor);
	const {
		setLiteratureReferenceOutput,
		setLiteratureReferenceOutputLoading,
		setCachedSelection,
		setOpen,
	} = useAIAssistantStore(state => state.actions);

	const insertAIOutputComponent = useCallback(() => {
		editor.update(() => {
			const selection = $getSelection();
			if (!$isRangeSelection(selection)) {
				return;
			}
			setCachedSelection(selection.clone());
			const aiOutputNode = $createAIOutputNode('source-output');
			const focusedNode = selection.focus.getNode();
			focusedNode.insertAfter(aiOutputNode, true);
		});
		setLiteratureReferenceOutputLoading(true);
	}, [editor]);

	const findSources = async (text: string) => {
		mixpanel.track('Searched Sources');
		insertAIOutputComponent();
		setOpen(true);

		// TODO: consider language
		// const prompt = manipulateTextMap[method]?.promptBuilder(text);

		const response = await fetch('/api/find-sources', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ input: window.getSelection().toString() }),
		});

		const data = (await response.json()) as LiteratureResponse;

		const sources: LiteratureSource[] = data.literature?.map(lit => ({
			title: lit.title,
			url: lit.url,
			paperId: lit.paperId,
			authors: lit.authors,
			year: lit.year,
			doi: lit.externalIds.DOI,
			pdf: lit.openAccessPdf.url,
			abstract: lit.abstract,
		}));

		setLiteratureReferenceOutput(sources);
	};

	return { findSources };
};

export default useFindTextSources;
