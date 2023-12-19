import { TextDocument } from '@hooks/api/useGetDocuments';
import { $isMarkNode, $unwrapMarkNode } from '@lexical/mark';
import { supabase } from '@utils/supabase';
import { $getNodeByKey, LexicalEditor, LexicalNode } from 'lexical';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ThreadComment } from 'types/threadComments';

type Payload = {
	comments: ThreadComment[];
	threadId: string;
	toDeleteId: string;
};

const deleteThreadComment = async ({
	threadId,
	comments,
	toDeleteId,
}: Payload) => {
	const updatedComments = comments.filter(comment => comment.id !== toDeleteId);

	const { data } = await supabase
		.from('comments')
		.update({ comments: updatedComments })
		.eq('id', threadId)
		.single();

	return data;
};

const useDeleteThreadComment = () => {
	const queryClient = useQueryClient();
	return useMutation(deleteThreadComment, {
		mutationKey: 'delete-document',
		onSuccess: (data: TextDocument) => {
			queryClient.invalidateQueries(['get-thread-comment']);
		},
		onError: error => {
			console.log({ error });
			toast.error('There is something wrong. Please try again.');
		},
	});
};

export default useDeleteThreadComment;
