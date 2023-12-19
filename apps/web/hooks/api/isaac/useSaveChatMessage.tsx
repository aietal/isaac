import { useUser } from '@context/user';
import { supabase } from '@utils/supabase';
import mixpanel from 'mixpanel-browser';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import { ChatMessageV2, ChatSession, ChatSessionType } from 'types/chat';

const createChatMessage = async (messages: ChatMessageV2[]) => {
	const { data } = await supabase.from('chat_messages').insert(messages);

	return data;
};

const useSaveChatMessage = (params?: { onSuccessCb?: () => void }) => {
	const queryClient = useQueryClient();
	return useMutation(createChatMessage, {
		mutationKey: 'create-chat-session',
		onMutate: () => {
			mixpanel.track('Created ChatSession');
		},
		onSuccess: chatSession => {
			if (params?.onSuccessCb) {
				params.onSuccessCb();
			}

			// queryClient.invalidateQueries(['get-chat-sessions']);
		},
		onError: error => {
			console.log({ error });
			toast.error('There is something wrong. Please try again.');
		},
	});
};

export default useSaveChatMessage;
