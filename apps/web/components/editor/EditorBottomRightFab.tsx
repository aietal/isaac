import { useUIStore } from '@context/ui.store';
import { Grammarly, GrammarlyButton } from '@grammarly/editor-sdk-react';
import React from 'react';

const EditorBottomRightFab = () => {
	const showChangelogUpdate = useUIStore(s => s.showChangelogUpdate);

	return (
		<div
			id="editor-bottom-right-fab"
			className="flex gap-2 absolute bottom-2 right-4 z-50"
		>
			{/* Hide GrammarlyButton when Changelog is updated */}

			<GrammarlyButton />
		</div>
	);
};

export default EditorBottomRightFab;
