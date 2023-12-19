import { TextDocument } from '@hooks/api/useGetDocuments';
import { supabase } from '@utils/supabase';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from 'react-query';

// Resources
export const getDocumentById = async ({
	documentId,
}: {
	documentId: string;
}) => {
	const { data } = await supabase
		.from('documents')
		.select(`text, title, id, projectId`)
		.eq('id', documentId)
		.single();
	return data as TextDocument;
};

export const useGetDocumentById = (documentId: string) => {
	return useQuery(
		['get-document', documentId],
		() => getDocumentById({ documentId }),
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
