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
import useCreateProject from '@hooks/api/useCreateProject';
import { Project } from '@hooks/api/useGetProjects';
import mixpanel from 'mixpanel-browser';
import { useRouter } from 'next/router';
import { memo, useState } from 'react';

export const CreateNewProjectModal = memo(() => {
	const [projectTitle, setProjectTitle] = useState('');
	const { push} = useRouter();
	const setCreateProjectPopoverOpen = useUIStore(
		s => s.setCreateProjectPopoverOpen,
	);
	const createProjectPopoverOpen = useUIStore(s => s.createProjectPopoverOpen);

	const { mutateAsync: mutateProject } = useCreateProject({
		createDocumentOnCreate: true,
		onSuccessCb: data => {
			setCreateProjectPopoverOpen(false);
			setProjectTitle('');
			push(`/editor/${data.id}`);
		},
	});

	const createProject = e => {
		e.preventDefault();
		if (projectTitle) {
			mutateProject(projectTitle);
			mixpanel.track('Project Created');
		} else {
			alert('Project Name Required');
		}
	};

	return (
		<Dialog
			open={createProjectPopoverOpen}
			onOpenChange={setCreateProjectPopoverOpen}
		>
			<DialogContent className="sm:max-w-[425px]">
				<form className="flex flex-col gap-4" onSubmit={createProject}>
					<DialogHeader>
						<DialogTitle>Create new project</DialogTitle>
					</DialogHeader>
					<Input
						id="name"
						placeholder='e.g. "AI for scientific discovery "'
						value={projectTitle}
						className="col-span-3 my-2"
						onChange={e => setProjectTitle(e.target.value)}
					/>

					<DialogFooter>
						<Button type="submit">Create project</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
});

export default CreateNewProjectModal;
