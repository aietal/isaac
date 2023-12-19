import { LiteratureCardSkeleton } from '@components/literature/LiteratureCard';
import LiteratureList from '@components/literature/LiteratureList';
import LiteratureSearchInput from '@components/literature/LiteratureSearchInput';
import LiteratureSummaryPreview from '@components/literature/LiteratureSummaryPreview';
import useLiteratureToPreview from '@components/literature/useLiteratureToPreview';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@components/ui/tooltip';
import {
	ReferenceSection,
	useLiteratureReferenceStore,
} from '@context/literatureReference.store';
import useAddReference from '@hooks/api/useAddToReference';
import useDocumentTabs, {
	TabType,
	UniqueTabSources,
} from '@hooks/useDocumentTabs';
import useGetEditorRouter from '@hooks/useGetEditorRouter';
import { useGetReference } from '@resources/editor-page';
import { useGetLiterature } from '@resources/literature.api';
import { ArrowUpRight } from 'lucide-react';
import React, { useCallback } from 'react';
import {
	ReferenceSource,
	SemanticScholarReference,
} from 'types/literatureReference.type';
export enum ReferenceSourceFilter {
	ALL = 'ALL',
	SAVED = 'SAVED',
	UPLOADED = 'UPLOADED',
}
const LiteratureSearchSection = () => {
	const { projectId } = useGetEditorRouter();

	const setLiteratureDOIPreview = useLiteratureReferenceStore(
		s => s.setLiteratureDOIPreview,
	);

	const literatureSearchPayload = useLiteratureReferenceStore(
		s => s.literatureSearch,
	);

	const setLiteratureSearchPayload = useLiteratureReferenceStore(
		s => s.setLiteratureSearch,
	);

	const {
		data: literatureSearchResult,
		isLoading: litSearchLoading,
		isFetching: litSearchFetching,
	} = useGetLiterature(literatureSearchPayload);

	const { mutateAsync: addReference } = useAddReference({
		onSuccess: () => {
			//
		},
	});
	const { data: _referenceList } = useGetReference(projectId);

	const { openDocument } = useDocumentTabs();

	const onAddRef = useCallback(
		(lit: SemanticScholarReference) => {
			console.log({ lit });
			addReference({
				projectId,
				papers: [
					{
						authors: lit.authors,
						title: lit.title,
						doi: lit.externalIds.DOI,
						year: lit.year,
						sourceId: ReferenceSource.SEMANTIC_SCHOLAR,
						pdf: lit.openAccessPdf.url || null,
						abstract: lit.abstract,
					},
				],
			});
		},
		[addReference, projectId],
	);

	const targetDOI = useLiteratureReferenceStore(s => s.literatureDOIPreview);
	const setTargetDOI = useLiteratureReferenceStore(
		s => s.setLiteratureDOIPreview,
	);
	const { literaturePreview } = useLiteratureToPreview(targetDOI);

	if (literaturePreview) {
		return (
			<div>
				<LiteratureSummaryPreview
					onClose={() => setTargetDOI(undefined)}
					{...literaturePreview}
				/>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full overflow-y-scroll scrollbar-hide">
			<div className="flex justify-between items-top p-3">
				<p className="font-semibold mb-2 text-sm flex gap-2 items-center">
					Literature Search
				</p>
				<>
					<Tooltip>
						<TooltipTrigger asChild>
							<ArrowUpRight
								size={20}
								onClick={() => {
									openDocument({
										type: TabType.LiteratureSearch,
										source:
											literatureSearchPayload?.keyword ||
											UniqueTabSources.NEW_LIT_SEARCH,
										label:
											literatureSearchPayload?.keyword || 'Search Literature',
									});
								}}
								className="text-gray-600 hover:text-isaac cursor-pointer hidden md:block"
								strokeWidth={1}
							/>
						</TooltipTrigger>
						<TooltipContent side="right">Open in new tab</TooltipContent>
					</Tooltip>
				</>
			</div>
			{/* INPUT */}
			<div className="px-3 mb-3">
				<LiteratureSearchInput
					onSubmit={data => {
						setLiteratureSearchPayload(data);
					}}
				/>
			</div>

			{(litSearchFetching || litSearchLoading) && (
				<div className="flex-col flex px-3 gap-2">
					<LiteratureCardSkeleton />
					<LiteratureCardSkeleton />
					<LiteratureCardSkeleton />
					<LiteratureCardSkeleton />
					<LiteratureCardSkeleton />
				</div>
			)}
			{literatureSearchResult?.literature?.length && (
				<>
					<LiteratureList
						keyword={literatureSearchPayload.keyword}
						literatureList={literatureSearchResult.literature}
						savedLiteratureIds={_referenceList?.map(({ doi, id }) => ({
							id,
							doi,
						}))}
						onAdd={onAddRef}
						onLiteratureSelect={lit =>
							setLiteratureDOIPreview(
								lit.externalIds.DOI,
								ReferenceSection.SEARCH_LITERATURE,
							)
						}
					/>
				</>
			)}
		</div>
	);
};
export default React.memo(LiteratureSearchSection);
