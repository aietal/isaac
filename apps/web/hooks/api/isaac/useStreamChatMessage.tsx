import { useUser } from '@context/user';
import { QKFreeAIToken } from '@hooks/api/useFreeTierLimit.get';
import useGetEditorRouter from '@hooks/useGetEditorRouter';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import { SSE } from 'sse.js';
import { ChatContext } from 'types/chat';

const useStreamChatMessage = () => {
	const { user } = useUser();
	const { projectId } = useGetEditorRouter();
	const queryClient = useQueryClient();

	const streamChatMessage = ({
		messages,
		onComplete,
		onError,
		onStreamChunk,
		context = 'project',
		uploadId,
	}: {
		messages: { role: string; content: string }[];
		context?: ChatContext;
		uploadId?: string;
		onComplete: (response: string) => void;
		onStreamChunk: (chunk: string) => void;
		onError: (error: string) => void;
	}) => {
		const payload = JSON.stringify({
			messages,
			max_tokens: 2000,
			userId: user?.id,
			projectId,
			uploadId,
			context,
		});

		try {
			const source = new SSE('/api/chat', { payload });
			let cumulativeChunk = '';

			source.addEventListener('error', e => {
				onError(JSON.parse(e.data).error);
				source.close();
			});

			// Start Streaming
			source.addEventListener('message', async function (e) {
				const binaryString = atob(e.data);
				const eventMessage = decodeURIComponent(escape(binaryString))
				if (eventMessage === '[DONE]') {
					source.close();
					onComplete(cumulativeChunk);

					queryClient.invalidateQueries([QKFreeAIToken]);
				} else {
					console.log({ data: eventMessage });
					const chunkText = eventMessage

					if (chunkText !== undefined) {
						onStreamChunk(chunkText);
						cumulativeChunk = cumulativeChunk + chunkText;
					}
				}
			});

			source.stream();

			return { stopStreaming: source.close as () => void };
		} catch (error) {
			if (error instanceof DOMException && error.name === 'AbortError') return;
			console.log({ error });
			toast.error('Something went wrong. Please try again.');
		}
	};

	return { streamChatMessage };
};

export default useStreamChatMessage;
