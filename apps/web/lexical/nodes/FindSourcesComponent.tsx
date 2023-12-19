import { cn } from '@components/lib/utils';
import FindSourcesLiteratureCard, {
	FindSourcesLiteratureCardSkeleton,
} from '@components/literature/FindSourcesLiteratureCard';
import { Card, CardContent, CardFooter } from '@components/ui/card';

import useAIAssistantStore from '@context/aiAssistant.store';
import {
	ReferenceSection,
	useLiteratureReferenceStore,
} from '@context/literatureReference.store';
import useAddReference from '@hooks/api/useAddToReference';
import useGetEditorRouter from '@hooks/useGetEditorRouter';
import { $isAIOutputNode } from '@lexical/nodes/AIOutputNode';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useDeleteReference, useGetReference } from '@resources/editor-page';
import { motion } from 'framer-motion';
import {
	$getNodeByKey,
	$getSelection,
	$isRangeSelection,
	$setSelection,
} from 'lexical';
import { X } from 'lucide-react';
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { LiteratureSource } from 'types/chat';
import {
	ReferenceLiterature,
	ReferenceType,
} from 'types/literatureReference.type';
import { $createCitationNode } from './CitationNode';

type CardProps = React.ComponentProps<typeof Card>;

interface FindSourcesComponentProps extends CardProps {
	nodeKey: string; // Add custom properties here
}

const AISearchSourceComponent = ({
	className,
	nodeKey,
	...props
}: FindSourcesComponentProps) => {
	const literatures = useAIAssistantStore(
		state => state.literatureReferenceOutput,
	);
	const { projectId } = useGetEditorRouter();
	const [editor] = useLexicalComposerContext();
	const cachedSelection = useAIAssistantStore(state => state.cachedSelection);
	const isLoading = useAIAssistantStore(
		state => state.literatureReferenceOutputLoading,
	);
	const { setLiteratureReferenceOutput, setOpen } = useAIAssistantStore(
		state => state.actions,
	);
	const { data: _referenceList } = useGetReference(projectId);

	const { mutateAsync: addToReference } = useAddReference();
	const { mutateAsync: removeReference } = useDeleteReference();

	const handleApply = async (
		{ paperId, ...lit }: LiteratureSource,
		refs?: ReferenceLiterature,
	) => {
		editor.focus();
		let savedLit: ReferenceLiterature;

		if (refs) {
			savedLit = refs;
		} else {
			const data = await addToReference({ projectId, papers: [lit] });
			savedLit = data[0] as ReferenceLiterature;
		}
		if (!savedLit) {
			return toast.error('Unable to create');
		}
		editor.update(() => {
			$setSelection(cachedSelection);
			const selection = $getSelection();

			if (!$isRangeSelection(selection)) {
				console.log('not range selection');
				return;
			}

			// TODO: Insert citation node instead
			const citationNode = $createCitationNode(
				{
					...savedLit,
					sourceType: 'reference',
					index: 1,
				},
				true,
			);

			const lastNode = selection.isBackward()
				? selection.anchor.getNode()
				: selection.focus.getNode();
			const lastNodeOffset = selection.isBackward()
				? selection.anchor.offset
				: selection.focus.offset;
			//
			const [targetNode] = lastNode.splitText(lastNodeOffset);
			targetNode.insertAfter(citationNode);
			const node = $getNodeByKey(nodeKey);
			if ($isAIOutputNode(node)) {
				node.remove();
				setLiteratureReferenceOutput(undefined);
				setOpen(false);
			}
		});
	};

	const discard = useCallback(() => {
		editor.update(() => {
			const node = $getNodeByKey(nodeKey);

			if ($isAIOutputNode(node)) {
				node.remove();
				setLiteratureReferenceOutput(undefined);
				setOpen(false);
			}
		});
	}, [editor, nodeKey]);

	const setLiteratureDOIPreview = useLiteratureReferenceStore(
		s => s.setLiteratureDOIPreview,
	);

	return (
		<motion.div
			onClick={e => e.stopPropagation()}
			initial={{ opacity: 0.5, y: 5, scaleX: 0.9, scaleY: 0.7 }}
			animate={{ opacity: 1, y: 0, scaleX: 1, scaleY: 1 }}
			transition={{ duration: 0.5, ease: 'easeInOut' }}
		>
			<Card
				className={cn(
					'w-full bg-transparent shadow-none mt-4 mx-0 border-isaac/20',
					className,
				)}
				{...props}
			>
				<CardContent className="grid gap-4">
					<div className="flex flex-col gap-2 pt-3 rounded-md border-none">
						<div className="flex justify-between">
							{!isLoading && (
								<span className="font-semibold text-xs">
									Suggested sources:
								</span>
							)}
							<button className="" onClick={discard}>
								<X strokeWidth={1} size={16} />
							</button>
						</div>
						{isLoading && (
							<>
								<FindSourcesLiteratureCardSkeleton />
								<FindSourcesLiteratureCardSkeleton />
								<FindSourcesLiteratureCardSkeleton />
							</>
						)}
						{literatures?.map((lit, idx) => {
							const savedRef = _referenceList?.find(ref => ref.doi === lit.doi);

							return (
								<FindSourcesLiteratureCard
									key={lit.doi}
									added={!!savedRef}
									source="Search"
									displayCta
									title={lit.title}
									authors={lit.authors.map(i => i.name)}
									year={lit.year}
									type={ReferenceType.ARTICLE}
									onClick={() => {
										setLiteratureDOIPreview(
											lit.doi,
											savedRef
												? ReferenceSection.SAVED_REFERENCES
												: ReferenceSection.SEARCH_LITERATURE,
										);
									}}
									onAdd={() => {
										const { paperId, ...data } = lit;
										addToReference({ projectId, papers: [data] });
									}}
									onRemove={() => removeReference(savedRef.id)}
									onApply={() => handleApply(lit, savedRef)}
								/>
							);
						})}
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default AISearchSourceComponent;
