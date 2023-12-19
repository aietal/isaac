import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function isValidHttpUrl(maybeUrl: string) {
	try {
		const newUrl = new URL(maybeUrl);
		return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
	} catch (err) {
		return false;
	}
}

type RemoteUrlState = string | null;

const useRemoteUrlParam = (): RemoteUrlState => {
	const router = useRouter();
	const [remoteUrl, setRemoteUrl] = useState<RemoteUrlState>(null);

	useEffect(() => {
		const { query = {} } = router;
		const { url: remoteUrl } = query;

		if (remoteUrl) {
			setRemoteUrl(decodeURI(remoteUrl as string));
		} else {
			setRemoteUrl(null);
		}
	}, [router]);

	return remoteUrl && isValidHttpUrl(remoteUrl) ? remoteUrl : null;
};

export default useRemoteUrlParam;
