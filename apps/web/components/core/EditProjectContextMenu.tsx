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
import { Input } from '@components/ui/input';
import { useRenameProject } from '@resources/editor-page';
import useDeleteProject from '@hooks/api/useDeleteProject';
import { Pencil, Trash } from 'lucide-react';
import { ReactNode, useState } from 'react';

type Props = {
	projectName: string;
	children: ReactNode;
	projectId: string;
};

export default function EditProjectContextMenu({
	children,
	projectId,
	projectName,
}: Props) {
	const [openRenameDialog, setOpenRenameDialog] = useState(false);
	const [newProjectTitle, setNewProjectTitle] = useState(projectName);
	const { mutateAsync: deleteProject } = useDeleteProject();
	const { mutateAsync: mutateRenameProject } = useRenameProject({
		onSuccessCb: () => setNewProjectTitle(''),
	});

	const handleDelete = async (projectId) => {
    try {
      // Call the mutation function with the project ID
      await deleteProject(projectId);
      // Handle any additional logic after deletion, if necessary
    } catch (error) {
      // Handle error case
      console.error('Failed to delete project:', error);
    }
  };

	const handleRenameProject = () => {
		mutateRenameProject({
			projectId,
			newTitle: newProjectTitle,
		});
	};

	return (
		<>
			<ContextMenu>
				<ContextMenuTrigger>{children}</ContextMenuTrigger>
				<ContextMenuContent className=" w-48">
					<ContextMenuLabel className="text-xs">Edit Project</ContextMenuLabel>

					<ContextMenuItem
						onSelect={e => {
							setOpenRenameDialog(true);
						}}
					>
						<Pencil size={14} className="mr-4" />
						Rename Project
					</ContextMenuItem>

					<ContextMenuItem onClick={() => handleDelete(projectId)} className="text-red-700">
						<Trash size={14} className="mr-4" />
						Delete Project
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>

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
}
