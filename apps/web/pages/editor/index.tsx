import EditorLayout from '@components/editor/EditorLayout';
import { Logomark } from '@components/landing/Logo';
import { Button } from '@components/ui/button';
import Ripple from '@components/ui/ripple';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@components/ui/select';
import { Skeleton } from '@components/ui/skeleton';
import { useUIStore } from '@context/ui.store';
import { useUser } from '@context/user';
import useHandleToastQuery from '@hooks/misc/useHandleToastQuery';
import {} from '@radix-ui/react-select';
import { useGetProjects } from '@resources/editor-page';
import clsx from 'clsx';
import { FolderPlus, Loader2 } from 'lucide-react';
import Head from 'next/head';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';

const EditorHead = () => (
	<Head>
		<title>Isaac Editor - AI-first Text Editor For Academic Writing</title>
		<meta
			property="og:title"
			content="Isaac Editor - AI-first Text Editor For Academic Writing"
			key="title"
		/>
		<meta name="description" content="Isaac AI Editor Description" />
	</Head>
);

const editorPageStyle = `
	html, body { overflow: hidden; }
`;

const EditorPage = () => {
	const { user } = useUser();
	const { data: projects, isLoading: isGetProjectsLoading } =
		useGetProjects(user);
	const editorWidth = useUIStore(s => s.editorWidth);
	const setCreateNewProjectModalOpen = useUIStore(
		s => s.setCreateProjectPopoverOpen,
	);
	useHandleToastQuery();

	const projectGridClasses = useMemo(
		() =>
			clsx(
				'grid gap-5 my-10',
				editorWidth > 750
					? 'grid-cols-3'
					: editorWidth > 500
					? 'grid-cols-2'
					: 'grid-cols-1',
			),
		[editorWidth],
	);

	const [sortMethod, setSortMethod] = useState('lastOpened'); // Default sort method
	const [sortedProjects, setSortedProjects] = useState([]);

	useEffect(() => {
		if (projects) {
			const sorted = [...projects];
			switch (sortMethod) {
				case 'lastOpened':
					sorted.sort(
						(a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at),
					);
					break;
				case 'recentlyCreated':
					sorted.sort(
						(a, b) => +new Date(b.created_at) - +new Date(a.created_at),
					);
					break;
				case 'name':
					sorted.sort((a, b) => a.title.localeCompare(b.title));
					break;
				default:
					break;
			}
			setSortedProjects(sorted);
		}
	}, [projects, sortMethod]);

	const handleSortChange = value => {
		setSortMethod(value);
	};

	const renderedProjects = useMemo(
		() =>
			sortedProjects.map(project => (
				<Link href={`/editor/${project.id}`} key={project.id} prefetch={false}>
					<div
						className={clsx(
							'flex flex-col justify-between w-full h-[200px] p-3 border-t border-gray-100 rounded-md shadow-lg cursor-pointer hover:shadow-xl transition-all dark:border dark:border-gray-900 dark:hover:border-gray-600',
						)}
					>
						<p className="font-semibold">{project.title}</p>
						<div className="text-sm opacity-75">
							{/* TODO: This doesnt seem to work */}
							{/* <p>Last opened {new Date(project.updated_at).toDateString()}</p> */}
							<p>Created on {new Date(project.created_at).toDateString()}</p>
						</div>
					</div>
				</Link>
			)),
		[sortedProjects],
	);

	const projectsLoadedAndEmpty = useMemo(() => !isGetProjectsLoading && projects?.length === 0, [
		isGetProjectsLoading,
		projects,
	]);

	return (
		<>
			<EditorHead />
			<style>{editorPageStyle}</style>
			<EditorLayout>
				{!projectsLoadedAndEmpty ? (
					<div className="w-full">
						<h1 className="text-center text-foreground">Projects</h1>

						<Select onValueChange={handleSortChange}>
							<SelectTrigger className={clsx('w-[240px] mx-auto my-10')}>
								<SelectValue placeholder="Recently created" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{/* <SelectItem value="lastOpened">Last Opened</SelectItem> */}
									<SelectItem value="recentlyCreated">
										Recently created
									</SelectItem>
									<SelectItem value="name">Name</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>

						<div className={projectGridClasses}>{renderedProjects}</div>
					</div>
				) : (
					<div className="flex h-screen flex-col items-center mx-auto justify-center text-center">
						<div className="inline-flex items-center text-center mb-4 fixed top-96 ">
							<Logomark className="w-12 h-12" />
							<p className="text-2xl font-bold tracking-tighter text-foreground">
								Isaac
							</p>
						</div>

						<Button
							size="lg"
							className="z-10 bg-isaac hover:bg-white hover:text-isaac mt-6"
							onClick={() => setCreateNewProjectModalOpen(true)}
						>
							<FolderPlus className="mr-2 " strokeWidth={1.2} size={20} />
							Create your first project
						</Button>
						<div className="mt-4">
							<p className="text-sm text-foreground mt-3">
								A project in Isaac is a workspace for your documents,
								references, and notes. Get started now!
							</p>
						</div>
						<Ripple />
					</div>
				)}
			</EditorLayout>
		</>
	);
};

const LoadingPlaceholder = () => {
	const placeholderItems = Array.from({ length: 12 }).map((_, index) => (
		<div
			key={index}
			className="w-full h-[200px] p-3 border-t border-gray-100 rounded-md shadow-lg"
		>
			<Skeleton className="w-full h-full" />
		</div>
	));

	return <>{placeholderItems}</>;
};

export default EditorPage;
