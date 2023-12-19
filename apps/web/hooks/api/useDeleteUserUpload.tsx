import { QKUploadStorageUsage } from '@hooks/api/useFreeTierLimit.get';
import { ProjectTabs } from '@hooks/useDocumentTabs';
import useGetEditorRouter from '@hooks/useGetEditorRouter';
import { supabase } from '@utils/supabase';
import { toast } from 'react-hot-toast';
import { useQueryClient } from 'react-query';

// TODO: Close document if tab is opened
const useDeleteUserUpload = () => {
	const queryClient = useQueryClient();
	const { projectId: activeProjectId } = useGetEditorRouter();

	const deleteUpload = async (id: string, userId: string) => {
		const openTabs = JSON.parse(
			localStorage.getItem('PROJECT_TABS'),
		) as ProjectTabs;

		const projectId = window.location.pathname.split('/')[2];
		const currentProjectTabs = openTabs?.[projectId];
		const updatedTabs = currentProjectTabs?.filter(tab => tab.source !== id);
		openTabs[projectId] = updatedTabs;
		localStorage.setItem('PROJECT_TABS', JSON.stringify(openTabs));

		const promises = [
			supabase.from('uploads').delete().eq('id', id),
			supabase.storage.from('user-uploads').remove([`${userId}/${id}`]),
		];
		try {
			await Promise.all(promises);
			queryClient.invalidateQueries([
				'get-user-uploads',
				userId,
				activeProjectId,
			]);
			queryClient.invalidateQueries([QKUploadStorageUsage]);

			toast.success('Document deleted');
		} catch (error) {
			console.error('Delete failed:', error);
			toast.error('Delete failed');
		}
	};

	return { deleteUpload };
};

export default useDeleteUserUpload;
