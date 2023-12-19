import { Logomark } from '@components/landing/Logo';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import { Input } from '@components/ui/input';
import InputSettingButton from '@components/ui/input-setting-button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@components/ui/popover';
import useChatSessions from '@context/chatSessions.store';
import { useUIStore } from '@context/ui.store';
import { useUser } from '@context/user';
import useDocumentTabs, { TabType } from '@hooks/useDocumentTabs';
import useGetEditorRouter from '@hooks/useGetEditorRouter';
import { useGetUserUploads } from '@resources/editor-page';
import clsx from 'clsx';
import { BookUp, Globe2, Library, RefreshCw, Search } from 'lucide-react';
import React, { memo } from 'react';
import { FaStopCircle } from 'react-icons/fa';

type Props = {
	sessionId: string;
	minimized?: boolean;
};

const ChatInputSetting = ({ sessionId, minimized }: Props) => {
	const { user } = useUser();
	const chatContext = useChatSessions(
		s => s.chatSessions[sessionId]?.chatContext,
	);
	const searchInput = useChatSessions(
		s => s.chatSessions[sessionId]?.chatSearchInput,
	);
	const isHandling = useChatSessions(
		s => s.chatSessions[sessionId]?.isHandling,
	);
	const activeFileReference = useChatSessions(
		s => s.chatSessions[sessionId]?.activeFileReference,
	);
	const {
		setChatContext,
		setChatSearchInput,
		setActiveFileReference,
		resetStateOnError,
	} = useChatSessions(s => s.actions);

	const { projectId } = useGetEditorRouter();
	const { data: uploadFiles } = useGetUserUploads(user?.id, projectId);
	const { openDocument } = useDocumentTabs();

	const rightPanelWidth = useUIStore(s => s.rightPanelWidth);
	const isRegenerateSeen = false; // TODO

	return (
		<div className="flex justify-between pt-2 pb-2 text-xs">
			<div className="flex  max-w-full gap-2  ">
				<DropdownMenu>
					<DropdownMenuTrigger>
						<InputSettingButton>
							Context:{' '}
							{chatContext === 'file'
								? 'PDF'
								: chatContext === 'realtime'
								? 'Realtime'
								: chatContext === 'references'
								? activeFileReference?.name || 'All Documents'
								: 'Default'}
						</InputSettingButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						side="top"
						align="start"
						sideOffset={10}
						className="max-w-[300px] py-2"
					>
						<DropdownMenuLabel className="py-2.5">
							Chat Context
						</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() => setChatContext(sessionId, 'project')}
							className="py-2"
						>
							<Logomark className="h-8 w-8 mr-2" />
							<div>
								<div className="font-bold">Isaac</div>
								<div className="text-xs">
									Isaac&apos;s base model & infinite chat history
								</div>
							</div>
						</DropdownMenuItem>
						<DropdownMenuSub>
							<DropdownMenuSubTrigger className="py-2.5">
								<Library className="h-5 w-5 mr-3.5 ml-1.5 shrink-0" />
								<div>
									<div className="font-bold">References</div>
									<div className="text-xs">
										All your uploaded papers & documents. Or just a single file.
									</div>
								</div>
							</DropdownMenuSubTrigger>
							<DropdownMenuPortal>
								<DropdownMenuSubContent sideOffset={10} className="w-56">
									{uploadFiles?.length > 0 ? (
										<>
											<DropdownMenuItem
												key="all-documents"
												className={clsx(
													'flex gap-2 items-start py-2',
													!activeFileReference?.name &&
														'bg-neutral-100 font-semibold dark:bg-neutral-800',
												)}
												onClick={() => {
													setChatContext(sessionId, 'references');
													setActiveFileReference(sessionId, {
														name: null,
														fileId: null,
													});
												}}
											>
												<div>
													<Library
														strokeWidth={1.4}
														className="mr-2 h-4 w-4 shrink-0 text-neutral-500"
													/>
												</div>
												<p>All documents</p>
											</DropdownMenuItem>

											{uploadFiles?.map(file => (
												<DropdownMenuItem
													key={file.id}
													className={clsx(
														'flex gap-2 items-start py-2',
														file.id === activeFileReference?.fileId &&
															'bg-neutral-100 font-semibold dark:bg-neutral-800',
													)}
													onClick={() => {
														const name =
															file.custom_citation?.title || file.file_name;
														setChatContext(sessionId, 'references');
														setActiveFileReference(sessionId, {
															name:
																file.custom_citation?.title || file.file_name,
															fileId: file.id,
														});
														minimized &&
															openDocument({
																source: file.id,
																label: name,
																type: TabType.UserUpload,
															});
													}}
												>
													<div>
														<BookUp
															strokeWidth={1.4}
															className="mr-2 h-4 w-4 shrink-0 text-neutral-500"
														/>
													</div>
													<p className="line-clamp-1">
														{file.custom_citation?.title || file.file_name}
													</p>
												</DropdownMenuItem>
											))}
										</>
									) : (
										<DropdownMenuItem
											key="all-documents"
											disabled
											onClick={() => {
												setChatContext(sessionId, 'references');
												setActiveFileReference(sessionId, {
													name: null,
													fileId: null,
												});
											}}
											className="text-center text-xs"
										>
											No References Uploaded
										</DropdownMenuItem>
									)}
								</DropdownMenuSubContent>
							</DropdownMenuPortal>
						</DropdownMenuSub>
						<DropdownMenuItem
							onClick={() => setChatContext(sessionId, 'realtime')}
							className="py-2"
						>
							<Globe2 className="h-5 w-5 mr-3.5 ml-1.5" />
							<div>
								<div className="font-bold">Realtime Data</div>
								<div className="text-xs">
									Included: Realtime data sourced from the web
								</div>
							</div>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				{/* // TODO: Figure out how to stop generation */}
				{isHandling && (
					<InputSettingButton className="inline-flex items-center" onClick={() => resetStateOnError(sessionId)}>
						<span className="mr-0.5"> Stop generation</span>
						<FaStopCircle size="10" className="inline-block animate-pulse" />
					</InputSettingButton>
				)}
				{isRegenerateSeen && (
					<InputSettingButton onClick={() => alert('regemerate')}>
						Regenerate <RefreshCw size="10" className="inline-block" />
					</InputSettingButton>
				)}
			</div>
			{!isHandling && (
				<>
					<Popover>
						<PopoverTrigger asChild>
							<InputSettingButton>
								<Search size="10" className="inline-block" /> Search
							</InputSettingButton>
						</PopoverTrigger>
						<PopoverContent
							side="top"
							align="end"
							className="p-1"
							style={{ width: rightPanelWidth - 46 }}
						>
							<div
								onSubmit={e => {
									e.preventDefault();
									alert('search');
								}}
								className="text-xs text-neutral-500 relative flex max-h-max"
							>
								<Search
									strokeWidth={1.4}
									className="absolute my-3 ml-2 h-4 w-4"
								/>
								<Input
									className="w-full focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 pl-10"
									value={searchInput}
									onChange={e => setChatSearchInput(sessionId, e.target.value)}
									onKeyDown={e => {
										// Prevent Enter from triggering form submit
										if (e.key === 'Enter') e.preventDefault();
									}}
								/>
							</div>
						</PopoverContent>
					</Popover>
				</>
			)}
		</div>
	);
};

export default memo(ChatInputSetting);
