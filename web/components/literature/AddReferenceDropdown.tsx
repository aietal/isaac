import { Button } from '@components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import {
	ReferenceSection,
	useLiteratureReferenceStore,
} from '@context/literatureReference.store';
import { useUser } from '@context/user';
import useUploadDocument from '@hooks/api/useUploadDocument';
import { useGetUserIntegration } from '@hooks/api/useUserIntegration.get';
import useGetEditorRouter from '@hooks/useGetEditorRouter';
import { getMendeleyUserAuthorizationUrl } from '@resources/integration/mendeley';
import { BookmarkPlus, FileUp, FolderInput } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

type Props = {
	displayAsButtons?: boolean;
};

const AddReferenceDropdown = ({ displayAsButtons }: Props) => {
	const { data: userIntegration } = useGetUserIntegration();
	const { projectId } = useGetEditorRouter();
	// const { isOpen: tutorialMode, setCurrentStep } = useTour();
	const { user } = useUser();

	const setShowMendeleyModal = useLiteratureReferenceStore(
		s => s.setShowMendeleyModal,
	);
	const setShowZoteroModal = useLiteratureReferenceStore(
		s => s.setShowZoteroModal,
	);

	const [isOpen, setIsOpen] = useState(false);

	const setReferenceSection = useLiteratureReferenceStore(
		s => s.setReferenceSection,
	);

	const { uploadFiles, isUploading } = useUploadDocument(projectId, {
		onSuccess: () => {
			setReferenceSection(ReferenceSection.SAVED_REFERENCES);
			// setRefSubSection(ReferenceSourceFilter.UPLOADED); // TODO: handle this
		},
	});

	const handleUploadOptionClick: React.ChangeEventHandler<
		HTMLInputElement
	> = async e => {
		await uploadFiles(e.target.files);
		setIsOpen(false);
	};

	const handleMendeleyImportClick = () => {
		if (userIntegration?.mendeley?.access_token) {
			// Open Modal
			setShowMendeleyModal(true);
		} else {
			toast.loading('Setting up Mendeley integration');
			setTimeout(() => {
				getMendeleyUserAuthorizationUrl(projectId);
			}, 1000);
		}
	};

	const handleZoteroImportClick = async () => {
		if (userIntegration?.zotero) {
			setShowZoteroModal(true);
		} else {
			const userId = user.id;
			window.location.href = `/api/auth/zotero?userId=${userId}&projectId=${projectId}`;
		}
	};

	if (displayAsButtons) {
		return (
			<div className="flex gap-2">
				<Button
					variant="ghost"
					size="xs"
					disabled={isUploading}
					className="relative"
				>
					<FileUp size={18} strokeWidth={1.2} className="mr-1.5" />
					Upload
					<input
						onChange={handleUploadOptionClick}
						onClick={e => e.stopPropagation()}
						className="absolute top-0 block w-full opacity-0 cursor-pointer pin-r pin-t"
						type="file"
						name="documents[]"
						accept=".docx,.doc,.odt,.pptx,.xlsx,.csv,.tsv,.eml,.msg,.rtf,.epub,.html,.xml,.pdf,.png,.jpg"
					/>
				</Button>
				<Button variant="ghost" size="xs" onClick={handleMendeleyImportClick}>
					<FolderInput size={18} strokeWidth={1.2} className="mr-1.5" />
					Mendeley
				</Button>
				<Button variant="ghost" size="xs" onClick={handleZoteroImportClick}>
					<FolderInput size={18} strokeWidth={1.2} className="mr-1.5" />
					Zotero
				</Button>
			</div>
		);
	}

	return (
		<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
			<DropdownMenuTrigger asChild>
				<Button
					id="add-reference"
					variant="ghost"
					size="xs"
					disabled={isUploading}
				>
					<BookmarkPlus size={16} strokeWidth={1.4} className="mr-1" />
					<span>Add references</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent side="bottom" align="start">
				<DropdownMenuItem className="relative">
					<FileUp size={18} strokeWidth={1.6} className="mr-2" />
					Upload document
					<input
						onChange={handleUploadOptionClick}
						onClick={e => e.stopPropagation()}
						className="absolute top-0 block w-full opacity-0 cursor-pointer pin-r pin-t"
						type="file"
						name="documents[]"
						accept=".docx,.doc,.odt,.pptx,.xlsx,.csv,.tsv,.eml,.msg,.rtf,.epub,.html,.xml,.pdf,.png,.jpg"
					/>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={handleMendeleyImportClick}>
					<FolderInput size={18} strokeWidth={1.6} className="mr-2" />
					Mendeley Import
				</DropdownMenuItem>
				<DropdownMenuItem onClick={handleZoteroImportClick}>
					<FolderInput size={18} strokeWidth={1.6} className="mr-2" />
					Zotero Import
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default AddReferenceDropdown;
