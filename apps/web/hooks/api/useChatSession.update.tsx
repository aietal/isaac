import { supabase } from '@utils/supabase';
import mixpanel from 'mixpanel-browser';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import { ChatSession } from 'types/chat';

// this just update the title atm
const updateChatSessionTitle = async ({
	sessionId,
	title,
}: {
	sessionId: string;
	title: string;
}) => {
	const { data } = await supabase
		.from('chat_sessions')
		.update([
			{
				title: title,
			},
		])
		.eq('id', sessionId)
		.single();

	return data;
};

const useUpdateChatSession = (params?: {
	onSuccessCb?: (chatSession: ChatSession) => void;
}) => {
	const queryClient = useQueryClient();
	return useMutation(updateChatSessionTitle, {
		mutationKey: 'update-chat-session',
		onMutate: () => {
			mixpanel.track('Updated ChatSession');
		},
		onSuccess: chatSession => {
			if (params?.onSuccessCb) {
				params.onSuccessCb(chatSession);
			}
			queryClient.invalidateQueries(['get-chat-sessions']);
		},
		onError: error => {
			console.log({ error });
			toast.error('There is something wrong. Please try again.');
		},
	});
};

export default useUpdateChatSession;
