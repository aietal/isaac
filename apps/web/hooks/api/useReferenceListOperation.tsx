import { useLiteratureReferenceStore } from '@context/literatureReference.store';
import { useUser } from '@context/user';
import useDocumentTabs from '@hooks/useDocumentTabs';
import useGetEditorRouter from '@hooks/useGetEditorRouter';
import { useGetReference, useGetUserUploads } from '@resources/editor-page';
import Fuse from 'fuse.js';
import { useEffect, useState } from 'react';
import {
	ReferenceLiterature,
	UploadedFile,
} from 'types/literatureReference.type';

export enum ReferenceSourceFilter {
	ALL = 'ALL',
	SAVED = 'SAVED',
	UPLOADED = 'UPLOADED',
}

export type MergedItem = (ReferenceLiterature | UploadedFile) & {
	_source: 'reference' | 'uploaded';
};

const useReferenceListOperation = () => {
	const { projectId } = useGetEditorRouter();
	const { user } = useUser();
	const [refSearchInput, setRefSearchInput] = useState<string>('');
	const [referenceList, setReferenceList] = useState<ReferenceLiterature[]>();
	const [uploadedReferenceList, setUploadedReferenceList] =
		useState<UploadedFile[]>();
	const [filter, setFilter] = useState<ReferenceSourceFilter>(
		ReferenceSourceFilter.ALL,
	);
	const [allItems, setAllItems] = useState<MergedItem[]>([]);

	const setTargetDOI = useLiteratureReferenceStore(
		s => s.setSavedReferenceDOIPreview,
	);

	const { data: _referenceList } = useGetReference(projectId);
	const { data: userUploads } = useGetUserUploads(user?.id, projectId);
	const { openDocument } = useDocumentTabs();

	// Clientside Filter for reference
	const fuseInstances: Map<string, Fuse<any>> = new Map();
	const getFuseInstance = (dataList: any[], keys: string[]) => {
		const keyString = keys.join(',');
		let fuse = fuseInstances.get(keyString);

		if (!fuse) {
			fuse = new Fuse(dataList, {
				keys,
				threshold: 0.4,
				ignoreLocation: true,
				shouldSort: false,
			});
			fuseInstances.set(keyString, fuse);
		} else {
			fuse.setCollection(dataList);
		}

		return fuse;
	};

	const performSearch = (
		searchInput: string,
		dataList: any[],
		keys: string[],
	) => {
		if (
			!searchInput ||
			!dataList ||
			!Array.isArray(dataList) ||
			dataList.length === 0
		) {
			return dataList || [];
		}

		const fuse = getFuseInstance(dataList, keys);
		return fuse.search(searchInput).map(f => f.item);
	};

	useEffect(() => {
		const newReferenceList = performSearch(refSearchInput, _referenceList, [
			'title',
			'authors',
		]);
		setReferenceList(newReferenceList);
	}, [refSearchInput, _referenceList]);

	useEffect(() => {
		const newUploadedReferenceList = performSearch(
			refSearchInput,
			userUploads,
			['file_name', 'custom_citation.title'],
		);
		setUploadedReferenceList(newUploadedReferenceList);
	}, [refSearchInput, userUploads]);

	// Merge the two list, uploaded & saved literature
	useEffect(() => {
		if (referenceList && uploadedReferenceList) {
			let _referenceList: ReferenceLiterature[] = [];
			let _uploadedList: UploadedFile[] = [];

			if (filter === ReferenceSourceFilter.SAVED) {
				_referenceList = referenceList;
			} else if (filter === ReferenceSourceFilter.UPLOADED) {
				_uploadedList = uploadedReferenceList;
			} else {
				_uploadedList = uploadedReferenceList;
				_referenceList = referenceList;
			}

			const mergedList = [
				..._referenceList.map(i => ({ ...i, _source: 'reference' })),
				..._uploadedList.map(i => ({
					...i,
					_source: 'uploaded',
				})),
			].sort(
				(b, a) =>
					new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
			);

			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			setAllItems([...mergedList]);
		}
	}, [referenceList, uploadedReferenceList, filter]);

	return {
		openDocument,
		setTargetDOI,
		setRefSearchInput,
		mergedItem: allItems,
		filter,
		setFilter,
	};
};

export default useReferenceListOperation;
