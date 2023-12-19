import ChatSessionCard from '@components/chat/ChatSessionCard';
import useChatStoreV2 from '@context/chatSessions.store';
import useDeleteChatSession from '@hooks/api/useChatSession.delete';
import useGetChatSessions from '@hooks/api/useChatSession.get';
import useDocumentTabs, {
	TabType,
	UniqueTabSources,
} from '@hooks/useDocumentTabs';
import {
	isBefore,
	isToday,
	isWithinInterval,
	isYesterday,
	subDays,
} from 'date-fns';
import React, { useCallback, useMemo } from 'react';

const ChatSessionList = () => {
	const { projectId, openDocument } = useDocumentTabs();
	const { setChatSidebar } = useChatStoreV2(s => s.actions);
	const { data: chatSessions } = useGetChatSessions(projectId);
	const { deleteSession, DeleteConfirmationDialog } = useDeleteChatSession();

	const sortedChatSessions = useMemo(() => {
		// Assuming chatSessions is sorted from the backend
		return chatSessions;
	}, [chatSessions]);

	const today = new Date();
	const yesterdayDate = subDays(today, 1);
	const sevenDaysAgo = subDays(today, 7);
	const thirtyDaysAgo = subDays(today, 30);

	const sessionGroups = useMemo(() => {
		return sortedChatSessions?.reduce(
			(acc, session) => {
				const createdAt = new Date(session.created_at);
				if (isToday(createdAt)) acc.today.push(session);
				else if (isYesterday(createdAt)) acc.yesterday.push(session);
				else if (
					isWithinInterval(createdAt, { start: sevenDaysAgo, end: today })
				)
					acc.lastSevenDays.push(session);
				else if (
					isWithinInterval(createdAt, { start: thirtyDaysAgo, end: today })
				)
					acc.lastThirtyDays.push(session);
				else if (isBefore(createdAt, thirtyDaysAgo)) acc.older.push(session);
				return acc;
			},
			{
				today: [],
				yesterday: [],
				lastSevenDays: [],
				lastThirtyDays: [],
				older: [],
			},
		);
	}, [sortedChatSessions, today, yesterdayDate, sevenDaysAgo, thirtyDaysAgo]);

	const handleOpenTabClick = useCallback(
		(type, id, title) => {
			openDocument({
				type: TabType.Chat,
				source: id,
				label: title,
			});
		},
		[openDocument],
	);

	const handleDeleteClick = useCallback(
		(id, title) => {
			deleteSession(id, title);
		},
		[deleteSession],
	);

	const renderSessions = (sessions, label) =>
		sessions &&
		sessions.length > 0 && (
			<>
				<p className="text-xs font-semibold text-gray-600 mt-3">{label}</p>
				{sessions.map(session => (
					<ChatSessionCard
						key={session.id}
						type={session.type}
						label={session.title}
						onClick={() =>
							setChatSidebar('DETAIL', {
								title: session.title,
								sessionId: session.id,
							})
						}
						onOpenTabClick={() =>
							handleOpenTabClick(TabType.Chat, session.id, session.title)
						}
						onDeleteClick={() => handleDeleteClick(session.id, session.title)}
					/>
				))}
			</>
		);

	return (
		<div className="px-3 flex flex-col gap-2 h-[calc(100vh-90px)] overflow-scroll">
			<DeleteConfirmationDialog />
			<ChatSessionCard
				type="NEW"
				onClick={() => {
					setChatSidebar('DETAIL', {
						title: 'New Chat',
						sessionId: UniqueTabSources.NEW_CHAT,
					});
				}}
				onOpenTabClick={() =>
					openDocument({
						type: TabType.Chat,
						source: UniqueTabSources.NEW_CHAT,
						label: 'New Chat',
					})
				}
			/>
			{/* Other Components */}
			{sessionGroups && renderSessions(sessionGroups.today, 'Today')}
			{sessionGroups && renderSessions(sessionGroups.yesterday, 'Yesterday')}
			{sessionGroups &&
				renderSessions(sessionGroups.lastSevenDays, 'Last 7 Days')}
			{sessionGroups &&
				renderSessions(sessionGroups.lastThirtyDays, 'Last 30 Days')}
			{sessionGroups && renderSessions(sessionGroups.older, 'Older')}
		</div>
	);
};

export default React.memo(ChatSessionList);
