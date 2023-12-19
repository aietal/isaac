import { Button } from '@components/ui/button';
import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogTitle,
	EditorDialog,
} from '@components/ui/editor-dialog';
import { Input } from '@components/ui/input';
import { useUser } from '@context/user';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
	LexicalTypeaheadMenuPlugin,
	useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import useCreateNote from '@resources/notes';
import { $createTextNode, $getSelection } from 'lexical';
import { ArrowDownSquare, Clipboard, Save } from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import toast from 'react-hot-toast';
import { SSE } from 'sse.js';

const ResearchQuestionPlugin = () => {
	const [editor] = useLexicalComposerContext();
	const [queryString, setQueryString] = useState(null);
	const { user } = useUser();
	const language = user?.editor_language;
	const triggerMatch = useBasicTypeaheadTriggerMatch('#', {
		minLength: 0,
	});

	const [researchQuestion, setResearchQuestion] = useState<string>('');
	const [answer, setAnswer] = useState<string>('');
	const [showModal, setShowModal] = useState<boolean>(true);
	const { mutateAsync: createNote } = useCreateNote();
	const [isQuestionSubmitted, setIsQuestionSubmitted] =
		useState<boolean>(false);

	const sseSourceRef = useRef(null); // Ref to store the SSE source

	const abortFetchResearchResponse = () => {
		if (sseSourceRef.current) {
			sseSourceRef.current.close(); // Close the SSE connection
			sseSourceRef.current = null;
		}
	};

	const onModalClose = cleanUp => {
		abortFetchResearchResponse(); // Call abort function when closing the modal
		setAnswer('');
		setIsQuestionSubmitted(false);
		cleanUp();
	};

	async function fetchResearchResponse() {
		const queryParams = new URLSearchParams({ editorLanguage: language });
		const source = new SSE(`/api/research-question?${queryParams.toString()}`, {
			payload: researchQuestion,
		});
		sseSourceRef.current = source;

		source.addEventListener('message', e => {
			const binaryString = atob(e.data);
				const eventMessage = decodeURIComponent(escape(binaryString))
			if (eventMessage === '[DONE]') {
				source.close();
			} else {
				setAnswer(prev => prev + eventMessage);
				setShowModal(true);
			}
		});
		source.stream();
	}

	const onSelectOption = useCallback(
		(selectedOption, nodeToRemove, closeMenu, matchingString) => {
			editor.update(() => {
				if (nodeToRemove) {
					nodeToRemove.remove();
				}
				closeMenu();
			});
		},
		[editor],
	);

	const copyToClipboard = (answer: string) => {
		navigator.clipboard.writeText(answer); //T-75 decide what type of content we want to copy
		toast.success('Copied');
	};

	const onCopyClick = useCallback(() => copyToClipboard(answer), [answer]);

	const saveToNotes = async cleanup => {
		createNote(answer);
		onModalClose(cleanup);
	};

	const submitQuestion = async event => {
		event.preventDefault();
		if (researchQuestion) {
			setShowModal(true);
			setIsQuestionSubmitted(true);
			await fetchResearchResponse();
		}
	};

	return (
		<>
			{/* Typeahead Menu Plugin */}
			<LexicalTypeaheadMenuPlugin
				options={[]}
				onQueryChange={setQueryString}
				onSelectOption={onSelectOption}
				triggerFn={triggerMatch}
				menuRenderFn={(
					anchorElementRef,
					{ selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
				) =>
					anchorElementRef.current
						? ReactDOM.createPortal(
								<>
									<EditorDialog
										defaultOpen
										onOpenChange={() => onModalClose(selectOptionAndCleanUp)}
									>
										{!isQuestionSubmitted ? (
											<DialogContent>
												<DialogTitle>Ask a research question</DialogTitle>
												<form onSubmit={submitQuestion}>
													<Input
														onChange={e => setResearchQuestion(e.target.value)}
														placeholder="Type your research question here..."
													/>
												</form>
												<DialogFooter>
													<Button variant="outline" onClick={submitQuestion}>
														Ask question
													</Button>
												</DialogFooter>
											</DialogContent>
										) : (
											<DialogContent>
												<DialogTitle>{researchQuestion}</DialogTitle>

												<DialogDescription className="text-muted-foreground">
													Isaac can make mistakes. Consider checking important
													information.
												</DialogDescription>

												<div className="overflow-y-auto prose max-h-[400px] w-full whitespace-pre-wrap">
													{answer}
												</div>

												<DialogFooter>
													<div className="w-full inline-flex justify-between items-center">
														<div className="inline-flex gap-2">
															<Button
																onClick={() => {
																	editor.update(() => {
																		const selection = $getSelection();
																		selection.insertNodes([
																			$createTextNode(answer),
																		]);
																	}),
																		onModalClose(selectOptionAndCleanUp);
																}}
																variant="outline"
																size="sm"
															>
																<ArrowDownSquare size={16} className="mr-2" />
																Paste
															</Button>
															<Button
																onClick={onCopyClick}
																variant="outline"
																size="sm"
															>
																<Clipboard size={16} className="mr-2" />
																Copy
															</Button>
														</div>

														<Button
															variant="outline"
															size="sm"
															onClick={() =>
																saveToNotes(selectOptionAndCleanUp)
															}
														>
															<Save size={16} className="mr-2 " />
															Save
														</Button>
													</div>
												</DialogFooter>
											</DialogContent>
										)}
									</EditorDialog>
								</>,
								anchorElementRef.current,
						  )
						: null
				}
			/>
		</>
	);
};

export default ResearchQuestionPlugin;
