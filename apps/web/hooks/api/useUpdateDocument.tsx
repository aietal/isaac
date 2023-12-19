import { supabase } from '@utils/supabase';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import { useDebouncedCallback } from 'use-debounce';

export type DocumentUpdatePayload = {
	id: string;
	editorStateStr: string;
	debug?: {
		text: string;
		title: string;
	};
};

export const updateDocument = async (document: DocumentUpdatePayload) => {
	// For debugging
	// console.log(`${document.debug.title} updating: `, document.debug?.text);

	const { data } = await supabase
		.from('documents')
		.update({ text: document.editorStateStr })
		.eq('id', document.id);

	// console.log(`${document.debug.title} updated: `, document.debug?.text);
	return data;
};

const useUpdateDocument = () => {
	const queryClient = useQueryClient();
	const mutate = useMutation(updateDocument, {
		mutationKey: 'update-document',
		onError: error => {
			console.log({ error });
			//TODO: need to show a more clearer message
			toast.error(
				'Unable to save document. Please back up your work and contact us if this issue persists.',
			);
		},
		onMutate: data => {
			//
		},
		onSuccess: (data, input) => {
			queryClient.invalidateQueries(['get-document', input.id]);
		},
	});

	return useDebouncedCallback(mutate.mutateAsync, 1000);
};

export default useUpdateDocument;
