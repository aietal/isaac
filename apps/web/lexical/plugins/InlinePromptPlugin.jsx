import { useUser } from '@context/user';
import { QKFreeAIToken } from '@hooks/api/useFreeTierLimit.get';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
	LexicalTypeaheadMenuPlugin,
	MenuOption,
	useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import { useFocusTrap, useLocalStorage } from '@mantine/hooks';
import clsx from 'clsx';
import { AIModelLocalStorageKey, AIModels } from 'data/aiModels.data';
import { AnimatePresence, motion } from 'framer-motion';
import { $createTextNode, $getSelection } from 'lexical';
import { AlertCircle } from 'lucide-react';
import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as ReactDOM from 'react-dom';
import { useQueryClient } from 'react-query';
import { SSE } from 'sse.js';

class ComponentPickerOption extends MenuOption {
	constructor(title, options) {
		super(title);
		this.title = title;
		this.keywords = options.keywords || [];
		this.icon = options.icon;
		this.keyboardShortcut = options.keyboardShortcut;
		this.onSelect = options.onSelect.bind(this);
	}
}

const InlinePromptPlugin = () => {
	const [editor] = useLexicalComposerContext();
	const [queryString, setQueryString] = useState(null);
	const queryClient = useQueryClient();
	const { user } = useUser();
	const checkForTriggerMatch = useBasicTypeaheadTriggerMatch('$', {
		minLength: 0,
	});

	const [llmModel] = useLocalStorage({ key: AIModelLocalStorageKey });

	const getDynamicOptions = useCallback(() => {
		const options = [];

		if (queryString == null) {
			return options;
		}

		const fullTableRegex = new RegExp(/^([1-9]|10)x([1-9]|10)$/);
		const partialTableRegex = new RegExp(/^([1-9]|10)x?$/);

		const fullTableMatch = fullTableRegex.exec(queryString);
		const partialTableMatch = partialTableRegex.exec(queryString);

		if (fullTableMatch) {
			const [rows, columns] = fullTableMatch[0]
				.split('x')
				.map(n => parseInt(n, 10));

			options.push(
				new ComponentPickerOption(`${rows}x${columns} Table`, {
					icon: <i className="table icon" />,
					keywords: ['table'],
					onSelect: () =>
						// eslint-ignore-next-line @typescript-eslint/ban-ts-ignore

						// Correct types, but since they're dynamic TS doesn't like it.
						editor.dispatchCommand(INSERT_TABLE_COMMAND, { columns, rows }),
				}),
			);
		} else if (partialTableMatch) {
			const rows = parseInt(partialTableMatch[0], 10);

			options.push(
				...Array.from({ length: 5 }, (_, i) => i + 1).map(
					columns =>
						new ComponentPickerOption(`${rows}x${columns} Table`, {
							icon: <i className="table icon" />,
							keywords: ['table'],
							onSelect: () =>
								// eslint-ignore-next-line @typescript-eslint/ban-ts-ignore
								//Correct types, but since they're dynamic TS doesn't like it.
								editor.dispatchCommand(INSERT_TABLE_COMMAND, { columns, rows }),
						}),
				),
			);
		}

		return options;
	}, [editor, queryString]);

	// Inline prompt function
	const [inlineCommand, setInlineCommand] = useState('');

	async function inlinePrompt(e) {
		e.preventDefault();

		// if text is longer than 750 characters keep only the last 750 characters

		const source = new SSE(
			`/api/inline-prompt?userId=${user?.id}&llmModel=${
				llmModel || 'gpt-3.5-turbo'
			}`,
			{
				payload: inlineCommand,
			},
		);

		source.addEventListener('message', function (e) {
			const binaryString = atob(e.data);
				const eventMessage = decodeURIComponent(escape(binaryString))
			if (eventMessage === '[DONE]') {
				source.close();
				queryClient.invalidateQueries([QKFreeAIToken]);
			} else {
				// remove two line breaks after another from the text
				const text = eventMessage.replace(/\n\n/g, '');

				editor.update(() => {
					const selection = $getSelection();

					selection.insertNodes([$createTextNode(text)]);
				});
			}
		});
		source.stream();
	}

	const options = useMemo(() => {
		const baseOptions = [
			new ComponentPickerOption('Generate Outline', {
				icon: <AlertCircle size={18} className="mr-2 text-neutral-500" />,
				keywords: ['outline', 'generate outline', 'generate'],
				onSelect: () => setOpen(open => !open),
			}),
		];

		const dynamicOptions = getDynamicOptions();

		return queryString
			? [
					...dynamicOptions,
					...baseOptions.filter(option => {
						return new RegExp(queryString, 'gi').exec(option.title) ||
							option.keywords != null
							? option.keywords.some(keyword =>
									new RegExp(queryString, 'gi').exec(keyword),
							  )
							: false;
					}),
			  ]
			: baseOptions;
	}, [editor, getDynamicOptions, queryString]);

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

	const [open, setOpen] = useState(false);

	const focusTrapRef = useFocusTrap();
	const elementRef = useRef(null);

	const handleEnter = (e, cleanup) => {
		if (e.key === 'Enter' && inlineCommand) {
			if (!e.shiftKey && inlineCommand) {
				cleanup();
				inlinePrompt(e);
			}
		} else if (e.key === 'Enter') {
			e.preventDefault();
		} else if (
			(e.key === 'Backspace' && inlineCommand === '') ||
			(e.key === 'Delete' && inlineCommand === '')
		) {
			cleanup();
		}
	};

	const [maxWidth, setMaxWidth] = useState(null);

	useEffect(() => {
		if (inlineCommand.length <= 1) {
			const element = elementRef.current;
			const rect = element?.getBoundingClientRect();
			const availableSpace = window.innerWidth - rect?.left;
			setMaxWidth(availableSpace);
		}
	}, [inlineCommand]);

	return (
		<>
			<>
				<LexicalTypeaheadMenuPlugin
					onQueryChange={setQueryString}
					onSelectOption={onSelectOption}
					triggerFn={checkForTriggerMatch}
					options={options}
					style={{ maxWidth: maxWidth }}
					menuRenderFn={(
						anchorElementRef,
						{ selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
					) =>
						anchorElementRef.current && options.length
							? ReactDOM.createPortal(
									<>
										<AnimatePresence>
											<motion.div
												ref={elementRef}
												className={clsx(
													'ml-4 text-isaac flex-1 w-full -mt-[11.5px] dark:-mt-[6.5px]',
												)}
												initial={{ opacity: 0, width: 0 }}
												animate={{
													opacity: 1,
													width: !maxWidth || isNaN(maxWidth) ? 350 : maxWidth,
												}}
												transition={{
													duration: 0.8,
													ease: 'easeInOut',
													type: 'spring',
													stiffness: 35,
												}}
												exit={{ opacity: 0, scale: 0.5 }}
											>
												<div
													className={clsx(
														'inline-flex items-center gap-1 w-full',
													)}
												>
													<textarea
														ref={focusTrapRef}
														className={clsx(
															'absolute prose dark:prose-invert text-isaac resize-none w-[600px] bg-transparent rounded-lg text-[15px] outline-none border-0 focus:ring-0 focus:outline-none scrollbar-hide mt-2',
														)}
														rows="1"
														onInput={e => {
															e.target.rows = e.target.value.split('\n').length; // adjust the number of rows based on the number of newline characters in the text
														}}
														onChange={e => setInlineCommand(e.target.value)}
														onClick={e => e.stopPropagation()}
														onKeyDown={e =>
															handleEnter(e, selectOptionAndCleanUp)
														}
														placeholder="How can I help you?"
														style={{
															wordWrap: 'break-all',
															maxWidth: maxWidth,
														}}
													/>
												</div>
											</motion.div>
										</AnimatePresence>
									</>,
									anchorElementRef.current,
							  )
							: null
					}
				/>
			</>
		</>
	);
};

export default InlinePromptPlugin;
