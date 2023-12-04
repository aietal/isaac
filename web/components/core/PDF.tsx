import {
	PageLayout,
	SetRenderRange,
	SpecialZoomLevel,
	Spinner,
	Viewer,
	VisiblePagesRange,
	Worker,
} from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import  { memo, useCallback } from 'react';

const pageLayout: PageLayout = {
	buildPageStyles: () => ({
		alignItems: 'center',
		display: 'flex',
		justifyContent: 'center',
	}),
	transformSize: ({ size }) => ({
		height: size.height + 20,
		width: size.width + 20,
	}),
};

const renderLoader = (_percentages: number) => (
	<div className="animate-pulse text-light ">
		<Spinner size="lg" />
	</div>
);
// Another usage: render the first 20 pages initially
const setRenderRange: SetRenderRange = useCallback((visiblePagesRange: VisiblePagesRange) => {
    return {
        startPage: visiblePagesRange.endPage <= 1 ? 0 : visiblePagesRange.startPage - 5,
        endPage:
            visiblePagesRange.startPage <= 1
                ? Math.max(1, visiblePagesRange.endPage + 5)
                : visiblePagesRange.endPage + 5,
    };
}, []);


const PDF = memo(({ path }: { path: string }) => {
	typeof window !== 'undefined' && (window.devicePixelRatio = 2);

	return (
		<>
			<Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js">
				<Viewer
					setRenderRange={setRenderRange}
					fileUrl={path}
					defaultScale={SpecialZoomLevel.PageWidth}
					pageLayout={pageLayout}
					renderLoader={renderLoader}
					// httpHeaders={{
					// 	Origin: 'https://isaaceditor.com',
					// 	'x-requested-with': 'XMLHttpRequest',
					// }}
				/>
			</Worker>
		</>
	);
});

PDF.displayName = 'PDF';

export default PDF;
