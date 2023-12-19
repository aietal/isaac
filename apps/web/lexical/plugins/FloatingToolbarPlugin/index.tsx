import { Input } from '@components/ui/input';
import { Separator } from '@components/ui/separator';
import useLexicalEditorStore from '@context/lexicalEditor.store';
import { INSERT_INLINE_COMMAND } from '@lexical/plugins/CommentPlugin';
import AIFunctionsDropdown from '@lexical/plugins/FloatingToolbarPlugin/components/AIFunctionsDropdown';
import CreateNoteToolbarButton from '@lexical/plugins/FloatingToolbarPlugin/components/CreateNoteToolbarButton';
import ToolbarButton from '@lexical/plugins/FloatingToolbarPlugin/components/FloatingToolbarButton';
import FloatingToolbarContainer from '@lexical/plugins/FloatingToolbarPlugin/components/FloatingToolbarContainer';
import useFloatingToolbarStates from '@lexical/plugins/FloatingToolbarPlugin/hooks/useFloatingToolbarStates';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { MessageSquarePlus } from 'lucide-react';

export default function FloatingToolbarPlugin() {
	const [editor] = useLexicalComposerContext();
	const customPromptInputActive = useLexicalEditorStore(
		s => s.floatingInputActive,
	);

	const { isText, isLink } = useFloatingToolbarStates(editor);

	if (!isText || isLink) {
		return null;
	}
	return (
		<>
			<FloatingToolbarContainer persist={!!customPromptInputActive}>
				{!customPromptInputActive ? (
					<>
						<AIFunctionsDropdown />
						<Separator
							orientation="vertical"
							className="border-[#191711]/[0.08] dark:border-neutral-500"
						/>

						<ToolbarButton
							onClick={() =>
								editor.dispatchCommand(INSERT_INLINE_COMMAND, undefined)
							}
						>
							<MessageSquarePlus strokeWidth={1.2} size={16} />
						</ToolbarButton>

						<CreateNoteToolbarButton editor={editor} />
					</>
				) : (
					<>
						<Input placeholder="Tell Isaac what to do next" />
					</>
				)}
			</FloatingToolbarContainer>
		</>
	);
}
