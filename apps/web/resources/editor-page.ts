import { supabase } from '@utils/supabase';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
	Author,
	ReferenceLiterature,
	UploadedFile,
} from 'types/literatureReference.type';
import { Project } from 'types/project';

// types
type User = {
	id: string;
};

type DocumentPayload = {
	id: string;
	content: string;
};

// Resources
export const getDocuments = async ({ user }: { user: User }) => {
	const { data } = await supabase
		.from('documents')
		.select(`text, title, id, projectId`)
		.eq('userId', user?.id);
	return data;
};

export const getProjects = async ({ user }: { user: User }) => {
	const { data } = await supabase
		.from('projects')
		.select()
		.filter('userId', 'eq', user?.id);
	return data as Project[];
};

export const createProject = async ({
	projectTitle,
	user,
}: {
	projectTitle: string;
	user: User;
}) => {
	const { data } = await supabase.from('projects').insert([
		{
			title: projectTitle,
			userId: user?.id,
		},
	]);

	return data;
};

export const createDocument = async ({
	projectId,
	user,
	docTitle,
}: {
	projectId: string;
	user: User;
	docTitle?: string;
}) => {
	const { data } = await supabase.from('documents').insert([
		{
			type: 'text_document',
			projectId: projectId,
			title: docTitle || 'Main Document',
			userId: user?.id,
		},
	]);

	return data;
};

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
		.eq('id', docId);

	return data;
};

const deleteDocument = async (docId: string) => {
	const { data } = await supabase.from('documents').delete().eq('id', docId);

	return data;
};

export const updateDocument = async (document: DocumentPayload) => {
	const { data } = await supabase
		.from('documents')
		.update({ text: document.content })
		.eq('id', document?.id);
	return data;
};

const renameProject = async ({
	projectId,
	newTitle,
}: {
	projectId: string;
	newTitle: string;
}) => {
	const { data } = await supabase
		.from('projects')
		.update({ title: newTitle })
		.eq('id', projectId);

	return data;
};

const getReference = async (projectId: string) => {
	const { data } = await supabase
		.from('references')
		.select('*')
		.filter('projectId', 'eq', projectId);

	return data as ReferenceLiterature[];
};

const deleteReference = async id => {
	const { data } = await supabase.from('references').delete().eq('id', id);
	return data;
};

const getUserUploads = async (userId: string, projectId: string) => {
	const { data } = await supabase
		.from('uploads')
		.select('id, status, citation, file_name, created_at, custom_citation')
		.eq('user_id', userId)
		.eq('project_id', projectId)
		.order('created_at', { ascending: false });
	return data as UploadedFile[];
};

// Hooks
export const useGetDocuments = (user: User) => {
	return useQuery(['get-documents', user], () => getDocuments({ user }), {
		enabled: !!user,
		onError: error => {
			console.log({ error });
			//TODO: need to show a more clearer message
			toast.error('There is something wrong. Please try again.');
		},
	});
};

export const useGetProjects = (user: User) => {
	return useQuery(['get-projects', user], () => getProjects({ user }), {
		enabled: !!user,
		onError: error => {
			console.log({ error });
			//TODO: need to show a more clearer message
			toast.error('There is something wrong. Please try again.');
		},
	});
};

export const useCreateProject = ({
	onSuccessCb,
}: {
	onSuccessCb: (project: any[]) => void;
}) => {
	const queryClient = useQueryClient();
	return useMutation(createProject, {
		mutationKey: 'create-project',
		onSuccess: project => {
			onSuccessCb(project);
			toast.success('Project created successfully!');
			queryClient.invalidateQueries(['get-projects']);
		},
		onError: error => {
			console.log({ error });
			//TODO: need to show a more clearer message
			toast.error('There is something wrong. Please try again.');
		},
	});
};

