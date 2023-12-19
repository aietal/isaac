import { TextDocument } from '@hooks/api/useGetDocuments';
import useDocumentTabs from '@hooks/useDocumentTabs';
import { supabase } from '@utils/supabase';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from 'react-query';

const deleteDocument = async (docId: string) => {
	const { data } = await supabase
		.from('documents')
		.delete()
		.eq('id', docId)
		.single();

	return data;
};

const useDeleteDocument = () => {
	const queryClient = useQueryClient();
	const { closeTab } = useDocumentTabs();
	return useMutation(deleteDocument, {
		mutationKey: 'delete-document',
		onSuccess: (data: TextDocument) => {
			toast.success('Document deleted successfully!');

			// Close tab if opened
			closeTab(data.id, data.projectId);

			queryClient.invalidateQueries(['get-documents']);
		},
		onError: error => {
			console.log({ error });
			toast.error('There is something wrong. Please try again.');
		},
	});
};

export default useDeleteDocument;
