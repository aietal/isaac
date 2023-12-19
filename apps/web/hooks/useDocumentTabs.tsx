import { useGetProjects } from '@hooks/api/useGetProjects';
import useGetEditorRouter from '@hooks/useGetEditorRouter';
import { useLocalStorage } from '@mantine/hooks';
import { LiteratureResponse } from '@resources/literature.api';
import { LocalStorageKeys } from '@utils/localStorageKeys';
import { omit } from 'lodash';
import React, { useEffect, useMemo } from 'react';

export enum TabType {
	SemanticScholar = 'SemanticScholar',
	Document = 'Document',
	UserUpload = 'UserUpload',
	Chat = 'Chat',
	LiteratureSearch = 'LiteratureSearch',
	SavedReference = 'SavedReference',
}

export const paperTypeTabs = [
	TabType.Document,
	TabType.UserUpload,
	TabType.Chat,
];

export type ProjectTabs = Record<
	string,
	{
		source: string;
		type: TabType;
		label: string;
		active: boolean;
		order?: number;
	}[]
>;

type OpenDocumentPayload = {
	source: string; //* id or url
	label: string;
	type: TabType;
	_projectId?: string;
};

export enum UniqueTabSources {
	NEW_CHAT = 'new-chat',
	NEW_LIT_SEARCH = 'new-lit-search',
	SAVED_REFERENCE_TAB = 'saved-ref-tab',
}

