import { Separator } from '@components/ui/separator';
import useLexicalEditorStore from '@context/lexicalEditor.store';
import { useUIStore } from '@context/ui.store';
import { useBreakpoint } from '@hooks/misc/useBreakPoint';
// import data, { Emoji } from '@emoji-mart/data';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { NodeKey } from 'lexical';
import React, { useRef, useState } from 'react';

const indentSize = {
	h1: 0,
	h2: 20,
	h3: 30,
	h4: 40,
};

const documentVariants = {
	open: {
		opacity: 1,
		transition: {
			duration: 0.3,
		},
	},
	closed: {
		opacity: 0,
		transition: {
			duration: 0.3,
		},
	},
};

export default function DocumentTableOfContent() {
	const editor = useLexicalEditorStore(s => s.activeEditor);
	const tableOfContents = useLexicalEditorStore(s => s.tableOfContents);
	const [selectedKey, setSelectedKey] = useState('');
	const selectedIndex = useRef(0);

	function scrollToNode(key: NodeKey, currIndex: number) {
		editor.getEditorState().read(() => {
			const domElement = editor.getElementByKey(key);
			if (domElement !== null) {
				domElement.scrollIntoView();
				setSelectedKey(key);
				selectedIndex.current = currIndex;
			}
		});
	}

	const { isBelowMd } = useBreakpoint('md');
	const openPanel = useUIStore(s => s.openPanel);

	return (
		<motion.div variants={documentVariants}>
			{tableOfContents.map((content, index) => (
				<p
					className={clsx(
						'text-sm  cursor-pointer hover:text-isaac line-clamp-1 flex gap-4 ',
						selectedKey === content.nodeId && 'text-isaac',
					)}
					onClick={() => {
						scrollToNode(content.nodeId, index);
						isBelowMd && openPanel(undefined);
					}}
					style={{
						paddingLeft: indentSize[content.header] + 50,
					}}
					key={content.nodeId}
				>
					<Separator orientation="vertical" className="h-auto" />
					<span className="my-1">{content.text}</span>
				</p>
			))}
		</motion.div>
	);
}
