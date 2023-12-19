import { useGetUserIntegration } from '@hooks/api/useUserIntegration.get';
import { getMendeleyDocuments } from '@resources/integration/mendeley';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';

export const useGetMendeleyDocuments = (folderId: string) => {
	const { data } = useGetUserIntegration();
	const token = data.mendeley.access_token;

	return useQuery(
		['get-mendeley-documents', folderId],
		() => getMendeleyDocuments({ folderId, token }),
		{
			enabled: !!token && !!folderId,
			onError: error => {
				console.log({ error });
				//TODO: need to show a more clearer message
				toast.error('There is something wrong. Please try again.');
			},
		},
	);
};
