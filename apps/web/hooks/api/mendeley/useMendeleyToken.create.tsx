import { useUser } from '@context/user';
import {
	createMendeleyToken,
	saveMendeleyToken,
} from '@resources/integration/mendeley';
import { useMutation, useQueryClient } from 'react-query';
import { MendeleyToken } from 'types/integration';

const useCreateMendeleyToken = (params?: { onSuccessCb?: () => void }) => {
	const { user } = useUser();
	const queryClient = useQueryClient();
	return useMutation(
		(authorizationCode: string) => {
			return createMendeleyToken(authorizationCode);
		},
		{
			onSuccess: async data => {
				if (data.status === 200 || data.status === 201) {
					const { status } = await saveMendeleyToken(user?.id, data.data);
					if (status === 200) {
						queryClient.invalidateQueries(['get-user-integration']);
					}
				}
				params?.onSuccessCb?.();
			},
			onError: error => {
				console.log({ error });
			},
		},
	);
};

export default useCreateMendeleyToken;
