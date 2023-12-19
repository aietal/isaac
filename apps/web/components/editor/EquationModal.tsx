import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@components/ui/dialog';
import useLexicalEditorStore from '@context/lexicalEditor.store';
import { useUIStore } from '@context/ui.store';
import { InsertEquationDialog } from '@lexical/plugins/EquationsPlugin';
import Link from 'next/link';

export function EquationModal() {
	const showEquationModal = useUIStore(s => s.showEquationModal);
	const setShowEquationModal = useUIStore(s => s.setShowEquationModal);

	const { activeEditor } = useLexicalEditorStore();

	return (
		<Dialog open={showEquationModal} onOpenChange={setShowEquationModal}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Equation Editor</DialogTitle>
					<DialogDescription>
						Our equation editor uses{' '}
						<Link
							prefetch={false}
							target="_blank"
							rel="noreferrer"
							href="https://katex.org/docs/support_table"
							className="underline text-muted-foreground"
						>
							Katex{' '}
						</Link>
						to render mathematical expressions.
					</DialogDescription>
				</DialogHeader>
				<InsertEquationDialog
					activeEditor={activeEditor}
					onClose={() => {
						setShowEquationModal(false);
					}}
				/>
			</DialogContent>
		</Dialog>
	);
}
