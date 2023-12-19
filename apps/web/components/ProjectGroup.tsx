import { useUIStore } from '@context/ui.store';
import useGetProjectWithDocuments from '@hooks/api/useGetProjectWithDocuments';
import { useBreakpoint } from '@hooks/misc/useBreakPoint';
import useDocumentTabs, { TabType } from '@hooks/useDocumentTabs';
import useGetEditorRouter from '@hooks/useGetEditorRouter';
import { useTour } from '@reactour/tour';
import { isDocumentEmpty } from '@utils/misc';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { File, FileText, Folder, FolderOpen } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';

import EditDocumentContextMenu from '@components/core/EditDocumentContextMenu';
import EditProjectContextMenu from '@components/core/EditProjectContextMenu';
import DocumentTableOfContent from '@components/DocumentTableOfContent';
import { Button } from '@components/ui/button';
import { ScrollArea } from '@components/ui/scroll-area';
import EditProjectDropdown from './core/EditProjectDropdown';

const folderVariants = {
	open: {
		height: 'auto',
		opacity: 1,
		transition: {
			duration: 0.3,
			ease: 'easeInOut',
			staggerChildren: 0.1,
		},
	},
	closed: {
		height: 0,
		opacity: 0,
		transition: {
			duration: 0.3,
			ease: 'easeInOut',
		},
	},
};

const documentVariants = {
	open: {
		opacity: 1,
		transition: {
			duration: 0.3,
		},
	},
	closed: {
		opacity: 0,
		transition: {
			duration: 0.3,
		},
	},
};

const ProjectGroup = () => {
	const { push } = useRouter();
	const { isOpen: tutorialMode, setCurrentStep, currentStep } = useTour();
	const { projectId: activeProjectId } = useGetEditorRouter();
	const { openDocument, activeDocument } = useDocumentTabs();
	const { projectDocuments } = useGetProjectWithDocuments();

	const setShowCreateDocumentModal = useUIStore(
		s => s.setShowCreateDocumentModal,
	);
	const openPanel = useUIStore(s => s.openPanel);

	// const [isDragging, setIsDraging] = useState(false);
	const isDragging = false;

	const openProject = useCallback(
		(projectId: string) => {
			push(`/editor/${projectId}`);
		},
		[push],
	);

	const projectDocumentsMemo = useMemo(
		() => projectDocuments,
		[projectDocuments],
	);

	const { isBelowMd } = useBreakpoint('md');

	return (
		<ScrollArea
			id="all-projects"
			className="flex-1 flex-grow h-[30vh] md:h-[45vh] lg:max-h-[80vh] flex flex-col gap-1"
		>
			{projectDocumentsMemo?.length > 0 ? (
				projectDocumentsMemo.map(project => (
					<div key={project.id} className="w-full">
						<EditProjectContextMenu
							projectId={project.id}
							projectName={project.title}
						>
							<Button
								onClick={() => {
									openProject(project.id);
								}}
								variant="ghost"
								size="sm"
								className={clsx(
									'leading-none block pl-3 pr-2 text-sm cursor-pointer rounded-none w-full',
								)}
							>
								<div className="flex justify-left group items-center">
									{(activeProjectId === project.id && (
										<FolderOpen size={15} strokeWidth={1.4} />
									)) || <Folder size={15} strokeWidth={1.4} />}

									<p
										className={clsx(
											'ml-[9px] font-normal line-clamp-1 max-w-[200px]',
											activeProjectId === project.id && 'font-medium ',
										)}
									>
										{project.title}
									</p>

									{isBelowMd && (
										<EditProjectDropdown
											className={clsx(
												'absolute right-0 w-8',
												activeProjectId === project.id ? 'visible' : 'hidden',
											)}
											projectId={project.id}
											projectName={project.title}
										/>
									)}
								</div>
							</Button>
						</EditProjectContextMenu>

						<AnimatePresence>
							{!isDragging && activeProjectId === project.id && (
								<motion.div
									id={`created-documents`}
									variants={folderVariants}
									initial="closed"
									exit="closed"
									animate={activeProjectId === project.id ? 'open' : 'closed'}
									className="flex flex-col gap-px"
								>
									<div>
										{project.documents?.map(_document => {
											const isActiveDoc =
												_document.id === activeDocument?.source;
											return (
												<EditDocumentContextMenu
													documentName={_document.title}
													documentId={_document.id}
													key={_document.id}
												>
													<motion.div
														variants={documentVariants}
														initial="closed"
														exit="closed"
														animate={
															activeProjectId === project.id ? 'open' : 'closed'
														}
														onClick={() => {
															openProject(project.id);
															openDocument({
																source: _document.id,
																label: _document.title,
																type: TabType.Document,
																_projectId: project.id,
															});
															isBelowMd && openPanel(undefined);
														}}
														className={clsx(
															'leading-none flex py-2 pr-2 pl-4 text-sm cursor-pointer rounded-md mx-3 hover:bg-accent hover:text-accent-foreground',
															isActiveDoc && 'text-isaac',
														)}
													>
														{isDocumentEmpty(_document.text) ? (
															<File
																strokeWidth={1.4}
																className="mr-[9px]"
																size={14}
															/>
														) : (
															<FileText
																strokeWidth={1.4}
																className="mr-[9px]"
																size={14}
															/>
														)}
														<p className="line-clamp-1">{_document.title}</p>
													</motion.div>
													{isActiveDoc && <DocumentTableOfContent />}
												</EditDocumentContextMenu>
											);
										})}
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				))
			) : (
				<div className="flex flex-col items-center justify-center p-3 text-center">
					<span className="text-xs text-muted-foreground mb-px h-8 leading-none block p-2  w-full">
						{' '}
						Create your first project{' '}
					</span>
				</div>
			)}
		</ScrollArea>
	);
};

export default React.memo(ProjectGroup);
