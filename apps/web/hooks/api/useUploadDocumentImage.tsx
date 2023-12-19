import { supabase } from '@utils/supabase';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useUser } from '@context/user';
import toast from 'react-hot-toast';

type Options = {
	onSuccess?: () => void;
};

async function createAndUpload({
	file,
	userId,
}: {
	file: File;
	userId: string;
}) {
	const bucket = supabase.storage.from('document-image');
	const fileName = `${uuidv4()}-${file.name}`;
	const sizeInMB = file.size / 1024 / 1024;
	if (sizeInMB > 100) {
		return { fileName, error: `Too Large File: ${fileName}` };
	}

	const { error } = await bucket.upload(`/${userId}/${fileName}`, file, {
		cacheControl: '3600',
		upsert: false,
	});

	if (error) {
		return { fileName, error: `Uploading ${fileName} failed` };
	}

	const { data } = await bucket.createSignedUrl(
		`${userId}/${fileName}`,
		60 * 60,
	);
	return { fileName, filePath: data.signedURL };
}

const useUploadDocumentImage = (options?: Options) => {
	const [isUploading, setIsUploading] = useState(false);
	const { user } = useUser();

	async function uploadFile(file: File) {
		setIsUploading(true);

		if (!user) return;

		const upload = await createAndUpload({ file, userId: user?.id });

		if (upload.error) {
			toast.error(`Uploading ${upload.fileName} failed. Please try again`);
		}

		setIsUploading(false);
		options?.onSuccess?.();
		return upload.filePath;
	}

	return { uploadFile, isUploading };
};

export default useUploadDocumentImage;
