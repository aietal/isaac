import { supabase } from '@utils/supabase';

import { useUser } from '@context/user';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';

export const deleteZoteroToken = async (userId: string) => {
	const { error, status } = await supabase
		.from('user_integrations')
		.update([
			{
				zotero: null,
			},
		])
		.eq('id', userId);

	return { error, status };
};

const useRevokeZoteroToken = (params?: { onSuccessCb?: () => void }) => {
	const { user } = useUser();
	const queryClient = useQueryClient();

	return useMutation(
		() => {
			return deleteZoteroToken(user?.id);
		},
		{
			onSuccess: async data => {
				queryClient.invalidateQueries(['get-user-integration']);
				params?.onSuccessCb?.();
				toast.success('Zotero Integration Revoked');
			},
			onError: error => {
				console.log({ error });
			},
		},
	);
};

export default useRevokeZoteroToken;
