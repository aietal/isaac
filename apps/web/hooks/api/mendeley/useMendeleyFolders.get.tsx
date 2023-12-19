import { getMendeleyFolders } from '@resources/integration/mendeley';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';

export const useGetMendeleyFolders = (token?: string) => {
	return useQuery(['get-mendeley-folders'], () => getMendeleyFolders(token), {
		enabled: !!token,

		onError: error => {
			console.log({ error });
			//TODO: need to show a more clearer message
			toast.error('There is something wrong. Please try again.');
		},
	});
};
