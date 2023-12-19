import { useGetLiteratureDetails } from '@resources/literature.api';
import { useEffect, useState } from 'react';
import {
	LiteraturePreview,
	ReferenceType,
} from 'types/literatureReference.type';

const useLiteratureToPreview = (doi: string) => {
	const [literaturePreview, setLiteraturePreview] =
		useState<LiteraturePreview>();

	const { refetch } = useGetLiteratureDetails(doi, {
		onSuccess(data) {
			const { openAccessPdf, externalIds, ...lit } = data;
			setLiteraturePreview({
				...lit,
				pdfUrl: openAccessPdf?.url,
				doi: externalIds?.DOI,
				type: ReferenceType.STANDARD,
			});
		},
	});

	useEffect(() => {
		if (doi === undefined) {
			setLiteraturePreview(undefined);
		} else {
			refetch();
		}
	}, [doi]);

	return { literaturePreview, setLiteraturePreview };
};

export default useLiteratureToPreview;
