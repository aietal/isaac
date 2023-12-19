import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@components/ui/popover';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@components/ui/tooltip';
import { useLiteratureReferenceStore } from '@context/literatureReference.store';
import { Panel, useUIStore } from '@context/ui.store';
import useCitationStyle from '@hooks/api/isaac/useCitationStyle';
import useDocumentTabs, { TabType } from '@hooks/useDocumentTabs';
import { $isCitationNode } from '@lexical/nodes/CitationNode';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { TooltipPortal } from '@radix-ui/react-tooltip';
import { generateCitation } from '@utils/citation';
import { $getNodeByKey, NodeKey } from 'lexical';
import React, { useEffect, useState } from 'react';
import { CitationData } from 'types/literatureReference.type';

type Props = {
	citation: CitationData;
	nodeKey: NodeKey;
	page?: string;
	renderedIndex?: number; // ? Tracking the sequence of render
	inText?: boolean;
};

const CitationComponent = ({ citation, inText, nodeKey, page }: Props) => {
	const [pageDetail, setPageDetail] = useState<string>(page);
	const [editor] = useLexicalComposerContext();
	const { citationStyle } = useCitationStyle();

	const renderedCitation = generateCitation(
		citation,
		citationStyle,
		pageDetail,
		inText,
	);
	const openPanel = useUIStore(s => s.openPanel);
	const setReferenceDOIPreview = useLiteratureReferenceStore(
		s => s.setSavedReferenceDOIPreview,
	);

	const { openDocument } = useDocumentTabs();

	// This hook is to update the citation node instance property once it renders
	useEffect(() => {
		if (citationStyle && renderedCitation) {
			editor.update(() => {
				const node = $getNodeByKey(nodeKey);
				if ($isCitationNode(node)) {
					node.setTextContent(renderedCitation);
					if (pageDetail) {
						node.setPage(pageDetail);
					}
				}
			});
		}
	}, [citationStyle, renderedCitation, pageDetail]);

	const handlePageDetailInput = (value: string) => {
		const pattern = /^[0-9-]+$/;
		if (pattern.test(value) || value === '') {
			setPageDetail(value);
		}
	};

	return (
		<Popover>
			<Tooltip>
				<PopoverTrigger asChild>
					<TooltipTrigger asChild>
						<span
							className="hover:bg-accent rounded-md px-1 py-1 cursor-pointer"
							onClick={() => {
								if (citation.sourceType === 'reference') {
									openPanel(Panel.REFERENCES);
									setReferenceDOIPreview(citation.doi);
								} else if (citation.sourceType === 'userUpload') {
									openDocument({
										source: citation.id,
										label: citation.title,
										type: TabType.UserUpload,
									});
								}
							}}
						>
							{renderedCitation}
						</span>
					</TooltipTrigger>
				</PopoverTrigger>
				{/* //TODO: Open menu on hover whether to open pdf or preview */}
				<TooltipPortal>
					<TooltipContent className="w-[300px]">
						<span>{citation.title}</span>
					</TooltipContent>
				</TooltipPortal>
			</Tooltip>
			<PopoverContent side="right" align="start" className="p-2 pt-0 w-min">
				<Label className="text-xs">Page Number</Label>
				<Input
					className="w-[80px] h-8 px-1"
					type="text"
					value={pageDetail}
					placeholder="88, 98-99"
					onChange={e => handlePageDetailInput(e.target.value)}
				/>
			</PopoverContent>
		</Popover>
	);
};

export default CitationComponent;
