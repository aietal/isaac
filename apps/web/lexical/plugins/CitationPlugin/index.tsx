import { ReferenceTypeIconsMap } from '@components/core/IconMap';
import { useLiteratureReferenceStore } from '@context/literatureReference.store';
import { useUIStore } from '@context/ui.store';
import useCitationStyle from '@hooks/api/isaac/useCitationStyle';
import useDocumentTabs, { TabType } from '@hooks/useDocumentTabs';
import useGetEditorRouter from '@hooks/useGetEditorRouter';
import { $createCitationNode } from '@lexical/nodes/CitationNode';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
	LexicalTypeaheadMenuPlugin,
	MenuOption,
	useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { useGetReference } from '@resources/editor-page';
import { generateCitation } from '@utils/citation';
import clsx from 'clsx';
import {
	$createTextNode,
	$getSelection,
	$isRangeSelection,
	TextNode,
} from 'lexical';
import { Book, BookUp, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { CitationData } from 'types/literatureReference.type';

class CitationOption extends MenuOption {
	citation?: CitationData;

	constructor(initialState: CitationData) {
		super(initialState?.title);
		this.citation = initialState;
	}
}

export default function CitationPlugin() {
	const [editor] = useLexicalComposerContext();
	const [queryString, setQueryString] = useState(null);
	const { openDocument } = useDocumentTabs();
	const { projectId } = useGetEditorRouter();
	const { data: references } = useGetReference(projectId);
	const userUploads = useLiteratureReferenceStore(s => s.userUploads);
	const checkForTriggerMatch = useBasicTypeaheadTriggerMatch('@', {
		minLength: 0,
	});
	const showCommand = useUIStore(s => s.setShowEditorCommand);

	// TODO: Filter based on query string
	const _options = useMemo(() => {
		let _references: CitationOption[] = [];
		let _uploads: CitationOption[] = [];

		if (references) {
			_references = references.map((i, idx) => {
				return new CitationOption({
					...i,
					index: idx + 1,
					type: i.type,
					sourceType: 'reference',
					searchText: [
						i.authors.map(i => i.name).join(' '),
						i.title,
						i.year,
						i.tldr,
					]
						.join(' ')
						.toLocaleLowerCase(),
				});
			});
		}

		if (userUploads) {
			_uploads = userUploads
				.filter(i => !!i.custom_citation)
				.map(
					(i, idx) =>
						new CitationOption({
							id: i.id,
							title: i.custom_citation?.title || i.file_name,
							year: i.custom_citation?.year.toString(),
							authors: i.custom_citation?.authors.map(i => ({ name: i })) || [],
							index: idx + 1,
							sourceType: 'userUpload',
							searchText: [
								i.custom_citation.authors.join(' '),
								i.custom_citation.title,
								i.custom_citation.year,
							]
								.join(' ')
								.toLocaleLowerCase(),
						}),
				);
		}

		const options = [..._references, ..._uploads].filter(i =>
			i.citation.searchText.includes(queryString),
		);

		// Search Option
		if (options.length === 0) {
			const searchOption = new CitationOption({
				id: 'search',
				title: queryString,
				year: '0',
				index: 0,
				sourceType: 'reference',
				authors: [],
			});
			return [searchOption];
		}

		return options;
	}, [references, userUploads, queryString]);

	const onSelectOption = async (
		selectedOption: CitationOption,
		nodeToRemove: TextNode | null,
		closeMenu: () => void,
	) => {
		if (selectedOption.citation.id === 'search') {
			nodeToRemove?.remove();
			closeMenu();
			return openDocument({
				source: selectedOption.citation.title,
				type: TabType.LiteratureSearch,
				label: selectedOption.citation.title,
			});
		}

		// refocuses the editor
		editor.focus();

		editor.update(() => {
			const selection = $getSelection();
			if (!$isRangeSelection(selection) || selectedOption == null) {
				return;
			}

			if (nodeToRemove) {
				nodeToRemove.remove();
			}

			selection.insertNodes([
				$createCitationNode(selectedOption.citation, true),
				$createTextNode(' '),
			]);

			closeMenu();
		});
	};
	return (
		<LexicalTypeaheadMenuPlugin<CitationOption>
			onQueryChange={setQueryString}
			onSelectOption={onSelectOption}
			triggerFn={checkForTriggerMatch}
			options={_options}
			onClose={() => {
				if (_options[0].citation.id === 'search') {
					showCommand(true, { defaultSearch: queryString + ' ' });
				}
			}}
			menuRenderFn={(
				anchorElementRef,
				{ selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
			) => {
				if (anchorElementRef.current == null || _options.length === 0) {
					return null;
				}

				return anchorElementRef.current && _options.length
					? ReactDOM.createPortal(
							<div className="flex gap-2 items-start max-h-[200px]">
								<div className="typeahead-popover w-[200px] bg-popover ">
									<ul>
										{_options.map((option, index) => {
											const isSelected = selectedIndex === index;
											if (option.citation.id === 'search') {
												return (
													<p
														className="items-center gap-2 p-2 min-w-[200px] text-sm inline-flex cursor-pointer hover:bg-accent text-foreground"
														key={index}
														onClick={() => {
															setHighlightedIndex(index);
															selectOptionAndCleanUp(option);
														}}
														onMouseEnter={() => {
															setHighlightedIndex(index);
														}}
													>
														<Search size={12} />
														<span>
															{`Search for "${option.citation.title}"`}
														</span>
													</p>
												);
											}
											return (
												<div key={option.citation.id}>
													<ReferenceItem
														index={index}
														isSelected={isSelected}
														onClick={() => {
															setHighlightedIndex(index);
															selectOptionAndCleanUp(option);
														}}
														onMouseEnter={() => {
															setHighlightedIndex(index);
														}}
														option={option}
													/>
												</div>
											);
										})}
									</ul>
								</div>
								{_options[0].citation.id !== 'search' && (
									<div className="typeahead-popover bg-popover p-2 min-w-[300px] text-sm">
										<p className="mb-2 font-semibold">
											{_options[selectedIndex]?.citation?.title || ''}
										</p>
										<p>
											{_options[selectedIndex]?.citation.authors
												.map(i => i.name)
												.join(', ')}
										</p>
									</div>
								)}
							</div>,
							anchorElementRef.current,
					  )
					: null;
			}}
		/>
	);
}

type ReferenceItemProps = {
	index: number;
	isSelected: boolean;
	onClick: () => void;
	onMouseEnter: () => void;
	option: CitationOption;
};

export function ReferenceItem({
	index,
	isSelected,
	onClick,
	onMouseEnter,
	option,
}: ReferenceItemProps) {
	const { citationStyle } = useCitationStyle();
	const citationText = generateCitation(
		option.citation,
		citationStyle,
		undefined,
		true,
	);
	const Icon = ReferenceTypeIconsMap[option.citation.type] || Book;
	return (
		<li
			key={option.key}
			tabIndex={-1}
			className={clsx(
				'item bg-popover hover:bg-accent text-foreground',
				isSelected && 'selected',
			)}
			ref={option.setRefElement}
			role="option"
			aria-selected={isSelected}
			id={'typeahead-item-' + index}
			onMouseEnter={onMouseEnter}
			onClick={onClick}
		>
			<div className="inline-flex items-center gap-2 justify-between">
				<div>
					{option.citation.sourceType === 'userUpload' && (
						<BookUp className="text-foreground" size={12} />
					)}
					{option.citation.sourceType === 'reference' && (
						<Icon className="text-foreground" size={12} />
					)}
				</div>
				<p className="word-break: break-all">
					{citationText.substring(1, citationText.length - 1)}
				</p>
			</div>
		</li>
	);
}
