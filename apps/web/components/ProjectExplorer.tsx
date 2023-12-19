import ProjectGroup from '@components/ProjectGroup';
import { Button } from '@components/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@components/ui/tooltip';
import { useUIStore } from '@context/ui.store';
import useGetEditorRouter from '@hooks/useGetEditorRouter';
import { useTour } from '@reactour/tour';
import clsx from 'clsx';
import { FilePlus, FolderPlus } from 'lucide-react';
import React, { memo } from 'react';

const ProjectExplorer = memo(() => {
	const setCreateProjectPopoverOpen = useUIStore(
		s => s.setCreateProjectPopoverOpen,
	);
	const setShowCreateDocumentModal = useUIStore(
		s => s.setShowCreateDocumentModal,
	);

	const { isOpen: tutorialMode, setCurrentStep } = useTour();
	const { projectId: activeProjectId } = useGetEditorRouter();
	return (
		<nav
			className={clsx(
				'relative z-20 flex flex-col h-full',
				'dark:bg-black bg-white',
			)}
		>
			<div className="flex items-center justify-between p-3">
				<p className="text-sm font-semibold text-foreground">Projects</p>
				<div className="inline-flex items-center gap-0.5">
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								size="icon"
								variant="ghost"
								className="w-6 h-6"
								onClick={() => {
									setCreateProjectPopoverOpen(true);
									tutorialMode && setCurrentStep(prev => prev + 1);
								}}
							>
								<FolderPlus size={16} strokeWidth={1.2} />
							</Button>
						</TooltipTrigger>
						<TooltipContent side="right">
							<p>New project </p>
						</TooltipContent>
					</Tooltip>

					{activeProjectId && (
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									size="icon"
									variant="ghost"
									className="w-6 h-6"
									onClick={() => {
										setShowCreateDocumentModal(true);
									}}
								>
									<FilePlus size={16} strokeWidth={1.2} />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="right">
								<p>New document </p>
							</TooltipContent>
						</Tooltip>
					)}
				</div>
			</div>
			<ProjectGroup />
		</nav>
	);
});

export default ProjectExplorer;
