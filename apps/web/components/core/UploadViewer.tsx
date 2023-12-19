import { User } from '@supabase/supabase-js';
import { supabase } from '@utils/supabase';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

export const PDFViewer = dynamic(() => import('./PDF'), {
	ssr: false,
});

const UPLOAD_LIFE_TIME_SECONDS = 60 * 60;

const useGetSignedUrl = ({
	user,
	uploadId,
}: {
	user: User;
	uploadId: string;
}) => {
	const [signedUrl, setSignedUrl] = useState<string>(null);
	const [error, setError] = useState(null);
	const [status, setStatus] = useState('idle');

	useEffect(() => {
		if (!user) return;

		const fetchInitialData = async () => {
			setStatus('loading');
			try {
				const { data, error } = await supabase.storage
					.from('user-uploads')
					.createSignedUrl(
						`/${user?.id}/${uploadId}`,
						UPLOAD_LIFE_TIME_SECONDS,
					);

				if (error) throw error;

				setSignedUrl(data.signedURL);
				setStatus('success');
			} catch (error) {
				setError(error);
				setStatus('error');
				console.error(error);
			}
		};

		fetchInitialData();
	}, [user, uploadId]);

	return {
		data: signedUrl,
		error,
		status,
	};
};

export function UploadViewer({ uploadId }: { uploadId: string }) {
	const user = supabase.auth.user();

	const { data: signedUrl } = useGetSignedUrl({ user, uploadId });

	if (!signedUrl) return null;

	return <PDFViewer path={signedUrl} />;
}
