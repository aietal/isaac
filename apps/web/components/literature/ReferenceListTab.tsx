import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import ClampedParagraph from '@components/ui/clamped-paragraph';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@components/ui/table';
import {
	ReferenceSection,
	useLiteratureReferenceStore,
} from '@context/literatureReference.store';
import { Panel, useUIStore } from '@context/ui.store';
import { useUser } from '@context/user';
import useDeleteUserUpload from '@hooks/api/useDeleteUserUpload';
import useReferenceListOperation from '@hooks/api/useReferenceListOperation';
import { TabType } from '@hooks/useDocumentTabs';
import { useDeleteReference } from '@resources/editor-page';
import clsx from 'clsx';
import { capitalize, startCase } from 'lodash';
import { Bookmark, Pen, Trash } from 'lucide-react';
import React from 'react';
import {
	ReferenceLiterature,
	ReferenceSource,
	ReferenceType,
	UploadedFile,
} from 'types/literatureReference.type';
import AddReferenceDropdown from './AddReferenceDropdown';
import { ReferenceSourceFilter } from './LiteratureSearchSection';
import ReferenceExportButton from './ReferenceExportButton';
import ReferenceSearchInput from './ReferenceSearchInput';
import ReferenceSourceFilterDropdown from './ReferenceSourceFilterDropdown';

type Props = {
	active: boolean;
};

