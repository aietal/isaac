import React, { useState } from 'react';

import { Logomark } from '@components/landing/Logo';
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from '@components/ui/command';
import { useUIStore } from '@context/ui.store';
import useWriteNextSentence from '@hooks/api/isaac/useWriteNextSentence';
import useGetProjectWithDocuments from '@hooks/api/useGetProjectWithDocuments';
import useDocumentTabs, { TabType } from '@hooks/useDocumentTabs';
import CitationCommand from '@lexical/plugins/CommandPlugin/CitationCommand';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createTextNode, $getSelection } from 'lexical';
import {
	FilePlus2,
	FileText,
	FolderSearch,
	HelpCircle,
	Library,
	StepForward,
} from 'lucide-react';

enum SubCommand {
	CITATION_COMMAND = 'CITATION_COMMAND',
}

export function CommandPlugin() {
	const setShowCreateDocumentModal = useUIStore(
		s => s.setShowCreateDocumentModal,
	);
	const setBrowseFileCommand = useUIStore(s => s.setBrowseFileCommand);

	const [activeSubCommand, setActiveSubCommand] = useState<SubCommand>();

	const [editor] = useLexicalComposerContext();
	const { writeNextSentence } = useWriteNextSentence(editor);

	const { currentProjectDocuments } = useGetProjectWithDocuments();
	const { openDocument } = useDocumentTabs();
	return (
		<>
			<CommandDialog>
				<CommandInput placeholder="Type a command or search..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup heading="Suggestions">
						{'!showEditorCommand.hideAIFunctions' && (
							<>
								<CommandItem
									onSelect={() => {
										editor.update(() => {
											const selection = $getSelection();
											selection.insertNodes([$createTextNode('$')]);
										});
									}}
								>
									<Logomark className="h-8 w-8 mr-2 fill-primary scale-125" />
									<span>Ask Isaac</span>
								</CommandItem>
								<CommandItem
									onSelect={v => {
										setActiveSubCommand(SubCommand.CITATION_COMMAND);
									}}
								>
									<Library className="mr-2 h-4 w-4" />
									<span>Cite Reference</span>
								</CommandItem>
								<CommandItem
									onSelect={() => {
										writeNextSentence();
									}}
								>
									<StepForward className="mr-2 h-4 w-4" />
									<span>Write Next Sentence</span>
								</CommandItem>
								<CommandItem
									onSelect={() =>
										editor.update(() => {
											const selection = $getSelection();
											selection.insertNodes([$createTextNode('@')]);
										})
									}
								>
									<HelpCircle strokeWidth={1.2} className="mr-2 h-4 w-4" />
									<span>Ask research question</span>
								</CommandItem>
							</>
						)}
						<CommandItem
							onSelect={() => {
								setBrowseFileCommand(true);
							}}
						>
							<FolderSearch
								className="mr-2 h-2 w-2 scale-[82%]"
								strokeWidth={1.2}
							/>
							<span>Browse Projects & Documents</span>
						</CommandItem>
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup
						heading={`Browse documents in ${currentProjectDocuments?.title}`}
					>
						<CommandItem
							onSelect={() => {
								setShowCreateDocumentModal(true);
							}}
						>
							<FilePlus2
								className="mr-2 h-2 w-2 scale-[80%]"
								strokeWidth={1.4}
							/>
							<span>Create New Document</span>
						</CommandItem>
						{currentProjectDocuments?.documents?.map(d => (
							<CommandItem
								key={d.id}
								onSelect={() => {
									openDocument({
										source: d.id,
										label: d.title,
										type: TabType.Document,
									});
								}}
							>
								<FileText
									className="mr-2 h-2 w-2 scale-[80%]"
									strokeWidth={1.4}
								/>
								<span>{d.title}</span>
							</CommandItem>
						))}
					</CommandGroup>
				</CommandList>
			</CommandDialog>

			{/* Sub-Commands */}
			<CitationCommand
				open={activeSubCommand === SubCommand.CITATION_COMMAND}
				setOpen={open => setActiveSubCommand(undefined)}
				onSelectCallback={() => {
					setActiveSubCommand(undefined);
				}}
			/>
		</>
	);
}

export default CommandPlugin;
