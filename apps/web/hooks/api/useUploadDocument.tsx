import {
	ProPlanUpgradeToast,
	reachedStorageLimitToastStyle,
} from '@components/toast/ProPlanUpgradToast';
import {
	ReferenceSection,
	useLiteratureReferenceStore,
} from '@context/literatureReference.store';
import { useUser } from '@context/user';
import { QKUploadStorageUsage } from '@hooks/api/useFreeTierLimit.get';
import { getUserStorageSize } from '@resources/user';
import { supabase } from '@utils/supabase';
import { freePlanLimits } from 'data/pricingPlans';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';

type Options = {
	onSuccess?: () => void;
};

async function createAndUpload({
	file,
	user,
	projectId,
	setOpenEditCitationModal,
}) {
	const fileName = file.name;
	const fileExtension = fileName.split('.').pop().toLowerCase();
	const supportedExtensions = new Set([
		'docx',
		'doc',
		'odt',
		'pptx',
		'ppt',
		'xlsx',
		'csv',
		'tsv',
		'eml',
		'msg',
		'rtf',
		'epub',
		'html',
		'xml',
		'pdf',
		'png',
		'jpg',
		'jpeg',
	]);

	if (!supportedExtensions.has(fileExtension)) {
		return { fileName, error: `File type ${fileExtension} not supported` };
	}

	const sizeInMB = file.size / 1024 ** 2;

	if (sizeInMB > 100) {
		return { fileName, error: `${fileName} is too large` };
	}

	const { data: uploadData, error: createUploadError } = await supabase
		.from('uploads')
		.insert({
			user_id: user?.id,
			file_name: fileName,
			project_id: projectId,
		})
		.single();

	if (createUploadError) {
		return { fileName, error: `Uploading ${fileName} failed` };
	}

	const { error: uploadError } = await supabase.storage
		.from('user-uploads')
		.upload(`/${user?.id}/${uploadData.id}`, file);

	if (uploadError) {
		return { fileName, error: `Uploading ${uploadData.id} failed` };
	}

	// check supabase every 2 seconds to see if the isAutoImport is true
	const waitForAutoImport = async () => {
		const { data: newRecord, error } = await supabase
			.from('uploads')
			.select('*')
			.eq('id', uploadData.id)
			.single();
		if (error) {
			console.error(error);
			return false;
		}
		if (newRecord.custom_citation !== null) {
			setOpenEditCitationModal({
				uploadId: newRecord.id,
				fileName: newRecord.file_name,
			});
			const currCitation = newRecord.custom_citation;
			currCitation.isAutoImport = false;
			supabase.from('uploads').update({ custom_citation: currCitation });
			return true;
		}
		return false;
	};

	for (let i = 0; i < 10; i++) {
		if (i === 9) {
			setOpenEditCitationModal({
				uploadId: uploadData.id,
				fileName: uploadData.file_name,
			});
			break;
		}
		if (await waitForAutoImport()) {
			break;
		}
		await new Promise(resolve => setTimeout(resolve, 2000));
	}

	return { fileName, uploadID: uploadData.id };
}

const useUploadDocument = (projectId: string, options?: Options) => {
	const [isUploading, setIsUploading] = useState(false);
	const queryClient = useQueryClient();
	const setOpenEditCitationModal = useLiteratureReferenceStore(
		s => s.setShowUploadMetaModal,
	);
	const setReferenceSection = useLiteratureReferenceStore(
		s => s.setReferenceSection,
	);
	const { user } = useUser();

	async function uploadFiles(files: FileList) {
		// Validate if user has used max storage
		if (user?.is_subscribed === false) {
			const storageUsage = await getUserStorageSize(user?.id);
			if (storageUsage >= freePlanLimits.uploadStorage) {
				toast.error(<ProPlanUpgradeToast target="storage" />, {
					style: reachedStorageLimitToastStyle,
				});
				return;
			}
		}

		setIsUploading(true);

		if (!files.length || !user) {
			toast.error('No files selected');
			return;
		}

		// Trigger loading toast
		setIsUploading(true);
		setReferenceSection(ReferenceSection.SAVED_REFERENCES);
		toast.loading('Uploading files...', { id: 'upload-file' });

		const uploads = await Promise.allSettled(
			[...files].map(file =>
				createAndUpload({ file, user, projectId, setOpenEditCitationModal }),
			),
		);

		setIsUploading(false);
		options?.onSuccess?.();

		for (const upload of uploads) {
			if (upload.status === 'rejected') {
				toast.error(`${upload.status}`, { id: 'upload-file' });
			} else {
				if (upload.value.error) {
					toast.error(`${upload.value.error}`, { id: 'upload-file' });
				} else {
					toast.success(` ${upload.value.fileName} uploaded`, {
						id: 'upload-file',
					});
					queryClient.invalidateQueries([
						'get-user-uploads',
						user.id,
						projectId,
					]);
					queryClient.invalidateQueries([QKUploadStorageUsage]);
				}
			}
		}

		setIsUploading(false);
		options?.onSuccess?.();
	}

	return { uploadFiles, isUploading };
};

export default useUploadDocument;