export const useCreateDocument = (params?: {
	onSuccessCb?: (document: any[]) => void;
}) => {
	const queryClient = useQueryClient();
	return useMutation(createDocument, {
		mutationKey: 'create-document',
		onSuccess: document => {
			if (params?.onSuccessCb) {
				params.onSuccessCb(document);
			}

			toast.success('Document created successfully!');
			queryClient.invalidateQueries(['get-documents']);
			//TODO: need to close model
		},
		onError: error => {
			console.log({ error });
			//TODO: need to show a more clearer message
			toast.error('There is something wrong. Please try again.');
		},
	});
};

export const useRenameDocument = ({
	onSuccessCb,
}: {
	onSuccessCb: () => void;
}) => {
	const queryClient = useQueryClient();
	return useMutation(renameDocument, {
		mutationKey: 'rename-document',
		onSuccess: () => {
			onSuccessCb();
			toast.success('Document renamed successfully!');
			queryClient.invalidateQueries(['get-documents']);
			queryClient.invalidateQueries(['get-document']);
			//TODO: need to close model
		},
		onError: error => {
			console.log({ error });
			//TODO: need to show a more clearer message
			toast.error('There is something wrong. Please try again.');
		},
	});
};

export const useDeleteDocument = () => {
	const queryClient = useQueryClient();
	return useMutation(deleteDocument, {
		mutationKey: 'delete-document',
		onSuccess: () => {
			toast.success('Document deleted successfully!');
			queryClient.invalidateQueries(['get-documents']);
			//TODO: need to close model
		},
		onError: error => {
			console.log({ error });
			//TODO: need to show a more clearer message
			toast.error('There is something wrong. Please try again.');
		},
	});
};

export const useRenameProject = ({
	onSuccessCb,
}: {
	onSuccessCb: () => void;
}) => {
	const queryClient = useQueryClient();
	return useMutation(renameProject, {
		mutationKey: 'rename-project',
		onSuccess: () => {
			onSuccessCb();
			toast.success('Project renamed successfully!');
			queryClient.invalidateQueries(['get-projects']);
			//TODO: need to close model
		},
		onError: error => {
			console.log({ error });
			//TODO: need to show a more clearer message
			toast.error('There is something wrong. Please try again.');
		},
	});
};

export const useUpdateDocument = () => {
	const queryClient = useQueryClient();
	return useMutation(updateDocument, {
		mutationKey: 'update-document',
		onMutate: data => {
			queryClient.cancelQueries({
				queryKey: ['get-documents', 'get-document'],
			});
		},
		onSuccess: data => {
			queryClient.invalidateQueries(['get-documents']);
			queryClient.invalidateQueries(['get-document']);
		},
		onError: error => {
			console.log({ error });
			//TODO: need to show a more clearer message
			toast.error('There is something wrong. Please try again.');
		},
	});
};

export const useGetReference = (
	projectId: string,
	options?: { onSuccess?: (data: ReferenceLiterature[]) => void } | undefined,
) => {
	return useQuery(['get-reference', projectId], () => getReference(projectId), {
		enabled: !!projectId,
		onSuccess: options?.onSuccess,
		onError: error => {
			console.log({ error });
			//TODO: need to show a more clearer message
			toast.error('There is something wrong. Please try again.');
		},
	});
};

export const useGetUserUploads = (
	userId: string,
	projectId: string,
	options?: { onSuccess?: (data: UploadedFile[]) => void } | undefined,
) => {
	return useQuery(
		['get-user-uploads', userId, projectId],
		() => getUserUploads(userId, projectId),
		{
			enabled: !!userId && !!projectId,
			onSuccess: options?.onSuccess,
			onError: error => {
				console.log({ error });
				//TODO: need to show a more clearer message
				toast.error('There is something wrong. Please try again.');
			},
		},
	);
};

export const useDeleteReference = () => {
	const queryClient = useQueryClient();
	return useMutation(deleteReference, {
		mutationKey: 'delete-reference',
		onSuccess: () => {
			queryClient.invalidateQueries(['get-reference']);
			toast.success('Reference removed');
		},
		onError: error => {
			console.log({ error });
			//TODO: need to show a more clearer message
			toast.error('There is something wrong. Please try again.');
		},
	});
};
