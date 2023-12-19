import { useUIStore } from '@context/ui.store';
import useGetProjectWithDocuments from '@hooks/api/useGetProjectWithDocuments';
import useDocumentTabs, { TabType } from '@hooks/useDocumentTabs';
import clsx from 'clsx';
import React from 'react';

const EditorEmptyState = () => {
	const { currentProjectDocuments, isLoading } = useGetProjectWithDocuments();
	const editorWidth = useUIStore(s => s.editorWidth);
	const { openDocument } = useDocumentTabs();
	return (
		<div className="flex flex-col">
			{isLoading === false && (
				<h1 className="text-center">{`${currentProjectDocuments?.title}`}</h1>
			)}

			<div
				className={clsx(
					'grid gap-5 my-10',
					editorWidth > 750
						? 'grid-cols-3'
						: editorWidth > 500
						? 'grid-cols-2'
						: 'grid-cols-1',
				)}
			>
				{isLoading && (
					<>
						<div></div>
						<div></div>
						<div></div>
					</>
				)}
				{!!currentProjectDocuments &&
					currentProjectDocuments?.documents?.map(doc => (
						<div
							onClick={() => {
								openDocument({
									source: doc.id,
									label: doc.title,
									type: TabType.Document,
									_projectId: currentProjectDocuments.id,
								});
							}}
							key={doc.id}
							className={clsx(
								'flex flex-col justify-between w-full h-[200px] p-3 border-t border-gray-100 rounded-md shadow-lg cursor-pointer hover:shadow-xl transition-all',
								'dark:border dark:border-gray-900 dark:hover:border-gray-600',
							)}
						>
							<p className="font-semibold">{doc.title}</p>
							<div className="text-sm opacity-75">
								{/* <p>333 words</p> */}
								{/* <p>Last opened {new Date(doc.createdAt).toDateString()}</p> */}
								<p>Created on {new Date(doc.created_at).toDateString()}</p>
							</div>
						</div>
					))}
			</div>
		</div>
	);
};

export default EditorEmptyState;