// ? Is this the right approach ? should I be using Zustand state
const useDocumentTabs = () => {
	const { data: projectList } = useGetProjects();
	const { projectId } = useGetEditorRouter();
	const [searchedResultInLocalStorage, setSearchedResultInLocalStorage] =
		useLocalStorage<Record<string, LiteratureResponse>>({
			key: 'literature-search',
			defaultValue: {},
		});

	const [projectDocumentTabsMemory, setProjectDocumentTabsMemory] =
		useLocalStorage<ProjectTabs | undefined | null>({
			key: LocalStorageKeys.PROJECT_TABS,
			defaultValue: null, // this cannot be set undefined, else it'll overlaps
		});

	// Initialize if doesn't exist
	useEffect(() => {
		if (projectDocumentTabsMemory === undefined && projectList?.length) {
			const _projectTabs: ProjectTabs = {};
			projectList.forEach(project => {
				_projectTabs[project.id] = [];
			});
			setProjectDocumentTabsMemory(_projectTabs);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [projectDocumentTabsMemory, projectList]);

	const currentProjectTabs = useMemo(
		() =>
			projectId && !!projectDocumentTabsMemory
				? projectDocumentTabsMemory?.[projectId]
				: null,
		[projectId, projectDocumentTabsMemory],
	);

	const activeDocument = useMemo(() => {
		return currentProjectTabs?.find(document => document.active === true);
	}, [currentProjectTabs]);

	const openDocument = (
		{ source, label, type, _projectId }: OpenDocumentPayload, // open doc
	) => {
		// set all tabs to false
		const openedTabs =
			projectDocumentTabsMemory?.[_projectId || projectId]?.map(tabs => ({
				...tabs,
				active: false,
			})) || [];

		const tabExisted = openedTabs?.find(tab => tab.source === source);
		if (tabExisted) {
			setProjectDocumentTabsMemory({
				...projectDocumentTabsMemory,
				[_projectId || projectId]: [
					...openedTabs.map(tab => ({
						...tab,
						active: tab.source === source ? true : false,
					})),
				],
			});
			return;
		}

		setProjectDocumentTabsMemory({
			...projectDocumentTabsMemory,
			[_projectId || projectId]: [
				...openedTabs,
				{ type, source: source, label, active: true },
			],
		});
	};

	const toggleDocumentByTabIndex = (idx: number) => {
		// if tab idx doesnt exist
		if (idx > currentProjectTabs.length - 1) return;

		const activeDocIdx = currentProjectTabs?.findIndex(
			document => document.active === true,
		);

		if (activeDocIdx === idx) return;
		const openedTabs =
			projectDocumentTabsMemory?.[projectId]?.map((tabs, _idx) => ({
				...tabs,
				active: idx === _idx,
			})) || [];

		setProjectDocumentTabsMemory({
			...projectDocumentTabsMemory,
			[projectId]: openedTabs,
		});
	};

	const closeTab = (source: string, _projectId?: string) => {
		const filteredTab = projectDocumentTabsMemory[
			_projectId || projectId
		].filter(tab => tab.source !== source);

		const noTabActive = filteredTab.every(tab => tab.active === false);
		if (noTabActive) {
			if (filteredTab.length) {
				filteredTab[filteredTab.length - 1].active = true;
			}
		}

		setProjectDocumentTabsMemory({
			...projectDocumentTabsMemory,
			[_projectId || projectId]: filteredTab,
		});

		// Remove search cache here
		setSearchedResultInLocalStorage(
			omit(searchedResultInLocalStorage, [source]),
		);
	};

	const renameTab = (source: string, newName: string) => {
		console.log({ source, tabs: projectDocumentTabsMemory[projectId] });
		const renamedDocumentTabs = projectDocumentTabsMemory[projectId].map(
			tab => ({
				...tab,
				label: source === tab.source ? newName : tab.label,
			}),
		);

		setProjectDocumentTabsMemory({
			...projectDocumentTabsMemory,
			[projectId]: renamedDocumentTabs,
		});
	};

	const addProject = (projectId: string) => {
		setProjectDocumentTabsMemory({
			...projectDocumentTabsMemory,
			[projectId]: [],
		});
	};

	const deleteProjectFromTabMemory = (projectId: string) => {
		const { [projectId]: deletedKey, ...rest } = projectDocumentTabsMemory;
		setProjectDocumentTabsMemory(rest);
	};

	const updateLiteratureSearchTab = (newLabel: string, targetTab: string) => {
		const updatedDocumentTabs = projectDocumentTabsMemory[projectId].map(
			tab => ({
				...tab,
				source: tab.source === targetTab ? newLabel : tab.source,
				label: tab.source === targetTab ? newLabel : tab.label,
			}),
		);

		setProjectDocumentTabsMemory({
			...projectDocumentTabsMemory,
			[projectId]: updatedDocumentTabs,
		});
	};

	const handleTabOnSort = (newSortingOrder: string[]) => {
		const updatedDocumentTabs = projectDocumentTabsMemory[projectId].sort(
			(a, b) => {
				const indexA = newSortingOrder.indexOf(a.source);
				const indexB = newSortingOrder.indexOf(b.source);

				// Check if both IDs exist in the order array
				if (indexA !== -1 && indexB !== -1) {
					return indexA - indexB;
				}

				// If one ID doesn't exist in the order array, move it to the end
				if (indexA === -1) return 1;
				if (indexB === -1) return -1;

				// Fallback case - maintain the current order if neither ID exists in the order array
				return 0;
			},
		);

		setProjectDocumentTabsMemory({
			...projectDocumentTabsMemory,
			[projectId]: updatedDocumentTabs,
		});
	};

	const updateNewChatTab = (newSource: string, newLabel: string) => {
		const filteredTab = projectDocumentTabsMemory[projectId].filter(
			tab => tab.source !== UniqueTabSources.NEW_CHAT,
		);

		setProjectDocumentTabsMemory({
			...projectDocumentTabsMemory,
			[projectId]: [
				...filteredTab,
				{
					type: TabType.Chat,
					source: newSource,
					label: newLabel,
					active: true,
				},
			],
		});
	};

	return {
		openDocument,
		closeTab,
		renameTab,
		addProject,
		handleTabOnSort,
		deleteProjectFromTabMemory,
		toggleDocumentByTabIndex,
		updateLiteratureSearchTab,
		updateNewChatTab,
		activeDocument,
		currentProjectTabs,
		projectId,
	};
};

export default useDocumentTabs;
