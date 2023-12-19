import { supabase } from '@utils/supabase';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from 'react-query';

const updateProjectEmoji = async ({
	projectId,
	newEmoji,
}: {
	projectId: string;
	newEmoji: string;
}) => {
	const { data } = await supabase
		.from('projects')
		.update({ emoji: newEmoji })
		.eq('id', projectId);

	return data;
};

export const useUpdateProjectEmoji = (opts?: { onSuccessCb?: () => void }) => {
	const queryClient = useQueryClient();
	return useMutation(updateProjectEmoji, {
		mutationKey: 'rename-project',
		onSuccess: () => {
			opts?.onSuccessCb?.();
			queryClient.invalidateQueries(['get-projects']);
			//TODO: need to close model
		},
		onError: error => {
			console.log({ error });
			//TODO: need to show a more clearer message
			toast.error('There is something wrong. Please try again.');
		},
	});
};

export default useUpdateProjectEmoji;
