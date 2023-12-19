import ChatPanel from '@components/chat/ChatPanel';
import ChatSessionList from '@components/chat/ChatSessionList';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@components/ui/tooltip';
import useChatStoreV2 from '@context/chatSessions.store';
import useDocumentTabs, {
	TabType,
	UniqueTabSources,
} from '@hooks/useDocumentTabs';
import { ArrowLeft, ArrowUpRight, MessageSquarePlusIcon } from 'lucide-react';
import React from 'react';

const ChatSessions = () => {
	// move these to global state
	const { setChatSidebar } = useChatStoreV2(s => s.actions);
	const chatSidebar = useChatStoreV2(s => s.chatSidebar);
	const { openDocument } = useDocumentTabs();

	return (
		<div className="w-full flex flex-col gap-1 h-full">
			{/* HEADER */}
			<div className="flex justify-between p-3 ">
				<p className="font-semibold mb-2 text-sm flex gap-2 items-center">
					{chatSidebar[0] === 'LIST' && 'Chat Sessions'}

					{chatSidebar[0] === 'DETAIL' && (
						<>
							<ArrowLeft
								size={20}
								onClick={() => {
									setChatSidebar('LIST');
								}}
								className="text-gray-600 hover:text-isaac cursor-pointer"
								strokeWidth={1}
							/>
							<span>{chatSidebar[1].title}</span>
						</>
					)}
				</p>

				{/* TOP RIGHT ICON */}
				{/* {chatSidebar[0] === 'LIST' && (
					<Tooltip>
						<TooltipTrigger asChild>
							<MessageSquarePlusIcon
								size={18}
								onClick={() => {
									setChatSidebar('DETAIL', {
										title: 'New Chat',
										sessionId: UniqueTabSources.NEW_CHAT,
									});
								}}
								className="m-1 hover:text-isaac cursor-pointer"
								strokeWidth={1.5}
							/>
						</TooltipTrigger>
						<TooltipContent>New Chat Session</TooltipContent>
					</Tooltip>
				)} */}
				{chatSidebar[0] === 'DETAIL' && (
					<div className="md:flex gap-2 hidden">
						<ArrowUpRight
							size={20}
							onClick={() => {
								openDocument({
									type: TabType.Chat,
									source: chatSidebar[1].sessionId,
									label: chatSidebar[1].title,
								});
								setChatSidebar('LIST');
							}}
							className="text-gray-600 hover:text-isaac cursor-pointer"
							strokeWidth={1}
						/>
					</div>
				)}
			</div>

			{/* CONTENT */}
			{chatSidebar[0] === 'LIST' && <ChatSessionList />}
			{chatSidebar[0] === 'DETAIL' && <ChatPanel />}
		</div>
	);
};

export default ChatSessions;
