import { ReferenceTypeIconsMap } from '@components/core/IconMap';
import { Button } from '@components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@components/ui/dialog';
import {
	DocumentCheckBox,
	FolderCheckBox,
	FolderContainer,
} from '@components/ui/folders-and-files-tree';
import { useLiteratureReferenceStore } from '@context/literatureReference.store';
import useAddReference from '@hooks/api/useAddToReference';
import { useGetUserIntegration } from '@hooks/api/useUserIntegration.get';
import { useGetZoteroCollection } from '@hooks/api/zotero/useZoteroCollection.get';
import { useGetZoteroDocuments } from '@hooks/api/zotero/useZoteroDocuments.get';
import useGetEditorRouter from '@hooks/useGetEditorRouter';
import { ZoteroToIsaacReferenceTypeMap } from '@utils/referenceTypeMapper';
import { difference, every, includes, union } from 'lodash';
import React, { useEffect, useState } from 'react';
import { ZoteroDocument } from 'types/integration';
import { ReferenceSource, ReferenceType } from 'types/literatureReference.type';

const ImportZoteroModal = () => {
	const { projectId } = useGetEditorRouter();
	const [selectedDocs, setSelectedDocs] = useState<ZoteroDocument[]>([]);
	const openModal = useLiteratureReferenceStore(s => s.showZoteroModal);
	const setShowZoteroModal = useLiteratureReferenceStore(
		s => s.setShowZoteroModal,
	);
	const { data: zoteroFolders, refetch } = useGetZoteroCollection();

	const { mutateAsync: addReference } = useAddReference();

	// handle expired token
	useEffect(() => {
		if (openModal) {
			refetch();
		} else {
			setSelectedDocs([]);
		}
	}, [openModal]);

	const onSubmit = () => {
		addReference({
			projectId,
			papers: selectedDocs.map(i => {
				const type =
					ZoteroToIsaacReferenceTypeMap[i.data.itemType] ||
					ReferenceType.UNSPECIFIED;
				return {
					title: i.data.title,
					year: i.data.date ? new Date(i.data.date).getFullYear() : undefined,
					doi: i.data.DOI,
					authors: i.data.creators?.map(author => ({
						name: `${author.firstName} ${author.lastName}`,
						authorId: '',
					})),
					type,
					sourceId: i.key,
					source: ReferenceSource.ZOTERO,
					url: i.data.url,
					abstract: i.data.abstractNote,
				};
			}),
		});

		setShowZoteroModal(false);
	};

	return (
		<Dialog open={openModal} onOpenChange={setShowZoteroModal}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Import Citations from your Zotero library</DialogTitle>
				</DialogHeader>
				<FolderContainer>
					{zoteroFolders?.map(folder => (
						<FolderAccordion
							selectedDocs={selectedDocs}
							onDocumentRemove={ids =>
								setSelectedDocs(difference(selectedDocs, ids))
							}
							onDocumentAdded={ids => {
								setSelectedDocs(union(ids, selectedDocs));
							}}
							key={folder.key}
							id={folder.key}
							title={folder.data.name}
						/>
					))}
				</FolderContainer>
				<DialogFooter>
					<Button onClick={onSubmit}>Import</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default ImportZoteroModal;

//

type FolderAccordionProps = {
	title: string;
	id: string;
	selectedDocs: ZoteroDocument[];
	onDocumentAdded: (ids: ZoteroDocument[]) => void;
	onDocumentRemove: (ids: ZoteroDocument[]) => void;
};
const FolderAccordion = ({
	title,
	id,
	selectedDocs,
	onDocumentAdded,
	onDocumentRemove,
}: FolderAccordionProps) => {
	const { data: _documents } = useGetZoteroDocuments(id);
	const documents = _documents?.filter(i => !!i.data.title); // filter out document out of spec
	const documentIds = documents?.map(i => i.key);

	const handleSelectAll = (checked: boolean) => {
		if (documents) {
			if (checked) {
				onDocumentAdded(documents);
			} else {
				onDocumentRemove(documents);
			}
		}
	};

	const checked =
		documentIds?.length &&
		every(documentIds, item =>
			includes(
				selectedDocs.map(i => i.key),
				item,
			),
		);

	return (
		<FolderCheckBox
			id={id}
			disabled={!documents?.length}
			label={`${title} (${documents?.length || 0})`}
			onCheckChange={handleSelectAll}
			checked={checked}
		>
			{documents?.map(doc => (
				<DocumentCheckBox
					key={doc.key}
					id={doc.key}
					checked={!!selectedDocs?.map(i => i.key).includes(doc.key)}
					onCheckChange={checked => {
						checked ? onDocumentAdded([doc]) : onDocumentRemove([doc]);
					}}
					label={doc?.data.title}
					type={ZoteroToIsaacReferenceTypeMap[doc.data.itemType]}
				/>
			))}
		</FolderCheckBox>
	);
};
