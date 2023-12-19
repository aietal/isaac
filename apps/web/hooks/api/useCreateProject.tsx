import { useUser } from '@context/user';
import { Project } from '@hooks/api/useGetProjects';
import useDocumentTabs from '@hooks/useDocumentTabs';
import { useCreateDocument } from '@resources/editor-page';
import { supabase } from '@utils/supabase';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from 'react-query';

export const createProject = async ({
	projectTitle,
	userId,
}: {
	projectTitle: string;
	userId: string;
}) => {
	const { data } = await supabase
		.from('projects')
		.insert([
			{
				title: projectTitle,
				userId: userId,
			},
		])
		.single();

	return data;
};

const useCreateProject = ({
	onSuccessCb,
	createDocumentOnCreate,
}: {
	onSuccessCb?: (project: Project) => void;
	createDocumentOnCreate?: boolean;
}) => {
	const queryClient = useQueryClient();
	const { user } = useUser();
	const { addProject: addProjectToTab } = useDocumentTabs();
	const { mutateAsync: createDocument } = useCreateDocument();

	return useMutation(
		(projectTitle: string) => createProject({ projectTitle, userId: user?.id }),
		{
			mutationKey: 'create-project',
			onSuccess: async project => {
				onSuccessCb?.(project);
				toast.success('Project created successfully!');
				queryClient.invalidateQueries(['get-projects']);
				addProjectToTab(project.id);
				if (createDocumentOnCreate) {
					await createDocument({ projectId: project.id, user });
				}
			},
			onError: error => {
				console.log({ error });
				//TODO: need to show a more clearer message
				toast.error('There is something wrong. Please try again.');
			},
		},
	);
};

export default useCreateProject;
