import ImportMendeleyModal from '@components/literature/ImportMendeleyModal';
import ImportZoteroModal from '@components/literature/ImportZoteroModal';
import LiteratureSummaryPreview from '@components/literature/LiteratureSummaryPreview';
import ReferenceList from '@components/literature/ReferenceList';
import useLiteratureToPreview from '@components/literature/useLiteratureToPreview';
import { useLiteratureReferenceStore } from '@context/literatureReference.store';
import useReferenceListOperation, {
	ReferenceSourceFilter,
} from '@hooks/api/useReferenceListOperation';
import { TabType, UniqueTabSources } from '@hooks/useDocumentTabs';
import { ArrowUpRight, Search } from 'lucide-react';
import React, { useState } from 'react';
import AddReferenceDropdown from './AddReferenceDropdown';
import ReferenceExportButton from './ReferenceExportButton';
import ReferenceSearchInput from './ReferenceSearchInput';
import ReferenceSourceFilterDropdown from './ReferenceSourceFilterDropdown';

const References = () => {
	const {
		openDocument,
		setTargetDOI,
		setRefSearchInput,
		mergedItem,
		filter,
		setFilter,
	} = useReferenceListOperation();

	const targetDOI = useLiteratureReferenceStore(
		s => s.savedReferenceDOIPreview,
	);
	const { literaturePreview } = useLiteratureToPreview(targetDOI);

	if (literaturePreview) {
		return (
			<div className="">
				<LiteratureSummaryPreview
					onClose={() => setTargetDOI(undefined)}
					{...literaturePreview}
				/>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full w-full overflow-y-scroll scrollbar-hide bg-white dark:bg-black">
			{/* HEADER */}
			<div className="flex justify-between items-top p-3">
				<p className="font-semibold text-sm flex gap-2 items-center">
					Saved References
				</p>
				<div>
					<ArrowUpRight
						size={20}
						onClick={() => {
							openDocument({
								type: TabType.SavedReference,
								source: UniqueTabSources.SAVED_REFERENCE_TAB,
								label: 'References',
							});
						}}
						className="text-gray-600 hover:text-isaac cursor-pointer hidden md:block"
						strokeWidth={1}
					/>
				</div>
			</div>

			{/* SEARCH INPUT & FILTER */}
			<div className="flex flex-col gap-2 items-stretch px-3 mb-3">
				<ReferenceSearchInput onSearch={setRefSearchInput} />
				<ReferenceSourceFilterDropdown
					onFilterChange={setFilter}
					currentFilter={filter}
				/>
				<div className="flex flex-wrap w-full gap-x-2">
					<AddReferenceDropdown />
					<ReferenceExportButton />
				</div>
			</div>

			{/* LIST */}
			<ReferenceList
				list={mergedItem}
				onClick={ref => {
					setTargetDOI(ref.doi);
				}}
			/>
			<ImportMendeleyModal />
			<ImportZoteroModal />
		</div>
	);
};

export default React.memo(References);
