import { useUser } from '@context/user';
import useDocumentTabs from '@hooks/useDocumentTabs';
import { supabase } from '@utils/supabase';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import { UserIntegration } from 'types/integration';

export const getUserIntegration = async (userId: string) => {
	const { data, error } = await supabase
		.from('user_integrations')
		.select('*')
		.eq('id', userId);

	if (data.length === 0) {
		return null;
	}
	return data[0] as UserIntegration;
};

export const useGetUserIntegration = () => {
	const { user } = useUser();
	const userId = user?.id;
	return useQuery(
		['get-user-integration', userId],
		() => getUserIntegration(userId),
		{
			enabled: !!userId,
			onError: error => {
				console.log({ error });
				//TODO: need to show a more clearer message
				toast.error('There is something wrong. Please try again.');
			},
		},
	);
};
