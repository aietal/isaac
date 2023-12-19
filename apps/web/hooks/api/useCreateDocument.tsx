import { useUser } from '@context/user';
import { TextDocument } from '@hooks/api/useGetDocuments';
import { supabase } from '@utils/supabase';
import mixpanel from 'mixpanel-browser';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from 'react-query';

const createDocument = async ({
	projectId,
	userId,
	docTitle,
}: {
	projectId: string;
	userId: string;
	docTitle?: string;
}) => {
	const { data } = await supabase
		.from('documents')
		.insert([
			{
				type: 'text_document',
				projectId: projectId,
				title: docTitle || 'Main Document',
				userId: userId,
			},
		])
		.single();

	return data;
};

const useCreateDocument = (params?: {
	onSuccessCb?: (document: TextDocument) => void;
}) => {
	const { user } = useUser();
	const queryClient = useQueryClient();
	return useMutation(
		(payload: { projectId: string; docTitle: string }) =>
			createDocument({ ...payload, userId: user?.id }),
		{
			mutationKey: 'create-document',
			onMutate: () => {
				mixpanel.track('Created Document');
			},
			onSuccess: document => {
				if (params?.onSuccessCb) {
					params.onSuccessCb(document);
				}

				toast.success('Document created successfully!');
				queryClient.invalidateQueries(['get-documents']);
			},
			onError: error => {
				console.log({ error });
				toast.error('There is something wrong. Please try again.');
			},
		},
	);
};

export default useCreateDocument;
