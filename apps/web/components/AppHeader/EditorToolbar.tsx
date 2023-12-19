import { Button } from '@components/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@components/ui/tooltip';
import useLexicalEditorStore from '@context/lexicalEditor.store';
import useDocumentTabs, { TabType } from '@hooks/useDocumentTabs';
import { $getRoot } from 'lexical';
import { Download } from 'lucide-react';

const EditorToolbar = () => {
	const { activeEditor } = useLexicalEditorStore();
	const { activeDocument } = useDocumentTabs();
	const exportAsText = () => {
		if (!activeEditor) {
			return;
		}
		const rawTextContent = activeEditor
			.getEditorState()
			.read(() => $getRoot().getTextContent());
		const blob = new Blob([rawTextContent], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);

		const link = document.createElement('a');
		Object.assign(link, {
			href: url,
			download: 'document.txt',
		});

		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		URL.revokeObjectURL(url);
	};

	return (
		<div>
			{activeDocument?.type === TabType.Document && (
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							onClick={exportAsText}
							className="relative h-8 w-8 text-accent-foreground"
						>
							<Download size={20} strokeWidth={1.2} />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="right">
						<p>Download document as .txt file</p>
					</TooltipContent>
				</Tooltip>
			)}
		</div>
	);
};

export default EditorToolbar;
