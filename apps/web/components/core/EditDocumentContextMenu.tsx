import { Button } from '@components/ui/button';
import {
	ContextMenu,
	ContextMenuCheckboxItem,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuLabel,
	ContextMenuTrigger,
} from '@components/ui/context-menu';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@components/ui/dialog';
import { Input } from '@components/ui/input';
import useDeleteDocument from '@hooks/api/useDeleteDocument';
import { useRenameDocument } from '@resources/editor-page';
import { Pencil, Trash } from 'lucide-react';
import { ReactNode, useState } from 'react';

type Props = {
	documentName: string;
	children: ReactNode;
	documentId: string;
};

export default function EditDocumentContextMenu({
	children,
	documentId,
	documentName,
}: Props) {
	const [openRenameDialog, setOpenRenameDialog] = useState(false);
	const [newDocumentTitle, setNewDocumentTitle] = useState(documentName);
	const { mutateAsync: mutateDeleteDocument } = useDeleteDocument();
	const { mutateAsync: mutateRenameDocument } = useRenameDocument({
		onSuccessCb: () => setNewDocumentTitle(''),
	});

	const deleteDocument = () => {
		if (confirm('Are you sure you want to delete this document?')) {
			mutateDeleteDocument(documentId);
		}
	};

	const handleRenameDocument = () => {
		mutateRenameDocument({
			docId: documentId,
			newTitle: newDocumentTitle,
		});
	};

	return (
		<>
			<ContextMenu>
				<ContextMenuTrigger>{children}</ContextMenuTrigger>
				<ContextMenuContent className=" w-48">
					<ContextMenuLabel className="text-xs">Edit Document</ContextMenuLabel>

					<ContextMenuItem
						onSelect={e => {
							setOpenRenameDialog(true);
						}}
					>
						<Pencil size={14} className="mr-4" />
						Rename Document
					</ContextMenuItem>

					<ContextMenuItem onClick={deleteDocument} className="text-red-700">
						<Trash size={14} className="mr-4" />
						Delete Document
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>

			<Dialog open={openRenameDialog} onOpenChange={setOpenRenameDialog}>
				<DialogContent className="sm:max-w-[425px]">
					<form
						className="flex flex-col gap-4"
						onSubmit={e => {
							e.preventDefault();
							handleRenameDocument();
							setOpenRenameDialog(false);
						}}
					>
						<DialogHeader>
							<DialogTitle>Rename Document</DialogTitle>
						</DialogHeader>
						<Input
							id="name"
							value={newDocumentTitle}
							className="col-span-3"
							onChange={e => setNewDocumentTitle(e.target.value)}
						/>
						<DialogFooter>
							<Button type="submit">Create</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
}
