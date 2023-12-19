import useDocumentTabs from '@hooks/useDocumentTabs';
import { supabase } from '@utils/supabase';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import { DocumentThread } from 'types/threadComments';

export const getDocumentCommentThreads = async (documentId: string) => {
	const { data } = await supabase
		.from('comments')
		.select()
		.filter('documentId', 'eq', documentId);

	return data as DocumentThread[];
};

export const useGetDocumentCommentThreads = (_documentId?: string) => {
	const { activeDocument } = useDocumentTabs();
	const documentId = _documentId || activeDocument?.source;

	return useQuery(
		['get-thread-comment', documentId],
		() => getDocumentCommentThreads(documentId),
		{
			enabled: !!documentId,
			onError: error => {
				console.log({ error });
				//TODO: need to show a more clearer message
				toast.error('There is something wrong. Please try again.');
			},
		},
	);
};
