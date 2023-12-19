import SortableDDContainer from '@components/core/SortableDDContainer';
import SortableDDItem from '@components/core/SortableDDItem';
import { Button } from '@components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandSeparator,
} from '@components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@components/ui/popover';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@components/ui/tooltip';
import useChatSessions from '@context/chatSessions.store';
import { useLiteratureReferenceStore } from '@context/literatureReference.store';
import { Panel, useUIStore } from '@context/ui.store';
import useGetProjectWithDocuments from '@hooks/api/useGetProjectWithDocuments';
import useDocumentTabs, { TabType } from '@hooks/useDocumentTabs';
import { commandKey } from '@lexical/utils/meta';
import { useHover } from '@mantine/hooks';
import clsx from 'clsx';
import {
	ArrowDownLeft,
	Book,
	Bookmark,
	BookUp,
	ChevronRight,
	FileText,
	FolderOpen,
	MessageSquare,
	Search,
	X,
} from 'lucide-react';
import React, { memo, useCallback, useMemo } from 'react';

const minimizableTabItem = [TabType.Chat, TabType.LiteratureSearch];

const EditorTabs = () => {
	const activeSidebar = useUIStore(s => s.activeSidebar);
	const { currentProjectTabs, closeTab, openDocument, handleTabOnSort } =
		useDocumentTabs();
	const { currentProjectDocuments } = useGetProjectWithDocuments();

	const transformDocumentsToTabs = useCallback((currentProjectDocuments) => {
		return currentProjectDocuments?.documents.map(document => ({
			active: false,
			label: document.title,
			source: document.id,
			type: 'Document',
		}));
	}, []);

	const filterByType = useCallback((tabs) => {
		return tabs?.filter(
			tab => tab.type === 'SemanticScholar' || tab.type === 'UserUpload',
		);
	}, []);

	const filteredFileTabs = useMemo(() => filterByType(currentProjectTabs), [filterByType, currentProjectTabs]);

	const allDocuments = useMemo(() => transformDocumentsToTabs(currentProjectDocuments), [transformDocumentsToTabs, currentProjectDocuments]);

	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState('');
	const openPanel = useUIStore(s => s.openPanel);
	const { setChatSidebar } = useChatSessions(s => s.actions);
	const setLiteratureSearch = useLiteratureReferenceStore(
		s => s.setLiteratureSearch,
	);

	return (
		<div className="flex">
			{!activeSidebar && (
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="ghost"
							role="combobox"
							aria-expanded={open}
							className="flex items-center justify-beginning shrink-0 h-8 ml-2 pl-1"
						>
							<FolderOpen size={20} strokeWidth={1.2} />
							<p className="text-sm px-3 flex gap-2 font-semibold">
								{currentProjectDocuments?.title}
							</p>
							<ChevronRight size={16} strokeWidth={1.4} className="ml-2" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-[300px] p-0">
						<Command>
							<CommandInput placeholder="Search document..." />
							<CommandEmpty>No document found.</CommandEmpty>
							<CommandGroup heading="Project documents and files">
								{allDocuments?.map((tab, idx) => (
									<CommandItem
										className={clsx(
											value === tab.label && 'font-medium text-isaac',
										)}
										key={idx}
										onSelect={() => {
											setValue(tab.label);
											openDocument(tab);
											setOpen(false);
										}}
									>
										{tab.type === 'Document' && (
											<FileText
												strokeWidth={1.4}
												className="mr-2 h-4 w-4 shrink-0"
											/>
										)}
										<span>{tab.label}</span>
									</CommandItem>
								))}
							</CommandGroup>
							<CommandSeparator />
							{filteredFileTabs && filteredFileTabs.length > 0 && (
								<CommandGroup heading="Recently opened files">
									{filteredFileTabs?.map((tab, idx) => (
										<CommandItem
											className={clsx(
												value === tab.label && 'font-medium text-isaac',
											)}
											key={idx}
											onSelect={() => {
												setValue(tab.label);
												openDocument(tab);
												setOpen(false);
											}}
										>
											{tab.type === 'SemanticScholar' && (
												<Book
													strokeWidth={1.4}
													className="mr-2 h-4 w-4 shrink-0"
												/>
											)}
											{tab.type === 'UserUpload' && (
												<BookUp
													strokeWidth={1.4}
													className="mr-2 h-4 w-4 shrink-0"
												/>
											)}
											<span className="truncate ">{tab.label}</span>
										</CommandItem>
									))}
								</CommandGroup>
							)}
						</Command>
					</PopoverContent>
				</Popover>
			)}

			<div className="inline-flex items-center overflow-x-auto scrollbar-hide">
				<SortableDDContainer
					sortDirection="horizontal"
					itemIds={currentProjectTabs?.map(i => i.source) || []}
					onSort={sortedIds => handleTabOnSort(sortedIds)}
				>
					{currentProjectTabs?.map((tab, idx) => (
						<SortableDDItem key={`tab-${idx}`} id={tab.source}>
							<TabItem
								idx={idx}
								type={tab.type}
								active={tab.active}
								text={tab.label}
								onClick={() => openDocument(tab)}
								onCloseClick={() => closeTab(tab.source)}
								onMinimize={
									minimizableTabItem.includes(tab.type)
										? () => {
												closeTab(tab.source);
												if (tab.type === TabType.Chat) {
													openPanel(Panel.CHAT_SESSIONS);
													setChatSidebar('DETAIL', {
														title: tab.label,
														sessionId: tab.source,
													});
												} else if (tab.type === TabType.LiteratureSearch) {
													openPanel(Panel.LITERATURE_SEARCH);
													setLiteratureSearch({
														keyword: tab.source,
													});
												}
										  }
										: undefined
								}
								activeSidebar={activeSidebar}
							/>
						</SortableDDItem>
					))}
				</SortableDDContainer>
			</div>
		</div>
	);
};

