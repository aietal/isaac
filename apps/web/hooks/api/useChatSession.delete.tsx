import { Button } from '@components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@components/ui/dialog';
import useDocumentTabs from '@hooks/useDocumentTabs';
import { supabase } from '@utils/supabase';
import mixpanel from 'mixpanel-browser';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import { ChatSession } from 'types/chat';

const deleteChatSession = async ({ sessionId }: { sessionId: string }) => {
	const { data } = await supabase
		.from('chat_sessions')
		.delete()
		.eq('id', sessionId)
		.single();

	return data;
};

const useDeleteChatSession = (params?: {
	onSuccessCb?: (chatSession: ChatSession) => void;
}) => {
	const [showConfirmDialog, setShowConfirmDialog] = useState<{
		title: string;
		sessionId: string;
	}>();
	const { closeTab } = useDocumentTabs();
	const queryClient = useQueryClient();
	const { mutateAsync } = useMutation(deleteChatSession, {
		mutationKey: 'delete-chat-session',
		onMutate: () => {
			mixpanel.track('Deleted Chat Session');
			setShowConfirmDialog(undefined);
		},
		onSuccess: chatSession => {
			if (params?.onSuccessCb) {
				params.onSuccessCb(chatSession);
			}
			toast.success('Chat session deleted!');
			queryClient.invalidateQueries(['get-chat-sessions']);
			closeTab(chatSession.id);
		},
		onError: error => {
			console.log({ error });
			toast.error('There is something wrong. Please try again.');
		},
	});

	const deleteSession = async (sessionId: string, title: string) => {
		setShowConfirmDialog({ sessionId, title });
	};

	const DeleteConfirmationDialog = () => {
		return (
			<Dialog
				open={!!showConfirmDialog}
				onOpenChange={() => setShowConfirmDialog(undefined)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete chat session?</DialogTitle>
					</DialogHeader>
					<DialogDescription>
						<span>
							{' '}
							This will delete <strong>{showConfirmDialog?.title}</strong>
						</span>
					</DialogDescription>
					<DialogFooter>
						<Button
							variant="ghost"
							onClick={() => setShowConfirmDialog(undefined)}
						>
							Cancel
						</Button>
						<Button
							onClick={() =>
								mutateAsync({ sessionId: showConfirmDialog?.sessionId })
							}
							variant="destructive"
						>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	};

	return { deleteSession, DeleteConfirmationDialog };
};

export default useDeleteChatSession;
