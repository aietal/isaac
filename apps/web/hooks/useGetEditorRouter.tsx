import { useRouter } from 'next/router';

// TODO: Merge this with useUploadParam, useRemoteUrlParam
const useGetEditorRouter = () => {
	const { asPath, query, push } = useRouter();
	const projectId = asPath.split('/')[2]?.split('?')[0];

	return { projectId, query, push };
};

export default useGetEditorRouter;
