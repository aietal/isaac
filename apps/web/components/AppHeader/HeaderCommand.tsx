import { Logomark } from '@components/landing/Logo';
import { Button } from '@components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from '@components/ui/command';

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@components/ui/popover';
import useLexicalEditorStore from '@context/lexicalEditor.store';
import { useUIStore } from '@context/ui.store';
import useWriteNextSentence from '@hooks/api/isaac/useWriteNextSentence';
import useCreateProject from '@hooks/api/useCreateProject';
import useGetProjectWithDocuments from '@hooks/api/useGetProjectWithDocuments';
import useDocumentTabs, {
	TabType,
	UniqueTabSources,
} from '@hooks/useDocumentTabs';
import { CitationCommand } from '@lexical/plugins/CommandPlugin/CitationCommand';
import clsx from 'clsx';
import { $createTextNode, $getSelection } from 'lexical';
import {
	FileText,
	Folder,
	HelpCircle,
	Library,
	Search,
	StepForward,
} from 'lucide-react';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { commandKey } from '@lexical/utils/meta';

enum SubCommand {
	CITATION_COMMAND = 'CITATION_COMMAND',
}

const commandCategoryKeywords = {
	editor: '_',
};

export default function ProjectNavCommand() {
	const { currentProjectDocuments, projectDocuments } =
		useGetProjectWithDocuments();
	const { push } = useRouter();
	const [search, setSearch] = useState<string>('');
	const [editorCommand, opts] = useUIStore(s => s.showEditorCommand);
	const setShowEditorCommand = useUIStore(s => s.setShowEditorCommand);
	const activeEditor = useLexicalEditorStore(s => s.activeEditor);
	const { openDocument, activeDocument, projectId } = useDocumentTabs();

	const [activeSubCommand, setActiveSubCommand] = useState<SubCommand>();

	const { writeNextSentence } = useWriteNextSentence(activeEditor);

	const openProject = (projectId: string) => {
		push(`/editor/${projectId}`);
	};

	const { mutateAsync: createProject } = useCreateProject({
		createDocumentOnCreate: true,
	});

	const showCreateDocumentModal = useUIStore(s => s.setShowCreateDocumentModal);

	useEffect(() => {
		if (opts?.defaultSearch) {
			setSearch(opts.defaultSearch);
		}
	}, [opts]);

	return (
		<>
			<Popover
				open={editorCommand}
				onOpenChange={open => {
					activeEditor?.focus();
					setShowEditorCommand(open);
				}}
			>
				<PopoverTrigger asChild>
					<button className="w-[280px] sm-[300px] md:w-[360px] border text-sm  h-7 rounded">

							<span className="">
								{commandKey} + K
							</span>


					</button>
				</PopoverTrigger>
				<PopoverContent className="w-[360px] p-0" sideOffset={-30}>
					<Command
						filter={(value, search) => {
							if (value.includes('_editor_') && opts?.showAIFunction) {
								return 1;
							}

							if (value.includes(search)) {
								return 1;
							} else if (
								value.includes('_search_') ||
								value.includes('_create_')
							) {
								return 1;
							}

							return 0;
						}}
					>
						<CommandInput
							placeholder="Type a command or search..."
							className="h-[34px]"
							onValueChange={setSearch}
							value={search}
						/>
						<CommandEmpty>
							<p>No command found</p>
						</CommandEmpty>
						{
							<>
								<CommandGroup heading="Editor commands">
									<CommandItem
										onSelect={() => {
											activeEditor.update(() => {
												// setShowEditorCommand(false);
												const selection = $getSelection();
												selection.insertNodes([$createTextNode('$')]);
											});
										}}
									>
										<Logomark className="h-4 w-4 mr-2 fill-primary scale-125" />
										<span className="hidden">_editor_</span>
										<span>Ask Isaac</span>
									</CommandItem>
									<CommandItem
										hidden={true}
										onSelect={() => {
											setActiveSubCommand(SubCommand.CITATION_COMMAND);
											setShowEditorCommand(false);
										}}
									>
										<Library className="mr-2 h-4 w-4" />
										<span className="hidden">_editor_</span>
										<span>Cite reference</span>
									</CommandItem>
									<CommandItem
										onSelect={v => {
											openDocument({
												source: UniqueTabSources.NEW_LIT_SEARCH,
												type: TabType.LiteratureSearch,
												label: 'Search literature',
											});
											setShowEditorCommand(false);
										}}
									>
										<Search className="mr-2 h-4 w-4" />
										<span className="hidden">_editor_</span>
										<span>Search literature</span>
									</CommandItem>
									<CommandItem
										onSelect={() => {
											setShowEditorCommand(false);
											writeNextSentence();
										}}
									>
										<StepForward className="mr-2 h-4 w-4" />
										<span className="hidden">_editor_</span>
										<span>Write next sentence</span>
									</CommandItem>
									<CommandItem
										onSelect={() =>
											activeEditor.update(() => {
												setShowEditorCommand(false);
												const selection = $getSelection();
												selection.insertNodes([$createTextNode('#')]);
											})
										}
									>
										<HelpCircle className="mr-2 h-4 w-4" />
										<span className="hidden">_editor_</span>
										<span>Ask research question</span>
									</CommandItem>
								</CommandGroup>
							</>
						}

						<CommandSeparator />
						<CommandGroup heading="Open Project" className="mx-1 my-0.5">
							{projectDocuments?.map(project => (
								<CommandList key={project.id}>
									<CommandItem
										key={project.id}
										onSelect={() => {
											openProject(project.id);
											setShowEditorCommand(false);
										}}
									>
										<Folder
											size={15}
											strokeWidth={1.2}
											className="mr-2 shrink-0"
										/>
										<span className="whitespace-nowrap">{project.title}</span>
										<span className="text-transparent line-clamp-1">
											{project.id}
										</span>
									</CommandItem>

									{search &&
										project.id === projectId &&
										project.documents.map(doc => (
											<CommandItem
												key={doc.id}
												onSelect={() => {
													openProject(project.id);
													openDocument({
														source: doc.id,
														label: doc.title,
														type: TabType.Document,
														_projectId: project.id,
													});
												}}
											>
												<div>
													<FileText
														size={15}
														strokeWidth={1.4}
														className="mr-2 ml-4 shrink-0"
													/>
												</div>
												<span className="whitespace-nowrap">{doc.title}</span>{' '}
												<span className="text-transparent line-clamp-1">
													{`${project.title} ${project.id}`}
												</span>
											</CommandItem>
										))}
								</CommandList>
							))}
						</CommandGroup>
						<div className={clsx(search?.length < 2 ? 'hidden' : 'block')}>
							<CommandSeparator />
							<CommandGroup>
								<CommandList>
									<CommandItem
										onSelect={value => {
											openDocument({
												source: search,
												type: TabType.LiteratureSearch,
												label: search,
											});
											setShowEditorCommand(false);
										}}
									>
										<Search className="mr-2 h-4 w-4" />
										<span className="hidden">_search_</span>
										<span>Search literature for {`"${search}"`}</span>
									</CommandItem>
									<CommandItem
										onSelect={() => {
											showCreateDocumentModal(true, search);
											setShowEditorCommand(false);
										}}
									>
										<div>
											<FileText
												size={15}
												strokeWidth={1.4}
												className="mr-2 shrink-0"
											/>
										</div>
										<span className="hidden">_create_</span>
										<span>Create document titled {`"${search}"`}</span>
									</CommandItem>
									<CommandItem
										onSelect={() => {
											createProject(search);
											setShowEditorCommand(false);
										}}
									>
										<Folder
											size={15}
											strokeWidth={1.2}
											className="mr-2 shrink-0"
										/>
										<span className="hidden">_create_</span>
										<span>Create project titled {`"${search}"`}</span>
									</CommandItem>
								</CommandList>
							</CommandGroup>
						</div>
					</Command>
				</PopoverContent>
			</Popover>

			{/* TODO: REMOVE THIS WHEN ITS REFEACTORED */}
			<CitationCommand
				open={activeSubCommand === SubCommand.CITATION_COMMAND}
				setOpen={() => setActiveSubCommand(undefined)}
				onSelectCallback={() => {
					setActiveSubCommand(undefined);
				}}
			/>
		</>
	);
}
