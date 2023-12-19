// import ReferenceViewer from '@components/core/ReferenceViewer';
import ChatTab from '@components/chat/ChatTab';
import EditorEmptyState from '@components/editor/EditorEmptyState';
import AppLayout from '@components/editor/EditorLayout';
import LiteratureSearchTab from '@components/literature/LiteratureSearchTab';
import ReferenceListTab from '@components/literature/ReferenceListTab';
import { Grammarly } from '@grammarly/editor-sdk-react';
import useHandleToastQuery from '@hooks/misc/useHandleToastQuery';
import useDocumentTabs, { TabType } from '@hooks/useDocumentTabs';
import dynamic from 'next/dynamic';
import Head from 'next/head';

const Editor = dynamic(() => import('@lexical/Editor'));
const ReferenceViewer = dynamic(
	() => import('@components/core/ReferenceViewer'),
);
const EditorPage = () => {
	const { currentProjectTabs } = useDocumentTabs();
	// useInitializeUserUploads();
	useHandleToastQuery();

	return (
		<>
			<Head>
				<title>Isaac Editor - AI-first Text Editor For Academic Writing</title>
				<meta
					property="og:title"
					content="Isaac Editor - AI-first Text Editor For Academic Writing"
					key="title"
				/>
				<meta name="description" content="Isaac AI Editor Description" />
			</Head>
			<style>{`
        html,
        body {
          overflow: hidden;
        }
      `}</style>

			<AppLayout>
				<Grammarly clientId="client_3nkkHEbfsZ3j6Gh7QGNRts">
					{!currentProjectTabs?.length && <EditorEmptyState />}
					{currentProjectTabs?.map((tab, idx) => {
						if (tab.type === 'Document') {
							return (
								<Editor
									key={tab.source}
									documentId={tab.source}
									active={tab.active}
								/>
							);
						} else if (tab.type === 'SemanticScholar') {
							return (
								<ReferenceViewer
									active={tab.active}
									source={tab.source}
									key={tab.source}
									type={TabType.SemanticScholar}
									label={tab.label}
								/>
							);
						} else if (tab.type === 'UserUpload') {
							return (
								<ReferenceViewer
									active={tab.active}
									source={tab.source}
									key={tab.source}
									type={TabType.UserUpload}
									label={tab.label}
								/>
							);
						} else if (tab.type === 'LiteratureSearch') {
							return (
								<LiteratureSearchTab
									key={`lit-tab-${idx}`}
									active={tab.active}
								/>
							);
						} else if (tab.type === TabType.Chat) {
							return (
								<ChatTab
									key={`chat-tab-${idx}`}
									active={tab.active}
									sessionId={tab.source}
								/>
							);
						} else if (tab.type === TabType.SavedReference) {
							return (
								<ReferenceListTab
									key={TabType.SavedReference}
									active={tab.active}
								/>
							);
						}
					})}
				</Grammarly>
			</AppLayout>
		</>
	);
};

export default EditorPage;
