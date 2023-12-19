import toast from 'react-hot-toast';
import { useQuery } from 'react-query';

// Resources

export const getChatMessagesByUserIdAndProjectId = async ({
	userId,
	projectId,
	limit = 50,
	offset = 0,
	searchInputValue = '',
}: {
	userId: string;
	projectId: string;
	limit?: number;
	offset?: number;
	searchInputValue?: string;
}) => {
	const response = await fetch(
		`/api/fetch-chat-messages?user_id=${userId}&project_id=${projectId}&limit=${limit}&offset=${offset}&search=${searchInputValue}`,
	);
	const _data = await response.json();
	const data = _data.map(i => {
		return {
			...i,
			metadata: {
				...i.metadata,
				sources: i.metadata.sources
					? JSON.parse(i.metadata?.sources)
					: undefined,
				footnotes: i.metadata.footnotes
					? JSON.parse(i.metadata?.footnotes)
					: undefined,
			},
		};
	});

	return data ?? [];
};

// hook

export const useGetChatMessagesByUserIdAndProjectId = (
	userId: string,
	projectId: string,
) => {
	return useQuery(
		['get-chat-messages', userId, projectId],
		() => getChatMessagesByUserIdAndProjectId({ userId, projectId }),
		{
			enabled: !!userId && !!projectId,
			onError: error => {
				console.log({ error });
				toast.error('There is something wrong. Please try again.');
			},
		},
	);
};