const ReferenceListTab = ({ active }: Props) => {
	const {
		openDocument,
		setTargetDOI,
		setRefSearchInput,
		mergedItem,
		filter,
		setFilter,
	} = useReferenceListOperation();
	const openPanel = useUIStore(s => s.openPanel);
	const { deleteUpload } = useDeleteUserUpload();
	const { user } = useUser();
	const { mutateAsync: removeReference } = useDeleteReference();
	const setShowUploadMetaModal = useLiteratureReferenceStore(
		s => s.setShowUploadMetaModal,
	);

	return (
		<div
			className={clsx('max-w-[1400px] mx-auto', active ? 'block' : 'hidden')}
		>
			<div className="flex gap-2 mb-2">
				<ReferenceSearchInput
					onSearch={setRefSearchInput}
					className="flex-grow"
				/>
				<ReferenceSourceFilterDropdown
					className="w-[120px]"
					onFilterChange={setFilter}
					currentFilter={filter}
				/>
			</div>
			<div className="flex justify-between">
				<AddReferenceDropdown displayAsButtons />
				<ReferenceExportButton />
			</div>

			<>
				{!!mergedItem?.length && (
					<div className="mt-6 h-[calc(100vh-200px)] overflow-scroll">
						<Table className="">
							<TableHeader>
								<TableRow>
									<TableHead className="w-[54%]">References</TableHead>
									<TableHead className="w-[42%]">Abstract</TableHead>
									<TableHead className="w-[4%]"></TableHead>
									{/* <TableHead className="w-[40%]">References</TableHead>
									<TableHead className="w-[32%]">Abstract</TableHead>
									<TableHead className="w-[25%]">TLDR</TableHead>
									<TableHead className="w-[4%]"></TableHead> */}
								</TableRow>
							</TableHeader>
							<TableBody>
								{mergedItem?.map(item => {
									const title =
										item._source === 'reference'
											? (item as ReferenceLiterature).title
											: (item as UploadedFile).custom_citation?.title ||
											  (item as UploadedFile).file_name;

									const authors =
										item._source === 'reference'
											? (item as ReferenceLiterature).authors?.map(a => a.name)
											: (item as UploadedFile).custom_citation?.authors;
									const authorsString = authors?.length
										? authors?.join(', ') +
										  ((authors.length || 0) > 3 ? ' et al.' : '')
										: 'Authors Unspecified';

									const year =
										item._source === 'reference'
											? (item as ReferenceLiterature).year
											: (item as UploadedFile).custom_citation?.year;

									const hasPdf =
										item._source === 'reference'
											? !!(item as ReferenceLiterature).pdf
											: true;

									const openDocumentProps =
										item._source === 'reference'
											? {
													source: (item as ReferenceLiterature).pdf,
													label: (item as ReferenceLiterature).title,
													type: TabType.SemanticScholar,
											  }
											: {
													source: (item as UploadedFile).id,
													label:
														(item as UploadedFile).custom_citation?.title ||
														(item as UploadedFile).file_name,
													type: TabType.UserUpload,
											  };

									const type =
										item._source === 'reference'
											? (item as ReferenceLiterature).type
											: ReferenceType.JOURNAL;

									const source =
										item._source === 'reference'
											? (item as ReferenceLiterature).source ||
											  ReferenceSource.SEMANTIC_SCHOLAR
											: ReferenceSource.MANUAL_UPLOAD;

									const onTitleClick = () => {
										if (item._source === 'reference') {
											openPanel(Panel.REFERENCES);
											setTargetDOI(
												(item as ReferenceLiterature).doi,
												ReferenceSection.SAVED_REFERENCES,
											);
										} else {
											openDocument(openDocumentProps);
										}
									};

									return (
										<TableRow key={item.id}>
											<TableCell className="align-top ">
												<p
													className="font-medium cursor-pointer"
													onClick={onTitleClick}
												>
													{title}
												</p>
												<div className="text-sm leading-7 break-words text-neutral-700 dark:text-neutral-400 line-clamp-1 ">
													<p>{authorsString}</p>
													<div className="flex gap-2">
														<Badge
															variant="accent"
															className="text-xs"
															key={type}
														>
															{startCase(
																capitalize(type || ReferenceType.JOURNAL),
															)}
														</Badge>
														{year && <Badge variant="accent">{year}</Badge>}
														<Badge variant="accent">
															{' '}
															{capitalize(startCase(source))}
														</Badge>
														{hasPdf && (
															<Badge
																className="cursor-pointer"
																variant="accent"
																onClick={() => {
																	openDocument(openDocumentProps);
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
													text={item.abstract}
													EmptyText={
														<span className="text-gray-400 h-full italic">
															No Abstract
														</span>
													}
												/>
											</TableCell>
											{/* <TableCell className="max-w-[300px] align-top">
												<ClampedParagraph
													text={item.tldr}
													EmptyText={
														<span className="text-gray-400 h-full italic">
															Add TLDR
														</span>
													}
												/>
											</TableCell> */}
											<TableCell className="align-top ">
												{item._source === 'reference' && (
													<Bookmark
														onClick={() =>
															confirm(
																`Are you sure to delete item below from reference: \n${
																	(item as ReferenceLiterature).title
																} `,
															) &&
															removeReference((item as ReferenceLiterature).id)
														}
														className={clsx(
															'text-right mt-1 cursor-pointer hover:stroke-yellow-500 hover:stroke-1',
															'fill-yellow-400 stroke-yellow-500',
														)}
														size={20}
														strokeWidth={0.6}
													/>
												)}
												{item._source === 'uploaded' && (
													<>
														<Button
															variant="ghost"
															size="icon"
															onClick={event => {
																setShowUploadMetaModal({
																	uploadId: item.id,
																	fileName: title,
																});
															}}
															className={clsx(
																'p-1 h-6 w-6 mb-1.5 text-muted-foreground ',
															)}
														>
															<Pen size={18} strokeWidth={1.4} />
														</Button>
														<Button
															variant="ghost"
															size="icon"
															onClick={() =>
																confirm(`Delete uploaded file:\n ${title}`) &&
																deleteUpload(item.id, user?.id)
															}
															className={clsx(
																'p-1 h-6 w-6 text-muted-foreground ',
															)}
														>
															<Trash strokeWidth={1.4} size={18} />
														</Button>
													</>
												)}
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</div>
				)}
			</>
		</div>
	);
};

export default ReferenceListTab;
