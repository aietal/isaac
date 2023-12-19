import { Button } from '@components/ui/button';
import {
	ContextMenu,
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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import { Input } from '@components/ui/input';
import { useUIStore } from '@context/ui.store';
import { useRenameProject } from '@resources/editor-page';
import {
	CornerDownRight,
	MoreVertical,
	Pencil,
	Plus,
	Trash,
} from 'lucide-react';
import { useState } from 'react';
import useDeleteProject from '@hooks/api/useDeleteProject';

type Props = {
	projectName: string;
	projectId: string;
	className: string;
};

const EditProjectDropdown = ({ projectId, projectName, className }: Props) => {
	const [openRenameDialog, setOpenRenameDialog] = useState(false);
	const [newProjectTitle, setNewProjectTitle] = useState(projectName);
	const { mutate: deleteProject, isLoading, isError } = useDeleteProject();
	const { mutateAsync: mutateRenameProject } = useRenameProject({
		onSuccessCb: () => setNewProjectTitle(''),
	});

	const deleteProjectFunction = () => {
		if (confirm('Are you sure you want to delete this project?')) {
			deleteProject(projectId);
		}
	};
	const setShowCreateDocumentModal = useUIStore(
		s => s.setShowCreateDocumentModal,
	);

	const handleRenameProject = () => {
		mutateRenameProject({
			projectId,
			newTitle: newProjectTitle,
		});
	};
	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<MoreVertical strokeWidth={1} size={16} className={className} />
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" alignOffset={10} sideOffset={5}>
					<DropdownMenuItem
						onSelect={e => {
							setShowCreateDocumentModal(true);
						}}
					>
						<Plus size={14} className="mr-4" strokeWidth={1.4} />
						Add Document
					</DropdownMenuItem>
					<DropdownMenuItem
						onSelect={e => {
							setOpenRenameDialog(true);
						}}
					>
						<Pencil size={14} className="mr-4" />
						Rename Project
					</DropdownMenuItem>

					<DropdownMenuItem onClick={deleteProjectFunction} className="text-destructive">
						<Trash size={14} className="mr-4" />
						Delete Project
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<Dialog open={openRenameDialog} onOpenChange={setOpenRenameDialog}>
				<DialogContent className="sm:max-w-[425px]">
					<form
						className="flex flex-col gap-4"
						onSubmit={e => {
							e.preventDefault();
							handleRenameProject();
							setOpenRenameDialog(false);
						}}
					>
						<DialogHeader>
							<DialogTitle>Rename Project</DialogTitle>
						</DialogHeader>
						<Input
							id="name"
							value={newProjectTitle}
							className="col-span-3"
							onChange={e => setNewProjectTitle(e.target.value)}
						/>
						<DialogFooter>
							<Button type="submit">Create</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default EditProjectDropdown;
