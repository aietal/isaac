import LiteratureCard from '@components/literature/LiteratureCard';
import { useDeleteReference } from '@resources/editor-page';
import {
	ReferenceType,
	SemanticScholarReference,
} from 'types/literatureReference.type';

type Props = {
	keyword: string;
	onAdd: (lit: SemanticScholarReference) => void;
	literatureList?: SemanticScholarReference[];
	savedLiteratureIds?: { id: string; doi: string }[];
	onLiteratureSelect?: (lit: SemanticScholarReference) => void;
	onSaveLiterature?: (lit: SemanticScholarReference) => void;
};

const LiteratureList = ({
	literatureList,
	onLiteratureSelect,
	savedLiteratureIds,
	keyword,
	onAdd,
}: Props) => {
	const { mutateAsync: removeReference } = useDeleteReference();

	return (
		<div className="flex flex-col gap-2" id="literature-search-results">
			{/* FEEDBACK */}
			<div className="flex justify-between px-3">
				<p className="text-xs font-semibold">
					{`${literatureList.length} results on "${keyword}" found`}
				</p>
			</div>

			{/* LIST */}
			<div className="flex flex-col gap-2 overflow-y-scroll h-[calc(100vh-210px)] px-3">
				{literatureList.map(lit => {
					const savedRef = savedLiteratureIds.find(i => {
						return i.doi === lit.externalIds.DOI;
					});
					return (
						<LiteratureCard
							key={lit.paperId}
							onClick={() => onLiteratureSelect?.(lit)}
							title={lit.title}
							authors={lit.authors.map(author => author.name)}
							year={lit.year}
							source="Search"
							onAdd={() => onAdd(lit)}
							added={!!savedRef}
							onRemove={() => removeReference(savedRef.id)}
							type={ReferenceType.JOURNAL}
							displayCta
						/>
					);
				})}
			</div>
		</div>
	);
};

export default LiteratureList;
