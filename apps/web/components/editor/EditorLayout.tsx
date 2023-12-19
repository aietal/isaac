import BottomLeftFab from '@components/BottomLeftFab';
import AppMenuBar from '@components/editor/AppMenuBar';
import EditorBottomRightFab from '@components/editor/EditorBottomRightFab';
import { EquationModal } from '@components/editor/EquationModal';
import { SideBarWidth, useUIStore } from '@context/ui.store';
import { useUser } from '@context/user';
import { useBreakpoint } from '@hooks/misc/useBreakPoint';
import useAuthRedirect from '@hooks/useAuthRedirect';
import useDocumentTabs, { paperTypeTabs } from '@hooks/useDocumentTabs';
import useEditorShortcut from '@hooks/useEditorShortcut';
import { useElementSize } from '@mantine/hooks';
import { useGetProjects } from '@resources/editor-page';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import clsx from 'clsx';
import { headerHeight } from 'data/style.data';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { ReactNode, useEffect } from 'react';
import Sidebar from './Sidebar';

type Props = {
	children: ReactNode; // dedicated for the content in the middle
};

const FeedbackModal = dynamic(() => import('../core/FeedbackModal'), {
	ssr: false,
});

const DiscordBanner = dynamic(() => import('../DiscordBanner'), {
	ssr: false,
});
const CreateNewDocumentModal = dynamic(
	() => import('../core/CreateNewDocumentModal'),
	{
		ssr: false,
	},
);
const UpdateUploadedMetaModal = dynamic(
	() => import('../literature/UpdateUploadedMetaModal'),
	{
		ssr: false,
	},
);

const AppHeader = dynamic(() => import('../AppHeader'), {
	ssr: false,
});

const ProductGuideModal = dynamic(() => import('../core/ProductGuideModal'), {
	ssr: false,
});

const EditorTabs = dynamic(() => import('./EditorTabs'), {
	ssr: false,
});

const CreateNewProjectModal = dynamic(
	() => import('../core/CreateNewProjectModal'),
	{
		ssr: false,
	},
);

/*
 * Layout Component for Editor page that would contain the sidebar
 */
const EditorLayout = ({ children }: Props) => {
	useAuthRedirect();
	useEditorShortcut();

	const { activeDocument } = useDocumentTabs();
	const { user } = useUser();
	const { ref: editorRef, width: editorWidth } = useElementSize();
	const { width: editorMobileWidth } = useElementSize();
	const { isAboveMd, isBelowMd } = useBreakpoint('md');
	const { data: projects, isLoading: isGetProjectsLoading } =
		useGetProjects(user);

	const uiStore = useUIStore(s => ({
		activePanel: s.activePanel,
		activeSidebar: s.activeSidebar,
		showDocumentComments: s.showDocumentComments,
		setEditorWidth: s.setEditorWidth,
		setTop: s.setEditorScrollTop,
	}));

	// Initialize analytics & user
	useEffect(() => {
		if (user) {
			import('mixpanel-browser').then(mixpanel => {
				mixpanel.identify(user?.id);
				mixpanel.people.set_once({
					Email: user?.email,
					'First Login Date': new Date(),
				});
				mixpanel.people.set({
					'Last Login Date': new Date(),
				});
			});
		}
	}, [user]);
	// Updates the width to the store
	useEffect(() => {
		uiStore.setEditorWidth(editorWidth || editorMobileWidth);
	}, [editorWidth, editorMobileWidth]);

	const hasProjects = projects && projects.length > 0;

	return (
		<>
			{isGetProjectsLoading ? (
				<div className="flex h-screen justify-center items-center w-screen">
					<div className="inline-flex items-center text-muted-foreground">
						<Loader2 strokeWidth={1.2} size={30} className="animate-spin"/><span className="ml-2 text-2xl"> Loading...</span>
					</div>
				</div>
			) : (
				<>
					{user?.has_seen_community_banner ?? true ? null : (
						<DiscordBanner user={user} />
					)}
					<main className={clsx(' dark:bg-black bg-white h-screen')}>
						{/* Main Header */}
						{hasProjects && <AppHeader />}
						<div className="flex">
							{/* FABS & Modals */}
							<UpdateUploadedMetaModal />
							<CreateNewDocumentModal />
							<CreateNewProjectModal />
							<EquationModal />
							<ProductGuideModal />
							<FeedbackModal userEmail={user?.email} />

							{/* Desktop workspace */}
							<div
								className="flex-grow"
								style={{
									height: `calc(100vh - ${headerHeight}px)`,
								}}
							>
								<div className="flex flex-col-reverse  w-full h-full lg:flex md:flex-row flex-nowrap ">
									{hasProjects && <AppMenuBar />}
									<Allotment separator={false} className="allotment">
										{hasProjects && (
											<Allotment.Pane
												preferredSize={isAboveMd ? 400 : undefined}
												minSize={isAboveMd ? 250 : undefined}
												maxSize={isAboveMd ? 550 : 1000}
												visible={!!uiStore.activePanel}
												className={clsx(
													'flex z-30 w-full border-r border-border h-full bg-white dark:bg-black ',
												)}
											>
												<Sidebar />
											</Allotment.Pane>
										)}

										{/* Editor */}
										<Allotment.Pane
											visible={
												!(isBelowMd && uiStore.activePanel !== undefined)
											}
											className={clsx(
												'flex flex-col w-full h-full bg-white dark:bg-black',
											)}
										>
											{isAboveMd && hasProjects && <EditorTabs />}
											<EditorBottomRightFab />
											<div
												id="scrollable-editor-container"
												onScroll={e => {
													// eslint-disable-next-line @typescript-eslint/ban-ts-comment
													// @ts-ignore
													uiStore.setTop(e.target.scrollTop);
												}}
												className="scrollbar-hide relative flex justify-center w-full h-[calc(100vh-60px)] !overflow-y-scroll px-2 !overflow-x-hidden"
											>
												<div
													ref={editorRef}
													className={clsx(
														'w-full h-full pt-8 px-2 sm:px-4',
														uiStore.activePanel ? 'md:px-10' : 'md:px-16',
														paperTypeTabs.includes(activeDocument?.type)
															? uiStore.showDocumentComments
																? 'max-w-[68rem]'
																: 'max-w-5xl'
															: 'max-w-[90rem]',
														uiStore.activePanel &&
															paperTypeTabs.includes(activeDocument?.type) &&
															'mr-[0] sm:mr-[2vw] md:mr-[3vw] lg:mr-[4vw] xl:mr-[6vw]',
													)}
												>
													{children}
												</div>
											</div>
										</Allotment.Pane>

										{/* AI Panel */}
									</Allotment>
								</div>
							</div>
						</div>
					</main>
				</>
			)}
		</>
	);
};

export default EditorLayout;
