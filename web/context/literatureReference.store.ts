import { GetLiteraturePayload } from '@resources/literature.api';
import { UploadedFile } from 'types/literatureReference.type';
import { create } from 'zustand';

type LiteratureReferenceStore = {
	userUploads: UploadedFile[];
	setUserUploads: (section: UploadedFile[]) => void;
	insertUserUpload: (updated: UploadedFile) => void;
	deleteUserUpload: (id: string) => void;
	updateUserUpload: (id: string, item: UploadedFile) => void;
	literatureSearch?: GetLiteraturePayload;
	setLiteratureSearch: (payload: GetLiteraturePayload) => void;
	referenceSection: ReferenceSection;
	setReferenceSection: (section: ReferenceSection) => void;
	literatureDOIPreview?: string;
	setLiteratureDOIPreview: (doi: string, section?: ReferenceSection) => void;
	savedReferenceDOIPreview?: string;
	setSavedReferenceDOIPreview: (
		doi: string,
		section?: ReferenceSection,
	) => void;
	showUploadMetaModal?: { uploadId: string; fileName: string };
	setShowUploadMetaModal: (show: {
		uploadId: string;
		fileName: string;
	}) => void;
	showMendeleyModal: boolean;
	setShowMendeleyModal: (open: boolean) => void;
	showZoteroModal: boolean;
	setShowZoteroModal: (open: boolean) => void;
};

export enum ReferenceSection {
	SAVED_REFERENCES = 'SAVED_REFERENCES',
	SEARCH_LITERATURE = 'SEARCH_LITERATURE',
}

export const useLiteratureReferenceStore = create<LiteratureReferenceStore>(
	(set, get) => ({
		literatureSearch: undefined,
		setLiteratureSearch: payload => {
			set({ literatureSearch: payload });
		},
		literatureDOIPreview: undefined,
		setLiteratureDOIPreview: doi => {
			set({
				literatureDOIPreview: doi,
				referenceSection: ReferenceSection.SEARCH_LITERATURE,
			});
		},
		savedReferenceDOIPreview: undefined,
		setSavedReferenceDOIPreview: doi => {
			set({
				savedReferenceDOIPreview: doi,
				referenceSection: ReferenceSection.SAVED_REFERENCES,
			});
		},
		referenceSection: ReferenceSection.SEARCH_LITERATURE,
		setReferenceSection: (section: ReferenceSection) => {
			set({ referenceSection: section });
		},
		showUploadMetaModal: undefined,
		setShowUploadMetaModal: show => {
			set({ showUploadMetaModal: show });
		},
		userUploads: [],
		setUserUploads: userUploads => {
			set({ userUploads });
		},
		insertUserUpload: newUpload => {
			const uploads = get().userUploads;
			set({ userUploads: [...uploads, newUpload] });
		},
		deleteUserUpload: id => {
			const uploads = get().userUploads;
			set({ userUploads: uploads.filter(upload => upload.id !== id) });
		},
		updateUserUpload: (id, updatedItem) => {
			const uploads = get().userUploads;
			set({
				userUploads: uploads.map(upload =>
					upload.id === id ? updatedItem : upload,
				),
			});
		},
		showMendeleyModal: false,
		setShowMendeleyModal: show => {
			set({ showMendeleyModal: show });
		},
		showZoteroModal: false,
		setShowZoteroModal: show => {
			set({ showZoteroModal: show });
		},
	}),
);
