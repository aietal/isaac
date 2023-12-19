import Chatbox from '@components/chat/Chatbox';
import ChatInput from '@components/chat/ChatInput';
import ChatInputSetting from '@components/chat/ChatInputSetting';
import useChatSessions from '@context/chatSessions.store';
import { retrieveChatMessages } from '@hooks/api/isaac/useRetrieveChatMessages';
import useDocumentTabs, {
	TabType,
	UniqueTabSources,
} from '@hooks/useDocumentTabs';
import clsx from 'clsx';
import { default as React, useEffect } from 'react';

type Props = {
	active: boolean;
	sessionId: string;
};

const ChatTab = ({ active, sessionId }: Props) => {
	const { activeDocument } = useDocumentTabs();
	const { initializeChatSession } = useChatSessions(s => s.actions);

	const chatSessionContext = useChatSessions(
		s => s.chatSessions[sessionId]?.chatContext,
	);

	// * Initialize chat content
	useEffect(() => {
		if (
			activeDocument?.type === TabType.Chat &&
			sessionId !== UniqueTabSources.NEW_CHAT &&
			chatSessionContext === undefined
		) {
			// initialize chat
			retrieveChatMessages(sessionId).then(chatMessages => {
				initializeChatSession(sessionId, chatMessages);
			});
		}
	}, [chatSessionContext, activeDocument, sessionId]);

	return (
		<div
			className={clsx(
				'flex flex-col h-full max-w-[1400px] mx-auto justify-between',
				active ? 'block' : 'hidden',
			)}
		>
			<Chatbox sessionId={sessionId} />
			<div className=" w-full">
				<ChatInputSetting sessionId={sessionId} />
				<ChatInput sessionId={sessionId} />
			</div>
		</div>
	);
};

export default ChatTab;
