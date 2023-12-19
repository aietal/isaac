import useDocumentTabs, { TabType } from '@hooks/useDocumentTabs';
import useGetSupabaseSignedUrl from '@hooks/useGetSupabaseSignedUrl';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import React from 'react';
import DocsViewer from './DocsViewer';
import ImageViewer from './ImageViewer';
import TextFilesViewer from './TextFilesViewer';

export const PDF = dynamic(() => import('./PDF'), {
	ssr: false,
});

type Props = {
	source: string;
	type: TabType;
	active: boolean;
	label: string;
};

const proxyUrl = 'https://isaac-cors-anywhere.fly.dev/';

const ReferenceViewer = ({ source, type, active, label }: Props) => {
	const { data: signedUrl } = useGetSupabaseSignedUrl(
		type === 'UserUpload' ? source : undefined,
	);

	const extension = label.split('.').pop().toLowerCase();

	let viewer;
	if (
		signedUrl &&
		(extension === 'jpg' || extension === 'png' || extension === 'jpeg')
	) {
		viewer = <ImageViewer path={signedUrl} />;
	} else if (
		['csv', 'tsv', 'eml', 'msg', 'rtf', 'html', 'xml'].includes(extension)
	) {
		viewer = <TextFilesViewer path={signedUrl} />;
	} else if (['docx', 'doc', 'odt', 'pptx', 'xlsx'].includes(extension)) {
		viewer = <DocsViewer path={signedUrl} />;
	} else if (extension === 'pdf' && type === 'UserUpload' && signedUrl) {
		viewer = <PDF path={signedUrl} />;
	} else if (type === 'SemanticScholar') {
		viewer = <PDF path={proxyUrl + source} />;
	}

	return <div className={clsx(active ? 'block' : 'hidden')}>{viewer}</div>;
};

export default ReferenceViewer;
