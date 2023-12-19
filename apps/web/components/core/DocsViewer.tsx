export default function DocsViewer({ path }) {
	const url = `https://docs.google.com/viewer?url=${encodeURIComponent(
		path,
	)}&embedded=true`;

	return (
		<div className="flex items-center justify-center mx-auto h-[calc(100vh-180px)]">
			{' '}
			<iframe src={url} style={{ width: '100%', height: '100%' }} />
		</div>
	);
}
