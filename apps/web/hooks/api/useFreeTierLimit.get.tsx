import { useUser } from '@context/user';
import { getUserStorageSize } from '@resources/user';
import { supabase } from '@utils/supabase';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';

export const QKFreeAIToken = 'get-free-ai-token';
export const QKUploadStorageUsage = 'get';

export const getUserDailyFreeToken = async (userId: string) => {
	const { data: user } = await supabase
		.from('profile')
		.select('daily_free_token')
		.eq('id', userId)
		.single();

	return user?.daily_free_token as number;
};

export const useGetFreeTokenUsage = () => {
	const { user } = useUser();
	return useQuery(
		[QKFreeAIToken, user?.id],
		() => getUserDailyFreeToken(user?.id),
		{
			enabled: !!user?.id && user?.is_subscribed === false,
			onError: error => {
				console.log({ error });
				//TODO: need to show a more clearer message
				toast.error('There is something wrong. Please try again.');
			},
		},
	);
};

export const useGetUploadStorageUsage = () => {
	const { user } = useUser();
	return useQuery([QKUploadStorageUsage], () => getUserStorageSize(user?.id), {
		enabled: !!user?.id && user?.is_subscribed === false,
		onError: error => {
			console.log({ error });
			//TODO: need to show a more clearer message
			toast.error('There is something wrong. Please try again.');
		},
	});
};
