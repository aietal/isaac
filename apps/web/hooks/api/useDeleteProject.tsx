import { Project } from '@hooks/api/useGetProjects';
import useDocumentTabs from '@hooks/useDocumentTabs';
import { supabase } from '@utils/supabase';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import router from 'next/router';

const deleteProject = async (projectId: string) => {
	const { data } = await supabase
		.from('projects')
		.delete()
		.eq('id', projectId)
		.single();

	return data;
};

const useDeleteProject = () => {
	const queryClient = useQueryClient();
	const { deleteProjectFromTabMemory } = useDocumentTabs();
	return useMutation(deleteProject, {
		mutationKey: 'delete-project',
		onSuccess: (projectId: string) => {
			toast.success('Project deleted.');
			queryClient.invalidateQueries(['get-projects']);
			deleteProjectFromTabMemory(projectId);
			router.push('/editor');
		},
		onError: error => {
			console.log({ error });
			toast.error('Could not delete project.');
		},
	});
};

export default useDeleteProject;
