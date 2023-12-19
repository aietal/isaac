import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@components/ui/popover';
import { CitationNode } from '@lexical/nodes/CitationNode';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $nodesOfType, COMMAND_PRIORITY_LOW } from 'lexical';
import React, { ReactNode, useEffect, useState } from 'react';

type Props = {
	children: ReactNode;
};

const DocumentStatsPopover = ({ children }: Props) => {
	const [stats, setStats] = useState({ wordCount: 0, characterCount: 0, citationCount: 0 });
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		return editor.registerUpdateListener(({ editorState }) => {
			editorState.read(() => {
				const text = $getRoot().getTextContent();
				const citationNodes = $nodesOfType(CitationNode);
				setStats({
					wordCount: text.split(' ').length,
					characterCount: text.length,
					citationCount: citationNodes.length,
				});
			});
		});
	}, []);

	return (
		<Popover>
			<PopoverTrigger>{children}</PopoverTrigger>
			<PopoverContent side="left" className="text-sm w-[200px]">
				<p className="font-bold mb-2">Document Statistics</p>
				<div className="flex flex-col gap-1">
					<p className="">Word Count: {stats.wordCount}</p>
					<p>Character Count: {stats.characterCount}</p>
					<p>Citations: {stats.citationCount}</p>
				</div>
			</PopoverContent>
		</Popover>
	);
};

export default DocumentStatsPopover;
