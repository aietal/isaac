import { supabase } from '@utils/supabase';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import { ChatMessageV2 } from 'types/chat';

export const retrieveChatMessages = async (sessionId: string) => {
	const { data } = await supabase
		.from('chat_messages')
		.select('*')
		.filter('session_id', 'eq', sessionId)
		.order('created_at', { ascending: true });

	return data as ChatMessageV2[];
};

// NOT USED
export const useRetrieveChatMessages = (sessionId?: string) => {
	return useQuery(
		['get-chat-messages', sessionId],
		() => retrieveChatMessages(sessionId),
		{
			enabled: !!sessionId,
			onError: error => {
				console.log({ error });
				//TODO: need to show a more clearer message
				toast.error('There is something wrong. Please try again.');
			},
		},
	);
};
