import { TextDocument } from '@hooks/api/useGetDocuments';
import { supabase } from '@utils/supabase';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import { CustomCitation } from 'types/literatureReference.type';

const updateCustomCitation = async (input: {
	docId: string;
	citation: CustomCitation;
}) => {
	const { data } = await supabase
		.from('uploads')
		.update({ custom_citation: input.citation })
		.eq('id', input.docId)
		.single();

	return data as TextDocument;
};

const useUpdateCustomCitation = (options?: { onSuccessCb?: () => void }) => {
	const queryClient = useQueryClient();
	return useMutation(updateCustomCitation, {
		mutationKey: 'update-custom-citation',
		onSuccess: data => {
			options?.onSuccessCb?.();
			toast.success('Custom citation updated successfully!');
			// queryClient.invalidateQueries(['get-documents']);
			queryClient.invalidateQueries(['get-user-uploads']);
		},
		onError: error => {
			console.log({ error });
			//TODO: need to show a more clearer message
			toast.error('There is something wrong. Please try again.');
		},
	});
};

export default useUpdateCustomCitation;
