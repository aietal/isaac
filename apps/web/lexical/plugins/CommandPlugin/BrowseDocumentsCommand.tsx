import React from 'react';

import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@components/ui/command';
import { useUIStore } from '@context/ui.store';
import useGetProjectWithDocuments from '@hooks/api/useGetProjectWithDocuments';
import useDocumentTabs, { TabType } from '@hooks/useDocumentTabs';
import { FileText } from 'lucide-react';
import { useRouter } from 'next/router';

export function BrowseDocumentsCommand() {
	const setBrowseFileCommand = useUIStore(s => s.setBrowseFileCommand);
	const browseFileCommand = useUIStore(s => s.browseFileCommand);
	const { push } = useRouter();
	const { openDocument } = useDocumentTabs();

	const { projectDocuments } = useGetProjectWithDocuments();

	const handleSelect = (
		projectId: string,
		documentId: string,
		documentTitle: string,
	) => {
		setBrowseFileCommand(false);
		openDocument({
			source: documentId,
			label: documentTitle,
			type: TabType.Document,
			_projectId: projectId,
		});
		push(`/editor/${projectId}`);
	};

	return (
		<>
			<CommandDialog
				open={browseFileCommand}
				onOpenChange={setBrowseFileCommand}
			>
				<CommandInput placeholder="Search document..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					{projectDocuments
						?.sort((a, b) => a.title.localeCompare(b.title))
						?.map(project => (
							<CommandGroup key={project.id} heading={project.title}>
								{project.documents?.map(doc => (
									<CommandItem
										key={doc.id}
										onSelect={() => handleSelect(project.id, doc.id, doc.title)}
									>
										<FileText
											className="mr-2 h-2 w-2 scale-[80%]"
											strokeWidth={1.4}
										/>
										<span className="hidden">{project.title} </span>
										<span className="ml-4">{doc.title}</span>
									</CommandItem>
								))}
							</CommandGroup>
						))}
				</CommandList>
			</CommandDialog>
		</>
	);
}

export default BrowseDocumentsCommand;
