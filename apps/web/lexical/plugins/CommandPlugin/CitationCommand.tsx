import { useEffect, useRef } from 'react';

import { ReferenceTypeIconsMap } from '@components/core/IconMap';
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@components/ui/command';
import useLexicalEditorStore from '@context/lexicalEditor.store';
import { useLiteratureReferenceStore } from '@context/literatureReference.store';
import useCitationStyle from '@hooks/api/isaac/useCitationStyle';
import useGetEditorRouter from '@hooks/useGetEditorRouter';
import { $createCitationNode } from '@lexical/nodes/CitationNode';
import { useGetReference } from '@resources/editor-page';
import { generateCitation } from '@utils/citation';
import { supabase } from '@utils/supabase';
import { $createTextNode, $getSelection, $isRangeSelection } from 'lexical';
import { Book, BookUp } from 'lucide-react';
import { CitationData, UploadedFile } from 'types/literatureReference.type';

type Props = {
	open: boolean;
	setOpen: (bool: boolean) => void;
	onSelectCallback?: () => void;
};

export function CitationCommand({ open, setOpen, onSelectCallback }: Props) {
	const { projectId } = useGetEditorRouter();
	const { data: references } = useGetReference(projectId);
	const userUploadsRef = useRef<UploadedFile[]>([]);

	const editor = useLexicalEditorStore(s => s.activeEditor);
	const { citationStyle } = useCitationStyle();

	useEffect(() => {
		async function fetchMyAPI() {
			const { data: uploads } = await supabase
				.from('uploads')
				.select('*')
				.eq('project_id', projectId);
			const fileList: UploadedFile[] = uploads?.map(file => ({
				id: file.id,
				file_name: file.file_name,
				status: file.status,
				created_at: file.created_at,
				citation: file.citation,
				custom_citation: file.custom_citation,
				abstract: file.abstract ? file.abstract : null,
				tldr: file.tldr ? file.tldr : null,
			})) || [];
			userUploadsRef.current = fileList;
		}
		if (!userUploadsRef.current.length) {
			fetchMyAPI();
		}
	}, [projectId]);

	const onSelectOption = async (citation: CitationData) => {
		editor.focus();

		editor.update(() => {
			const selection = $getSelection();
			if (!$isRangeSelection(selection)) {
				return;
			}

			selection.insertNodes([
				$createCitationNode(citation, true),
				$createTextNode(' '),
			]);

			onSelectCallback?.();
		});
	};

	return (
		<>
			<CommandDialog
				open={open}
				onOpenChange={open => {
					setOpen(open);
					editor.focus();
				}}
			>
				<CommandInput placeholder="Search citation..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup heading="From Reference">
						{references?.map((r, i) => {
							const Icon = ReferenceTypeIconsMap[r.type] || Book;
							return (
								<CommandItem
									key={r.id}
									onSelect={() =>
										onSelectOption({
											...r,
											sourceType: 'reference',
											index: i + 1,
										})
									}
								>
									<div className="h-4 w-4 text-foreground">
										<Icon strokeWidth={1.2} size={12} />
									</div>
									<span className="ml-4">
										{generateCitation(
											{
												...r,
												index: i + 1,
												sourceType: 'reference',
											},
											citationStyle,
											undefined,
											false,
										)}
									</span>
								</CommandItem>
							);
						})}
					</CommandGroup>
					<CommandGroup heading="From Uploaded Documents">
						{userUploadsRef.current?.map((r, i) => (
							<CommandItem
								key={r.id}
								onSelect={() =>
									onSelectOption({
										title: r.custom_citation?.title || r.file_name,
										year: r.custom_citation?.year.toString(),
										authors: Array.isArray(r.custom_citation?.authors)
											? r.custom_citation?.authors.map(i => ({ name: i }))
											: [],
										id: r.id,
										index: i + 1,
										sourceType: 'userUpload',
									})
								}
							>
								<div className="h-4 w-4">
									<BookUp className="text-foreground" size={12} />
								</div>
								<span className="ml-4">
									{generateCitation(
										{
											title: r.custom_citation?.title || r.file_name,
											year: r.custom_citation?.year.toString(),
											authors: Array.isArray(r.custom_citation?.authors)
												? r.custom_citation?.authors.map(i => ({ name: i }))
												: [],
											id: r.id,
											index: i + 1,
											sourceType: 'userUpload',
										},
										citationStyle,
										undefined,
										false,
									)}
								</span>
							</CommandItem>
						))}
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>
	);
}

export default CitationCommand;
