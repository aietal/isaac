import { supabase } from '@utils/supabase';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from 'react-query';

// types
type User = {
	id: string;
};

// Resources
export const getMessages = async ({
	user,
	projectId,
}: {
	user: User;
	projectId: string;
}) => {
	const { data } = await supabase
		.from('isaac_messages')
		.select(`content, type, id`)
		.eq('userId', user?.id)
		.eq('projectId', projectId);
	return data;
};

// Hooks
export const useGetMessages = (user: User, projectId: string) => {
	const queryInfo = useQuery(
		['get-messages', user, projectId],
		() => getMessages({ user, projectId }),
		{
			enabled: !!user,
			onError: error => {
				console.log({ error });
				//TODO: need to show a more clearer message
				toast.error('There is something wrong. Please try again.');
			},
		},
	);

	return queryInfo; // return entire queryInfo, including refetch function
};
