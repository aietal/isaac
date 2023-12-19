import RichTextArea from '@components/core/RichTextArea';
import Note from '@components/notes/Note';
import { Button } from '@components/ui/button';
import useGetEditorRouter from '@hooks/useGetEditorRouter';
import useCreateNote, {
	Note as NoteSchema,
	useDeleteNote,
	useGetNotes,
	useUpdateNote,
} from '@resources/notes';
import clsx from 'clsx';
import { CLEAR_EDITOR_COMMAND, EditorState, LexicalEditor } from 'lexical';
import {
	AlertCircle,
	ArrowLeft,
	Loader2,
	Plus,
	Save,
	StickyNote,
} from 'lucide-react';
import React, { useState } from 'react';

const Notes = () => {
	const { projectId } = useGetEditorRouter();
	const [editPage, setEditPage] = useState<string | boolean>(false);
	const [editorState, setEditorState] = useState<EditorState | string>();
	const [lexical, setLexical] = useState<LexicalEditor>();

	const { mutateAsync: createNote } = useCreateNote();
	const { mutateAsync: deleteNote } = useDeleteNote();
	const { mutateAsync: updateNote } = useUpdateNote();
	const { data: notes, error, isLoading } = useGetNotes(projectId);

	const handleOnSaveClick = () => {
		if (lexical.getRootElement().textContent) {
			if (editPage === true) {
				//  New Note
				createNote(JSON.stringify(editorState));
				lexical.dispatchCommand(CLEAR_EDITOR_COMMAND, null);
			} else if (typeof editPage === 'string') {
				// Update Note
				updateNote({ id: editPage, text: JSON.stringify(editorState) });
			}
			setEditorState(undefined);
			setEditPage(false);
		}
	};

	const handleOnNoteClick = (id: string) => {
		setEditPage(id);
		const targetNote = notes?.find(note => note.id === id);
		setEditorState(targetNote.text);
	};

	const handleCreateClick = () => {
		setEditPage(true);
		setEditorState('');
	};

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center py-20 text-xs text-center">
				<AlertCircle />
				<p className="leading-4 [&:not(:first-child)]:mt-4">
					Please select a project from the sidebar and to view your notes
				</p>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center gap-2 py-12">
				<Loader2 className="animate-spin" /> Loading notes...
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full">
			<div className="flex justify-between items-top p-3">
				<div className="flex justify-start gap-3">
					{editPage && (
						<ArrowLeft
							size={18}
							strokeWidth={1.2}
							onClick={() => setEditPage(false)}
						/>
					)}
					<p className="font-semibold mb-2 text-sm flex gap-2 items-center">
						{editPage === true && 'New Note'}
						{editPage === false && 'Notes'}
						{typeof editPage === 'string' && 'Edit Note'}
					</p>
				</div>
				<>
					{editPage === false && (
						<Plus
							size={20}
							onClick={handleCreateClick}
							className="text-gray-600 hover:text-isaac cursor-pointer"
							strokeWidth={1.2}
						/>
					)}
					{editPage && (
						<Save
							size={18}
							onClick={handleOnSaveClick}
							className="text-gray-600 hover:text-isaac cursor-pointer"
							strokeWidth={1.2}
						/>
					)}
				</>
			</div>
			<div className="flex px-3 overflow-y-scroll scrollbar-hide max-h-[calc(100vh-100px)] bg-white dark:bg-black w-full">
				<div
					className={clsx(
						editPage === false ? 'w-full' : 'w-0',
						'overflow-x-hidden m-0 scrollbar-hide',
					)}
				>
					{notes && notes.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-full">
							<StickyNote strokeWidth={1.2} size={50} className=" mx-auto text-muted-foreground" />
							<h3 className="mt-4 text-lg font-semibold text-muted-foreground">
								You don&apos;t have any notes yet
							</h3>
							<p className="mt-2 text-sm text-muted-foreground max-w-xs text-center">
								Notes are a great way to keep track of your thoughts and ideas. Click the button below to create your first note.
							</p>
							<div className="mt-6">
								<Button onClick={handleCreateClick} className="bg-isaac hover:bg-white hover:text-isaac hover:border hover:border-isaac">
									<Plus className="w-5 h-5 mr-2" /> Create Note
								</Button>
							</div>
						</div>
					) : (
						<>
							<div className="flex flex-col gap-2">
								{notes?.map(note => (
									<Note
										onClick={() => handleOnNoteClick(note.id)}
										key={note.id}
										initialState={note.text}
										createdAt={new Date(note.created_at)}
										onDeleteClick={() => deleteNote(note.id)}
									/>
								))}
							</div>
						</>
					)}
				</div>

				<div
					className={clsx(
						editPage ? 'w-full' : 'w-0',
						'overflow-x-hidden scrollbar-hide',
					)}
				>
					{!!editPage && (
						<RichTextArea
							contentClassName={clsx('min-h-[600px] text-sm ')}
							editorState={editorState}
							placeholder="Type your note here ..."
							onChange={(state, editor) => {
								setEditorState(state);
								setLexical(editor);
							}}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default React.memo(Notes);
