import Spinner from '@components/core/Spinner';
import LiteratureSearchInput from '@components/literature/LiteratureSearchInput';
import { Badge } from '@components/ui/badge';
import ClampedParagraph from '@components/ui/clamped-paragraph';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@components/ui/table';
import useAddReference from '@hooks/api/useAddToReference';
import useDocumentTabs, {
	TabType,
	UniqueTabSources,
} from '@hooks/useDocumentTabs';
import useGetEditorRouter from '@hooks/useGetEditorRouter';
import { useLocalStorage } from '@mantine/hooks';
import { useDeleteReference, useGetReference } from '@resources/editor-page';
import {
	GetLiteraturePayload,
	LiteratureResponse,
	useGetLiterature,
} from '@resources/literature.api';
import clsx from 'clsx';
import { Bookmark } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
	ReferenceSource,
	SemanticScholarReference,
} from 'types/literatureReference.type';

type Props = {
	active: boolean;
};

const LiteratureSearchTab = ({ active }: Props) => {
	const { projectId } = useGetEditorRouter();
	const [literatureSearchPayload, setLiteratureSearchPayload] =
		useState<GetLiteraturePayload>();
	const { updateLiteratureSearchTab, activeDocument, openDocument } =
		useDocumentTabs();

	const [searchedResultInLocalStorage, setSearchedResultInLocalStorage] =
		useLocalStorage<Record<string, LiteratureResponse>>({
			key: 'literature-search',
			defaultValue: {},
		});

	const {
		data: literatureSearchResult,
		isLoading: litSearchLoading,
		isFetching: litSearchFetching,
	} = useGetLiterature(literatureSearchPayload, {
		onSuccess: data => {
			setSearchedResultInLocalStorage({
				...searchedResultInLocalStorage,
				[literatureSearchPayload.keyword]: data,
			});
			updateLiteratureSearchTab(
				literatureSearchPayload.keyword,
				activeDocument.source,
			);
		},
	});

	const { data: savedReferenceList } = useGetReference(projectId);
	const { mutateAsync: addReference } = useAddReference();
	const { mutateAsync: removeReference } = useDeleteReference();

	const handleSaveReference = (lit: SemanticScholarReference) => {
		addReference({
			projectId,
			papers: [
				{
					authors: lit.authors,
					title: lit.title,
					doi: lit.externalIds.DOI,
					year: lit.year,
					sourceId: ReferenceSource.SEMANTIC_SCHOLAR,
					pdf: lit.openAccessPdf?.url || null,
					abstract: lit.abstract,
				},
			],
		});
	};

	const cachedResult = searchedResultInLocalStorage[activeDocument?.source];

	// Triggering search from different place
	useEffect(() => {
		if (
			cachedResult?.literature === undefined &&
			literatureSearchResult === undefined &&
			active &&
			activeDocument?.source &&
			activeDocument.source !== UniqueTabSources.NEW_LIT_SEARCH &&
			literatureSearchPayload === undefined
		) {
			setLiteratureSearchPayload({ keyword: activeDocument?.source });
		}
	}, [
		active,
		activeDocument,
		literatureSearchResult,
		cachedResult,
		literatureSearchPayload,
	]);

	// Trigger update tab when
	useEffect(() => {
		if (searchedResultInLocalStorage[literatureSearchPayload?.keyword]) {
			updateLiteratureSearchTab(
				literatureSearchPayload.keyword,
				activeDocument.source,
			);
		}
	}, [literatureSearchPayload, searchedResultInLocalStorage]);

	return (
		<div
			className={clsx('max-w-[1400px] mx-auto', active ? 'block' : 'hidden')}
		>
			<LiteratureSearchInput
				onSubmit={data => {
					setLiteratureSearchPayload(data);
				}}
			/>
			{literatureSearchResult?.literature !== undefined && (
				<p className="text-sm font-semibold mt-3">
					{`${literatureSearchResult?.literature.length} results on "${activeDocument.source}" found`}
				</p>
			)}
			{litSearchFetching || litSearchLoading ? (
				<div className="h-[calc(100vh-220px)] flex items-center justify-center">
					<Spinner size="md" className="animate-fade-in" />
				</div>
			) : (
				<>
					{!!(literatureSearchResult || cachedResult)?.literature?.length && (
						<div className="mt-6 h-[calc(100vh-220px)] overflow-scroll">
							<Table className="">
								<TableHeader>
									<TableRow>
										<TableHead className="w-[48%]">Literature</TableHead>
										<TableHead className="w-[48%]">Abstract</TableHead>
										<TableHead className="w-[4%]"></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{(literatureSearchResult || cachedResult)?.literature.map(
										literature => {
											const savedRef = savedReferenceList?.find(i => {
												return i.doi === literature.externalIds.DOI;
											});
											return (
												<TableRow key={literature.paperId}>
													<TableCell className="align-top ">
														<p className="font-medium">{literature.title}</p>
														<div className="text-sm leading-7 break-words text-neutral-700 dark:text-neutral-400 line-clamp-1 ">
															<p>
																{!literature.authors.length &&
																	'Authors Unspecified'}
																{literature.authors
																	.slice(0, 2)
																	.map(a => a.name)
																	.join(' & ')}
																{literature.authors.length > 3 && ' et al.'}
															</p>
															<div className="flex gap-2">
																<Badge variant="accent">
																	{literature.year}
																</Badge>
																{!!literature.citationCount && (
																	<Badge variant="accent">{`${literature.citationCount} Citations`}</Badge>
																)}
																{literature.openAccessPdf && (
																	<Badge
																		className="cursor-pointer"
																		variant="accent"
																		onClick={() => {
																			openDocument({
																				source: literature.openAccessPdf.url,
																				type: TabType.SemanticScholar,
																				label: literature.title,
																			});
																		}}
																	>
																		<span>View PDF</span>
																	</Badge>
																)}
															</div>
														</div>
													</TableCell>
													<TableCell className="max-w-[300px] align-top">
														<ClampedParagraph
															text={literature.abstract}
															EmptyText={
																<span className="text-gray-400 h-full italic">
																	Abstract not found
																</span>
															}
														/>
													</TableCell>
													<TableCell className="align-top ">
														<Bookmark
															onClick={() =>
																!savedRef
																	? handleSaveReference(literature)
																	: removeReference(savedRef.id)
															}
															className={clsx(
																'text-right mt-1 cursor-pointer hover:stroke-yellow-500 hover:stroke-1',
																savedRef && 'fill-yellow-400 stroke-yellow-500',
															)}
															size={20}
															strokeWidth={0.6}
														/>
													</TableCell>
												</TableRow>
											);
										},
									)}
								</TableBody>
							</Table>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default LiteratureSearchTab;
