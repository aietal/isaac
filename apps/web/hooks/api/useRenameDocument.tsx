import { TextDocument } from '@hooks/api/useGetDocuments';
import useDocumentTabs from '@hooks/useDocumentTabs';
import { supabase } from '@utils/supabase';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from 'react-query';

const renameDocument = async ({
	docId,
	newTitle,
}: {
	docId: string;
	newTitle: string;
}) => {
	const { data } = await supabase
		.from('documents')
		.update({ title: newTitle })
		.eq('id', docId)
		.single();

	return data as TextDocument;
};

const useRenameDocument = ({ onSuccessCb }: { onSuccessCb: () => void }) => {
	const queryClient = useQueryClient();
	const { renameTab, activeDocument } = useDocumentTabs();
	return useMutation(renameDocument, {
		mutationKey: 'rename-document',
		onSuccess: data => {
			onSuccessCb();
			toast.success('Document renamed successfully!');
			queryClient.invalidateQueries(['get-documents']);
			queryClient.invalidateQueries(['get-document']);

			// Close tab if opened
			if (
				activeDocument.type === 'Document' &&
				activeDocument.source === data.id
			) {
				renameTab(data.id, data.title);
			}
		},
		onError: error => {
			console.log({ error });
			//TODO: need to show a more clearer message
			toast.error('There is something wrong. Please try again.');
		},
	});
};

export default useRenameDocument;
