import { ChatContext, ChatMessageV2, ChatRoles } from 'types/chat';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

type ChatSessionData = {
	messages: ChatMessageV2[];
	chatContext: ChatContext;
	isHandling: boolean;
	promptInput: string; // the main input box
	chatSearchInput: string;
	activeFileReference?: { name: string; fileId: string }; // if chat context is a file
};

type ChatSessionStore = {
	chatSessions: Record<string, ChatSessionData>; // * Persist for different projects
	chatSidebar: ['LIST' | 'DETAIL', { title: string; sessionId: string }];
	actions: {
		createNewChatSessionStore: (
			sessionId: string,
			firstMessage: string,
		) => { assistantMessage: ChatMessageV2; userMessage: ChatMessageV2 };
		initializeChatSession: (
			sessionId: string,
			messages: ChatMessageV2[],
		) => void;
		closeChatSession: () => void;
		addNewMessage: (sessionId: string) => {
			assistantMessage: ChatMessageV2;
			userMessage: ChatMessageV2;
			previousMessages: ChatMessageV2[];
		};
		setChatSearchInput: (sessionId: string, context) => void;
		setChatContext: (sessionId: string, context: ChatContext) => void;
		setPromptInput: (sessionId: string, prompt: string) => void;
		setChatSidebar: (
			section: 'LIST' | 'DETAIL',
			detailProp?: { title: string; sessionId: string },
		) => void;
		setIsHandling: (sessionId: string, bool: boolean) => void;
		setActiveFileReference: (
			sessionId: string,
			fileReference: { name: string; fileId: string },
		) => void;
		updateAIStreamByChunk: (
			sessionId: string,
			messageId: string,
			chunk: string,
		) => void;
		streamChatSidebarTitle: (cumulativeChunk: string) => void;
		resetStateOnError: (sessionId: string) => void;
	};
};

const useChatSessions = create<ChatSessionStore>((set, get) => ({
	chatSidebar: ['LIST', { title: '', sessionId: '' }],
	chatSessions: {},
	actions: {
		createNewChatSessionStore: (sessionId, firstMessage) => {
			const _chatSessions = get().chatSessions;
			const userMessage: ChatMessageV2 = {
				id: uuidv4(),
				content: firstMessage,
				session_id: sessionId,
				role: 'user',
			};

			const assistantMessage: ChatMessageV2 = {
				id: uuidv4(),
				content: '',
				session_id: sessionId,
				role: 'assistant',
			};
			const chatSessionData: ChatSessionData = {
				chatContext: 'project',
				promptInput: '',
				isHandling: true,
				chatSearchInput: '',
				messages: [userMessage, assistantMessage],
				activeFileReference: undefined,
			};
			set({ chatSessions: { ..._chatSessions, [sessionId]: chatSessionData } });
			return { assistantMessage, userMessage };
		},
		closeChatSession: () => 'void;',
		addNewMessage: sessionId => {
			const _chatSessions = get().chatSessions;
			const targetChatSession = _chatSessions[sessionId];
			const { promptInput: content, messages: previousMessages } =
				targetChatSession;

			const userMessage: ChatMessageV2 = {
				id: uuidv4(),
				content,
				session_id: sessionId,
				role: 'user',
			};

			const assistantMessage: ChatMessageV2 = {
				id: uuidv4(),
				content: '',
				session_id: sessionId,
				role: 'assistant',
			};

			set({
				chatSessions: {
					..._chatSessions,
					[sessionId]: {
						...targetChatSession,
						messages: [...previousMessages, userMessage, assistantMessage],
						promptInput: '',
					},
				},
			});

			return { previousMessages, userMessage, assistantMessage };
		},
		setPromptInput: (sessionId, input) => {
			const _chatSessions = get().chatSessions;
			const targetChatSession = _chatSessions[sessionId];
			set({
				chatSessions: {
					..._chatSessions,
					[sessionId]: {
						...targetChatSession,
						promptInput: input,
					},
				},
			});
		},
		setIsHandling: (sessionId, isHandling) => {
			const _chatSessions = get().chatSessions;
			const targetChatSession = _chatSessions[sessionId];
			set({
				chatSessions: {
					..._chatSessions,
					[sessionId]: {
						...targetChatSession,
						isHandling,
					},
				},
			});
		},
		setChatSidebar: (list: 'LIST' | 'DETAIL', detailedSection) =>
			set({ chatSidebar: [list, detailedSection] }),
		streamChatSidebarTitle: (cumulativeChunk: string) => {
			const sessionId = get().chatSidebar[1].sessionId;
			if (sessionId) {
				set({ chatSidebar: ['DETAIL', { sessionId, title: cumulativeChunk }] });
			}
		},
		updateAIStreamByChunk: (sessionId, messageId, chunk) => {
			//
			const _chatSessions = get().chatSessions;
			const targetChatSession = _chatSessions[sessionId];
			const messageToChange = targetChatSession.messages.find(
				message => message.id === messageId,
			);
			const initialMessages = targetChatSession.messages.filter(
				message => message.id !== messageId,
			);
			if (messageToChange) {
				set({
					chatSessions: {
						..._chatSessions,
						[sessionId]: {
							...targetChatSession,
							messages: [
								...initialMessages,
								{
									...messageToChange,
									content: messageToChange.content + chunk,
								},
							],
						},
					},
				});
			}
		},
		initializeChatSession: (sessionId, messages) => {
			const _chatSessions = get().chatSessions;
			const chatSessionData: ChatSessionData = {
				chatContext: 'project',
				promptInput: '',
				isHandling: false,
				chatSearchInput: '',
				messages: messages,
			};
			set({ chatSessions: { ..._chatSessions, [sessionId]: chatSessionData } });
		},

		setChatContext: (sessionId, context) => {
			const _chatSessions = get().chatSessions;
			const targetChatSession = _chatSessions[sessionId];
			set({
				chatSessions: {
					..._chatSessions,
					[sessionId]: {
						...targetChatSession,
						chatContext: context,
					},
				},
			});
		},

		setChatSearchInput: (sessionId, searchInput) => {
			const _chatSessions = get().chatSessions;
			const targetChatSession = _chatSessions[sessionId];
			set({
				chatSessions: {
					..._chatSessions,
					[sessionId]: {
						...targetChatSession,
						chatSearchInput: searchInput,
					},
				},
			});
		},

		setActiveFileReference: (sessionId, fileReference) => {
			const _chatSessions = get().chatSessions;
			const targetChatSession = _chatSessions[sessionId];
			set({
				chatSessions: {
					..._chatSessions,
					[sessionId]: {
						...targetChatSession,
						activeFileReference: fileReference,
					},
				},
			});
		},
		resetStateOnError: sessionId => {
			const _chatSessions = get().chatSessions;
			const targetChatSession = _chatSessions[sessionId];
			const updatedMessaged = _chatSessions[sessionId].messages?.slice(0, -1);
			set({
				chatSessions: {
					..._chatSessions,
					[sessionId]: {
						...targetChatSession,
						isHandling: false,
						messages: updatedMessaged,
					},
				},
			});
		},
	},
}));

export default useChatSessions;
