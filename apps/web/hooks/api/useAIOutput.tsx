import useDocumentTabs, { TabType } from '@hooks/useDocumentTabs';
import useGetEditorRouter from '@hooks/useGetEditorRouter';
import { useLocalStorage } from '@mantine/hooks';
import { ManipulateTextMethods } from '@utils/manipulateTextMap';
import React, { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type AIOutputLogItem = {
	id: string;
	documentId: string;
	content: string; // allowing regeneration
	actionType: ManipulateTextMethods | string; // Think if you
	inputReference?: string;
	createdAt: Date;
};

const maxLog = 20;

const useAIOutput = () => {
	const { projectId } = useGetEditorRouter();
	const { activeDocument } = useDocumentTabs();
	const [aiOutputCache, setAIOutputCache] = useLocalStorage<
		Record<string, AIOutputLogItem[]>
	>({
		key: 'ai-output',
		defaultValue: {},
	});

	const currentProjectOutput = useMemo(() => {
		return (
			aiOutputCache[projectId]?.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
			) || []
		);
	}, [projectId, aiOutputCache]);

	const createNewAIOutput = (
		actionType: ManipulateTextMethods,
		inputReference: string,
	) => {
		//
		const previousLog =
			currentProjectOutput.length > maxLog
				? currentProjectOutput.slice(1)
				: currentProjectOutput;

		if (activeDocument && activeDocument.type === TabType.Document) {
			const newEntry: AIOutputLogItem = {
				documentId: activeDocument.source,
				id: uuidv4(),
				createdAt: new Date(),
				content: '',
				actionType,
				inputReference,
			};

			setAIOutputCache(data => ({
				...data,
				[projectId]: [newEntry, ...previousLog],
			}));

			return newEntry;
		}
	};

	const streamAIOutput = (id: string, chunk: string) => {
		// console.log({ chunk, id, aiOutputCache });
		setAIOutputCache(data => ({
			...aiOutputCache,
			[projectId]: data[projectId].map(i => {
				if (i.id === id) {
					return { ...i, content: i.content + chunk };
				}
				return i;
			}),
		}));
	};

	return { currentProjectOutput, createNewAIOutput, streamAIOutput };
};

export default useAIOutput;
