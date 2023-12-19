import { useUser } from '@context/user';
import { useGetUserIntegration } from '@hooks/api/useUserIntegration.get';
import { getZoteroDocuments } from '@resources/integration/zotero';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';

export const useGetZoteroDocuments = (folderId: string) => {
	const { data } = useGetUserIntegration();
	const zoteroAccessObj = data?.zotero;

	return useQuery(
		['get-zotero-documents', folderId],
		() => getZoteroDocuments({ folderId, ...zoteroAccessObj }),
		{
			enabled: !!zoteroAccessObj && !!folderId,
			onError: error => {
				console.log({ error });
				//TODO: need to show a more clearer message
				toast.error('There is something wrong. Please try again.');
			},
		},
	);
};
