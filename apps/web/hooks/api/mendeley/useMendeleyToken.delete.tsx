import { useUser } from '@context/user';
import { deleteMendeleyToken } from '@resources/integration/mendeley';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';

const useRevokeMendeleyToken = (params?: { onSuccessCb?: () => void }) => {
	const { user } = useUser();
	const queryClient = useQueryClient();

	return useMutation(
		() => {
			return deleteMendeleyToken(user.id);
		},
		{
			onSuccess: async data => {
				queryClient.invalidateQueries(['get-user-integration']);
				params?.onSuccessCb?.();
				toast.success('Mendeley Integration Revoked');
			},
			onError: error => {
				console.log({ error });
			},
		},
	);
};

export default useRevokeMendeleyToken;
