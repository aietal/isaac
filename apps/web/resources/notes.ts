import useGetEditorRouter from '@hooks/useGetEditorRouter';
import { supabase } from '@utils/supabase';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from 'react-query';

type CreateNotePayload = {
	projectId: string;
	text: string;
};

export type Note = {
	projectId: string;
	text: string;
	id: string;
	created_at: string;
};

export const createNote = async (newNote: CreateNotePayload) => {
	const { data, error: err } = await supabase
		.from('notes')
		.insert(newNote)
		.single();
	if (err) {
		throw err;
	}

	return data as Note;
};

type Callbacks = {
	onSuccess?: (note: Note) => void;
};

export default function useCreateNote(cb?: Callbacks) {
	const { projectId } = useGetEditorRouter();
	const queryClient = useQueryClient();
	const mutationKey = 'create-note';
	return useMutation((text: string) => createNote({ text, projectId }), {
		mutationKey,
		onSuccess: note => {
			queryClient.invalidateQueries(['get-notes']);
			toast.success('Note Created!');
			cb?.onSuccess?.(note);
		},
		onError: error => {
			console.log({ error });
			//TODO: need to show a more clearer message
			toast.error('There is something wrong. Please try again.');
		},
	});
}

export const getNotes = async (projectId: string) => {
	const { data, error } = await supabase
		.from('notes')
		.select()
		.order('created_at', { ascending: false })
		.filter('projectId', 'eq', projectId);

	if (error) {
		throw error;
	}

	return data as Note[];
};

export const useGetNotes = (projectId: string) => {
	return useQuery(['get-notes', projectId], () => getNotes(projectId), {
		enabled: !!projectId,
		onError: error => {
			console.log({ error });
			//TODO: need to show a more clearer message
			toast.error('There is something wrong. Please try again.');
		},
	});
};

const deleteNote = async (noteId: string) => {
	const { data } = await supabase.from('notes').delete().eq('id', noteId);
	return data;
};

export const useDeleteNote = () => {
	const queryClient = useQueryClient();
	return useMutation(deleteNote, {
		mutationKey: 'delete-note',
		onSuccess: () => {
			toast.success('Note deleted successfully!');
			queryClient.invalidateQueries(['get-notes']);
		},
		onError: error => {
			console.log({ error });
			toast.error('There is something wrong. Please try again.');
		},
	});
};

const updateNote = async (payload: { id: string; text: string }) => {
	const { id, text } = payload;
	const { data } = await supabase.from('notes').update({ text }).eq('id', id);
	return data;
};

export const useUpdateNote = () => {
	const queryClient = useQueryClient();
	return useMutation(updateNote, {
		mutationKey: 'update-note',
		onSuccess: () => {
			queryClient.invalidateQueries(['get-notes']);
		},
		onError: error => {
			console.log({ error });
			//TODO: need to show a more clearer message
			toast.error('There is something wrong. Please try again.');
		},
	});
};
