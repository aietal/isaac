import useLexicalEditorStore from '@context/lexicalEditor.store';
import TableOfContentsPlugin from '@lexical/react/LexicalTableOfContents';
import React from 'react';

const TableOfContentPlugin = () => {
	const setTableOfContents = useLexicalEditorStore(s => s.setTableOfContents);
	return (
		<TableOfContentsPlugin>
			{(entries, editor) => {
				setTableOfContents(
					entries
						.filter(i => ['h1', 'h2', 'h3'].includes(i[2]))
						.map(i => ({ nodeId: i[0], text: i[1], header: i[2] })),
				);
				return null;
			}}
		</TableOfContentsPlugin>
	);
};

export default TableOfContentPlugin;
