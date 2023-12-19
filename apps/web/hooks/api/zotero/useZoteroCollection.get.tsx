import { useGetUserIntegration } from '@hooks/api/useUserIntegration.get';
import { getZoteroFolders } from '@resources/integration/zotero';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';

export const useGetZoteroCollection = () => {
	const { data } = useGetUserIntegration();
	return useQuery(['get-zotero-folders'], () => getZoteroFolders(data.zotero), {
		enabled: !!data?.zotero,
		onError: error => {
			console.log({ error });
			//TODO: need to show a more clearer message
			toast.error('There is something wrong. Please try again.');
		},
	});
};
