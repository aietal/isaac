import useChatSessions from '@context/chatSessions.store';
import { useUser } from '@context/user';
import useUpdateChatSession from '@hooks/api/useChatSession.update';
import { QKFreeAIToken } from '@hooks/api/useFreeTierLimit.get';
import useDocumentTabs from '@hooks/useDocumentTabs';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import { SSE } from 'sse.js';

const useGenerateChatSessionTitle = (minimized: boolean) => {
	const [triggerRename, setTriggerRename] = useState<{
		source: string;
		newName: string;
	}>();
	const queryClient = useQueryClient();
	const { renameTab } = useDocumentTabs();
	const { mutateAsync: updateSessionTitle } = useUpdateChatSession();
	const { streamChatSidebarTitle } = useChatSessions(s => s.actions);

	const generateTitle = (
		sessionId: string,
		messages: { role: string; content: string }[],
	) => {
		const source = new SSE(`/api/generate-conversation-title`, {
			payload: JSON.stringify({
				messages,
			}),
		});

		let cumulativeChunk = '';

		// Start Streaming
		try {
			source.addEventListener('message', async function (e) {
				if (e.data === '[DONE]') {
					source.close();
					cumulativeChunk &&
						(await updateSessionTitle({ sessionId, title: cumulativeChunk }));
					setTriggerRename({ source: sessionId, newName: cumulativeChunk });
					queryClient.invalidateQueries([QKFreeAIToken]);
				} else {
					const payload = JSON.parse(e.data);
					const chunkText = payload.choices[0].text;

					if (chunkText !== undefined) {
						cumulativeChunk = cumulativeChunk + chunkText;
					}
				}
			});

			source.stream();
		} catch (error) {
			if (error instanceof DOMException && error.name === 'AbortError') return;
			console.log({ error });
			toast.error('Something went wrong. Please try again.');
		}
	};

	useEffect(() => {
		if (triggerRename) {
			if (minimized) {
				streamChatSidebarTitle(triggerRename.newName);
			} else {
				renameTab(triggerRename.source, triggerRename.newName);
			}
			setTriggerRename(undefined);
		}
	}, [triggerRename, minimized]);

	return { generateTitle };
};

export default useGenerateChatSessionTitle;
