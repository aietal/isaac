import { cn } from '@components/lib/utils';
import { Button } from '@components/ui/button';
import { Card, CardContent, CardFooter } from '@components/ui/card';
import useAIAssistantStore from '@context/aiAssistant.store';
import { $createListItemNode, $createListNode } from '@lexical/list';
import { $isAIOutputNode } from '@lexical/nodes/AIOutputNode';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { motion } from 'framer-motion';
import {
	$createParagraphNode,
	$createTextNode,
	$getNodeByKey,
	$getSelection,
	$isRangeSelection,
	$setSelection,
} from 'lexical';
import { Check, Trash } from 'lucide-react';
import { useCallback } from 'react';

const notifications = [
	{
		title: 'Your call has been confirmed.',
		description: '1 hour ago',
	},
	{
		title: 'You have a new message!',
		description: '1 hour ago',
	},
	{
		title: 'Your subscription is expiring soon!',
		description: '2 hours ago',
	},
];

type CardProps = React.ComponentProps<typeof Card>;

interface AIOutputComponentProps extends CardProps {
	nodeKey: string; // Add custom properties here
}

const AIOutputComponent = ({
	className,
	nodeKey,
	...props
}: AIOutputComponentProps) => {
	const AIOutput = useAIAssistantStore(state => state.AITextOutput);
	const [editor] = useLexicalComposerContext();
	const cachedSelection = useAIAssistantStore(state => state.cachedSelection);
	const { setAITextOutput, setOpen, setAIOperation } = useAIAssistantStore(
		state => state.actions,
	);

	const acceptText = () => {
		editor.focus();

		editor.update(() => {
			$setSelection(cachedSelection);
			const selection = $getSelection();

			if (!$isRangeSelection(selection)) {
				console.log('not range selection');
				return;
			}

			// handle list output, might need better detection algo, but this should suffice
			if (AIOutput.startsWith('- ')) {
				// bullet list
				const listNode = $createListNode('bullet');
				const items = AIOutput.split('- ');

				items.forEach(item => {
					if (item) {
						const listItem = $createListItemNode();
						listItem.append($createTextNode(item));
						listNode.append(listItem);
					}
				});

				selection.insertNodes([listNode]);
			} else if (AIOutput.startsWith('1. ')) {
				// TODO: Handle for numbered list
			} else {
				const aiOutputNode = $createTextNode(AIOutput.trim());
				selection.insertNodes([aiOutputNode]);
			}

			//* Clean up
			const node = $getNodeByKey(nodeKey);

			if ($isAIOutputNode(node)) {
				node.remove();
				setAITextOutput('');
				setOpen(false);
				setAIOperation(undefined);
			}
		});
	};

	const discard = useCallback(() => {
		editor.update(() => {
			const node = $getNodeByKey(nodeKey);

			if ($isAIOutputNode(node)) {
				node.remove();
				setAITextOutput('');
				setOpen(false);
				setAIOperation(undefined);
			}
		});
	}, [editor, nodeKey, setAITextOutput]);

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
					<div className="flex items-center rounded-md border-none">
						<p>{AIOutput}</p>
					</div>
				</CardContent>
				<CardFooter className="inline-flex items-center gap-2">
					<Button
						className="inline-flex items-center"
						variant="outline"
						onClick={acceptText}
					>
						<Check className="mr-1 h-4 w-4" size={20} strokeWidth={1.2} />
						<span>Replace selection </span>
					</Button>
					<Button onClick={discard} variant="ghost">
						<Trash className="mr-1 h-4 w-4" size={20} strokeWidth={1.2} />{' '}
						<span> Discard</span>
					</Button>
				</CardFooter>
			</Card>
		</motion.div>
	);
};

export default AIOutputComponent;
