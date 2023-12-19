import { Button } from '@components/ui/button';
import { Checkbox } from '@components/ui/checkbox';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@components/ui/dialog';
import { Input } from '@components/ui/input';
import { useUIStore } from '@context/ui.store';
import useCreateDocument from '@hooks/api/useCreateDocument';
import useGetProjectWithDocuments from '@hooks/api/useGetProjectWithDocuments';
import useDocumentTabs, { TabType } from '@hooks/useDocumentTabs';
import { size, words } from 'lodash';
import { useRouter } from 'next/router';
import { memo, useEffect, useMemo, useState } from 'react';

export const CreateNewDocumentModal = memo(() => {
	const { currentProjectDocuments } = useGetProjectWithDocuments();
	const [docTitle, setDocTitle] = useState('');
	const setShowCreateDocumentModal = useUIStore(
		s => s.setShowCreateDocumentModal,
	);
	const [includeHeader, setIncludeHeader] = useState(false);
	const [showCreateDocumentModal, defaultTitle] = useUIStore(
		s => s.showCreateDocumentModal,
	);
	const { openDocument } = useDocumentTabs();
	const { push, asPath } = useRouter();

	const { mutateAsync: createDocument } = useCreateDocument({
		onSuccessCb: async data => {
			setShowCreateDocumentModal(false);
			openDocument({
				source: data.id,
				type: TabType.Document,
				label: data.title,
			});
			if (includeHeader) {
				push(`${asPath}?generate-header=true`);
			}
			setIncludeHeader(false);
			setDocTitle('');
		},
	});

	const wordCount = useMemo(() => size(words(docTitle)), [docTitle]);

	// Create default title
	useEffect(() => {
		if (defaultTitle) {
			setDocTitle(defaultTitle);
		}
	}, [defaultTitle]);

	return (
		<Dialog
			open={showCreateDocumentModal}
			onOpenChange={setShowCreateDocumentModal}
		>
			<DialogContent className="sm:max-w-[425px]">
				<form
					className="flex flex-col gap-4"
					onSubmit={e => {
						e.preventDefault();
						createDocument({
							projectId: currentProjectDocuments?.id,
							docTitle,
						});
					}}
				>
					<DialogHeader>
						<DialogTitle>Create new document</DialogTitle>
						<DialogDescription className="text-muted-foreground">
							Add to project: &ldquo;
							<strong>{currentProjectDocuments?.title}</strong>&ldquo;
						</DialogDescription>
					</DialogHeader>
					<Input
						id="name"
						placeholder='e.g. "The impact of AI on scientific research"'
						value={docTitle}
						className="col-span-3 my-2"
						onChange={e => setDocTitle(e.target.value)}
					/>
					<div className="flex items-start space-x-2">
						<Checkbox
							id="include-outline"
							className="mt-0.5"
							disabled={wordCount < 5}
							onCheckedChange={check => setIncludeHeader(check as boolean)}
						/>
						<label htmlFor="include-outline" className="text-sm">
							<p className="mb-1 text-medium">
								Auto-generate outline from title
							</p>
							<p className="text-muted-foreground">
								Min. words in title: {wordCount}/5
							</p>
						</label>
					</div>
					<DialogFooter>
						<Button type="submit">Create document</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
});

export default CreateNewDocumentModal;
