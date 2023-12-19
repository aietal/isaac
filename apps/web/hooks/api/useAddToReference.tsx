import { supabase } from '@utils/supabase';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';

type ReferencePayload = {
	title: string;
	authors: { name: string; authorId: string }[];
	year: number;
	doi: string;
	type?: string;
	sourceId?: string;
	source?: string;
	url?: string;
	tldr?: string;
	abstract?: string;
	pdf?: string;
};

const addReference = async ({
	papers,
	projectId,
}: {
	papers: ReferencePayload[];
	projectId: string;
}) => {
	const { data } = await supabase.from('references').insert(
		papers.map(paper => ({
			...paper,
			projectId,
		})),
	);
	return data;
};

const useAddReference = (options?: {
	onSuccess?: () => void;
	onMutate?: () => void;
}) => {
	const queryClient = useQueryClient();

	return useMutation(addReference, {
		mutationKey: 'add-reference',
		onMutate: options?.onMutate,
		onSuccess: () => {
			queryClient.invalidateQueries(['get-reference']);
			toast.success('Added to References!');
			options?.onSuccess?.();
		},
		onError: error => {
			console.log({ error });
			//TODO: need to show a more clearer message
			toast.error('There is something wrong. Please try again.');
		},
	});
};

export default useAddReference;
