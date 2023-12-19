import Spinner from '@components/core/Spinner';
import { TextareaChat } from '@components/ui/textarea-chat';
import useChatSessions from '@context/chatSessions.store';
import useGenerateChatSessionTitle from '@hooks/api/isaac/useGenerateChatSessionTitle';
import useIsaacSystemPrompt from '@hooks/api/isaac/useIsaacSystemPrompt';
import useSaveChatMessage from '@hooks/api/isaac/useSaveChatMessage';
import useStreamChatMessage from '@hooks/api/isaac/useStreamChatMessage';
import useCreateChatSession from '@hooks/api/useChatSession.create';
import useDocumentTabs, { UniqueTabSources } from '@hooks/useDocumentTabs';
import clsx from 'clsx';
import { Send } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { ChatMessageV2 } from 'types/chat';
// Types
interface ChatInputProps {
	sessionId: string;
	minimized?: boolean;
}

const ChatInput = ({ sessionId, minimized }: ChatInputProps) => {
	const [inputValue, setInputValue] = useState<string>('');
	const { projectId, updateNewChatTab } = useDocumentTabs();
	const isHandling = useChatSessions(
		s => s.chatSessions[sessionId]?.isHandling,
	);
	const formRef = useRef<HTMLFormElement>(null);
	const promptInput = useChatSessions(
		s => s.chatSessions[sessionId]?.promptInput,
	);
	const fileReference = useChatSessions(
		s => s.chatSessions[sessionId]?.activeFileReference,
	);
	const chatContext = useChatSessions(
		s => s.chatSessions[sessionId]?.chatContext,
	);
	const { generateTitle } = useGenerateChatSessionTitle(minimized);

	const systemPrompt = useIsaacSystemPrompt();
	const { mutateAsync: saveChatMessage } = useSaveChatMessage();
	const {
		setPromptInput,
		createNewChatSessionStore,
		updateAIStreamByChunk,
		addNewMessage,
		setChatSidebar,
		setIsHandling,
		resetStateOnError,
	} = useChatSessions(s => s.actions);

	const { streamChatMessage } = useStreamChatMessage();
	const { mutateAsync: createNewChatSession } = useCreateChatSession({
		onSuccessCb: async ({ id, title }) => {
			const { assistantMessage, userMessage } = createNewChatSessionStore(
				id,
				title,
			);
			if (minimized) {
				setChatSidebar('DETAIL', { title, sessionId: id });
			} else {
				updateNewChatTab(id, title);
			}

			// API Calls here
			streamChatMessage({
				uploadId: fileReference?.fileId,
				context: chatContext,
				messages: [
					{ role: 'system', content: systemPrompt },
					{ role: 'user', content: title },
				],
				onComplete: completedText => {
					const messages: ChatMessageV2[] = [
						userMessage,
						{ ...assistantMessage, content: completedText },
					];
					saveChatMessage(messages);
					setIsHandling(id, false);
					generateTitle(
						id,
						messages.map(m => ({ role: m.role, content: m.content })),
					);
				},
				onStreamChunk: chunk => {
					updateAIStreamByChunk(id, assistantMessage.id, chunk);
				},
				onError: errorMessage => {
					toast.error(errorMessage);
					resetStateOnError(id);
				},
			});
		},
	});

	const onSubmit = async () => {
		if (sessionId === UniqueTabSources.NEW_CHAT) {
			await createNewChatSession({
				projectId,
				title: inputValue,
			});
			setInputValue('');
		} else {
			// Continue on conversations
			const { previousMessages, assistantMessage, userMessage } =
				addNewMessage(sessionId);
			setIsHandling(sessionId, true);
			streamChatMessage({
				uploadId: fileReference?.fileId || undefined,
				context: chatContext,
				messages: [
					{ role: 'system', content: systemPrompt },
					...previousMessages.map(m => ({ role: m.role, content: m.content })), //* Injecting older context
					{ role: 'user', content: userMessage.content },
				],
				onComplete: completedText => {
					saveChatMessage([
						userMessage,
						{ ...assistantMessage, content: completedText },
					]);
					setIsHandling(sessionId, false);
				},
				onStreamChunk: chunk => {
					updateAIStreamByChunk(sessionId, assistantMessage.id, chunk);
				},
				onError: errorMessage => {
					toast.error(errorMessage);
					resetStateOnError(sessionId);
				},
			});
			// TODO: Manage Is Handling
		}
	};

	// Submit Form on Enter
	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLTextAreaElement>) => {
			if (event.key === 'Enter' && !event.shiftKey && !isHandling) {
				event.preventDefault();
				formRef.current?.dispatchEvent(
					new Event('submit', { cancelable: true, bubbles: true }),
				);
			}
		},
		[],
	);

	// Automatically focus on the input when its open
	const inputRef = useRef(null);
	useEffect(() => {
		inputRef?.current.focus();
	}, [sessionId]);
	const inputText =
		sessionId === UniqueTabSources.NEW_CHAT ? inputValue : promptInput;
	return (
		<div className="pb-4 bg-gradient-to-b from-transparent dark:via-neutral-950/60 dark:to-neutral-900 via-bg-desertStorm-100/60 to-desertStorm-100">
			<form
				ref={formRef}
				onSubmit={e => {
					e.preventDefault();
					onSubmit();
				}}
				className={clsx(
					'flex items-center w-full bg-white rounded-md border focus-within:ring-ring focus-within:ring-[2px] dark:bg-neutral-950',
				)}
			>
				<TextareaChat
					id="isaac-chat-input"
					className={clsx(
						'placeholder:pt-1 overflow-y-auto',
						minimized ? 'text-sm' : 'text-md',
					)}
					ref={inputRef}
					disabled={isHandling}
					style={{
						minHeight: '80px',
						maxHeight: '260px',
						height: `${(inputText?.split('\n').length || 0) * 28}px`,
					}}
					placeholder="Message Isaac..."
					value={inputText}
					onChange={e =>
						sessionId === UniqueTabSources.NEW_CHAT
							? setInputValue(e.target.value)
							: setPromptInput(sessionId, e.target.value)
					}
					onKeyDown={handleKeyDown}
				/>
				<button className="pr-4" type="submit">
					{!isHandling ? (
						<Send
							size="18"
							className="text-neutral-600 dark:peer-focus:text-neutral-500 peer-focus:text-neutral-300"
						/>
					) : (
						<Spinner />
					)}
				</button>
			</form>
		</div>
	);
};

export default ChatInput;
