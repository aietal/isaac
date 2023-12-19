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
import { useGetMendeleyDocuments } from '@hooks/api/mendeley/useMendeleyDocuments.get';
import { useGetMendeleyFolders } from '@hooks/api/mendeley/useMendeleyFolders.get';
import useRefreshMendeleyToken from '@hooks/api/mendeley/useMendeleyToken.refresh';
import useAddReference from '@hooks/api/useAddToReference';
import { useGetUserIntegration } from '@hooks/api/useUserIntegration.get';
import useGetEditorRouter from '@hooks/useGetEditorRouter';
import { mendeleyToIsaacReferenceTypeMap } from '@utils/referenceTypeMapper';
import { difference, every, includes, union } from 'lodash';
import React, { useEffect, useState } from 'react';
import { MendeleyDocument, MendeleyFolder } from 'types/integration';
import { ReferenceSource, ReferenceType } from 'types/literatureReference.type';

const ImportMendeleyModal = () => {
	const [tokenValid, setTokenValid] = useState<boolean>(false);
	const [selectedDocs, setSelectedDocs] = useState<MendeleyDocument[]>([]);
	const { data: userIntegration } = useGetUserIntegration();
	const { projectId } = useGetEditorRouter();
	const openModal = useLiteratureReferenceStore(s => s.showMendeleyModal);
	const setShowMendeleyModal = useLiteratureReferenceStore(
		s => s.setShowMendeleyModal,
	);
	const { mutateAsync: refreshToken } = useRefreshMendeleyToken();
	const { data: mendeleyFolders } = useGetMendeleyFolders(
		tokenValid && userIntegration.mendeley.access_token,
	);
	const { mutateAsync: addReference } = useAddReference();

	// handle expired token
	useEffect(() => {
		if (userIntegration?.mendeley && openModal) {
			refreshToken(userIntegration.mendeley.refresh_token).then(() => {
				setTokenValid(true);
			});
		}
		if (openModal === false) {
			setSelectedDocs([]);
			setTokenValid(false);
		}
	}, [openModal, userIntegration]);

	// Handle Mendeley token request fail
	useEffect(() => {
		if (!Array.isArray(mendeleyFolders)) {
			if (userIntegration?.mendeley?.refresh_token) {
				refreshToken(userIntegration.mendeley.refresh_token);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mendeleyFolders]);

	const onSubmit = () => {
		addReference({
			projectId,
			papers: selectedDocs.map(i => {
				const type =
					mendeleyToIsaacReferenceTypeMap[i.type] || ReferenceType.UNSPECIFIED;
				return {
					title: i.title,
					year: i.year,
					doi: i.identifiers.doi,
					authors: i.authors.map(author => ({
						name: `${author.first_name} ${author.last_name}`,
						authorId: '',
					})),
					type,
					sourceId: i.id,
					source: ReferenceSource.MENDELEY,
					abstract: i.abstract,
					pdf: null,
				};
			}),
		});

		setShowMendeleyModal(false);
	};

	const renderFolderAccordion = (folder: MendeleyFolder) => (
		<FolderAccordion
			selectedDocs={selectedDocs}
			onDocumentRemove={ids => setSelectedDocs(difference(selectedDocs, ids))}
			onDocumentAdded={ids => setSelectedDocs(union(ids, selectedDocs))}
			key={folder.id}
			id={folder.id}
			title={folder.name}
		/>
	);

	const folderAccordions = Array.isArray(mendeleyFolders)
		? mendeleyFolders.map(renderFolderAccordion)
		: null;

	return (
		<Dialog open={openModal} onOpenChange={setShowMendeleyModal}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Select references to import from Mendeley</DialogTitle>
				</DialogHeader>
				<FolderContainer>{folderAccordions}</FolderContainer>
				<DialogFooter>
					<Button disabled={selectedDocs.length === 0} onClick={onSubmit}>
						Import
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default ImportMendeleyModal;

type FolderAccordionProps = {
	title: string;
	id: string;
	selectedDocs: MendeleyDocument[];
	onDocumentAdded: (ids: MendeleyDocument[]) => void;
	onDocumentRemove: (ids: MendeleyDocument[]) => void;
};
const FolderAccordion = ({
	title,
	id,
	selectedDocs,
	onDocumentAdded,
	onDocumentRemove,
}: FolderAccordionProps) => {
	const { data: _documents } = useGetMendeleyDocuments(id);

	if (!Array.isArray(_documents)) {
		return;
	}

	const documents = _documents?.filter(i => !!i.title); // filter out document out of spec
	const documentIds = documents?.map(i => i.id);

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
				selectedDocs.map(i => i.id),
				item,
			),
		);

	if (documents.length === 0) {
		return <div>No folder found</div>;
	}

	return (
		<FolderCheckBox
			id={id}
			disabled={!documents?.length}
			label={`${title} (${documents?.length || 0})`}
			onCheckChange={handleSelectAll}
			checked={checked}
		>
			{documents?.map(doc => {
				const type = mendeleyToIsaacReferenceTypeMap[doc.type];
				return (
					<DocumentCheckBox
						key={doc.id}
						id={doc.id}
						checked={!!selectedDocs?.map(i => i.id).includes(doc.id)}
						onCheckChange={checked => {
							checked ? onDocumentAdded([doc]) : onDocumentRemove([doc]);
						}}
						label={doc?.title}
						type={type}
					/>
				);
			})}
		</FolderCheckBox>
	);
};
