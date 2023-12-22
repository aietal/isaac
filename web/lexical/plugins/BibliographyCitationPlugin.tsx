import { Separator } from '@components/ui/separator';
import useCitationStyle from '@hooks/api/isaac/useCitationStyle';
import { CitationNode } from '@lexical/nodes/CitationNode';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { generateCitation } from '@utils/citation';
import { $getRoot, $nodesOfType } from 'lexical';
import { uniq } from 'lodash';
import React, { useEffect, useState } from 'react';

const BibliographyCitationPlugin = () => {
	const [editor] = useLexicalComposerContext();
	const [references, setReferences] = useState<string[]>();
	const { citationStyle } = useCitationStyle();

	useEffect(() => {
		return editor.registerUpdateListener(({ editorState }) => {
			editorState.read(() => {
				const citationNodes = $nodesOfType(CitationNode);
				const citationStr = citationNodes.map(node => {
					const citationData = node.getData();
					return generateCitation(citationData, citationStyle, '', false);
				});

				setReferences(uniq(citationStr));

				console.log;
			});
		});
	}, [citationStyle]);

	if (!references?.length) {
		return null;
	}

	return (
		<div className="w-full px-4 pb-10">
			<Separator className="my-10 " />
			<div>
				<h1 className="font-bold">References</h1>
				<div className="flex flex-col gap-2 mt-6">
					{references?.map((i, idx) => (
						<p key={`ref-${idx}`}>{`${idx + 1}. ${i}`}</p>
					))}
				</div>
			</div>
		</div>
	);
};

export default BibliographyCitationPlugin;