export default React.memo(EditorTabs);

type TabItemProps = {
	idx: number;
	type: TabType;
	active?: boolean;
	text: string;
	onCloseClick: () => void;
	onMinimize?: () => void;
	onClick: () => void;
	activeSidebar?: boolean;
};

const TabItem = memo(({
	idx,
	type,
	onCloseClick,
	active,
	text,
	onClick,
	activeSidebar,
	onMinimize,
}: TabItemProps) => {
	const { hovered, ref } = useHover();

	return (
		<div
			ref={ref}
			className={clsx(
				'flex items-center w-[150px] h-8 gap-2 cursor-pointer hover:bg-accent px-2 transition-width select-none',
				active
					? 'border-t border-r border-t-isaac bg-transparent border-b border-b-transparent'
					: 'border-b border-r border-t border-t-transparent',
				activeSidebar && '',
			)}
			onClick={onClick}
		>
			<div>
				{type === 'SemanticScholar' && <Book strokeWidth={1.4} size={18} />}
				{type === 'UserUpload' && <BookUp strokeWidth={1.4} size={18} />}
				{type === 'Document' && <FileText strokeWidth={1.4} size={18} />}
				{type === 'LiteratureSearch' && <Search strokeWidth={1.4} size={18} />}
				{type === 'Chat' && <MessageSquare strokeWidth={1.4} size={18} />}
				{type === 'SavedReference' && <Bookmark strokeWidth={1.4} size={18} />}
			</div>

			<Tooltip>
				<TooltipTrigger asChild>
					<p className={clsx('w-[80px] flex-grow min-w-0 truncate text-sm ')}>
						{text}
					</p>
				</TooltipTrigger>
				<TooltipContent side="top" sideOffset={10}>
					<p>
						{text} |{' '}
						<strong>
							{commandKey} + {idx + 1}
						</strong>
					</p>
				</TooltipContent>
			</Tooltip>

			<div className="flex ">
				{onMinimize && (
					<ArrowDownLeft
						size={14}
						strokeWidth={1.2}
						className={clsx(
							'transition-width text-gray-500 hover:text-gray-800',
							hovered ? 'w-auto mr-1.5' : 'w-0',
						)}
						onClick={e => {
							onMinimize();
							e.stopPropagation();
						}}
					/>
				)}
				<X
					className="text-gray-500 hover:text-gray-800"
					onClick={e => {
						onCloseClick();
						e.stopPropagation();
					}}
					size={14}
					strokeWidth={1.2}
				/>
			</div>
		</div>
	);
});
