import { Button } from '@components/ui/button';
import {
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@components/ui/dialog';
import { Popover, PopoverContent } from '@components/ui/popover';
import { Textarea } from '@components/ui/textarea';
import { useUIStore } from '@context/ui.store';
import { useUser } from '@context/user';
import { PopoverTrigger } from '@radix-ui/react-popover';
import { useUpdateCustomInstructions } from '@resources/user';
import React, { useEffect, useRef, useState } from 'react';

const CustomInstructionsModal = () => {
	const setCustomInstructionsModalOpen = useUIStore(
		s => s.setCustomInstructionsModalOpen,
	);
	const [instructions, setInstructions] = useState<string>('');
	const [responseInstructions, setResponseInstructions] = useState<string>('');
	const [showInstructionsPopover, setShowInstructionsPopover] =
		useState<boolean>(false);
	const [showResponsePopover, setShowResponsePopover] =
		useState<boolean>(false);

	const instructionsTextareaRef = useRef<HTMLTextAreaElement>(null);
	const responseTextareaRef = useRef<HTMLTextAreaElement>(null);
	const { user } = useUser();

	const { mutateAsync: updateCustomInstructions } =
		useUpdateCustomInstructions();

	useEffect(() => {
		if (user && user.custom_instructions) {
			const customInstructions = user.custom_instructions;

			setInstructions(customInstructions.instructions || '');
			setResponseInstructions(customInstructions.responseInstructions || '');
		}
	}, [user]);

	const maxLength = 1000;

	const submitUpdateCustomInstructions = async () => {
		const customInstructions = {
			instructions: instructions,
			responseInstructions: responseInstructions,
		};

		try {
			await updateCustomInstructions({
				userId: user?.id,
				customInstructions: customInstructions,
			});

			setCustomInstructionsModalOpen(false);
		} catch (error) {
			console.error('Failed to update custom instructions:', error);
		}
	};
	return (
		<DialogContent className="sm:max-w-[725px]">
			<DialogHeader className="mb-4">
				<DialogTitle>Custom Instructions</DialogTitle>
			</DialogHeader>

			<p className="text-muted-foreground pb-3 pt-2 text-sm">
				What would you like Isaac to know about you to provide better responses?
			</p>

			<div className="relative mb-4">
				<Popover open={showInstructionsPopover}>
					<PopoverTrigger asChild>
						<Textarea
							rows={8}
							maxLength={maxLength}
							value={instructions}
							onChange={e => setInstructions(e.target.value)}
							className=""
							onMouseEnter={() => setShowInstructionsPopover(true)}
							onMouseLeave={() => setShowInstructionsPopover(false)}
							ref={instructionsTextareaRef}
						/>
					</PopoverTrigger>
					<p className="text-muted-foreground text-xs mt-2">
						{instructions.length}/{maxLength}
					</p>

					<PopoverContent side="right" align="center" sideOffset={20}>
						<p className="text-foreground font-medium">Thought starters</p>
						<ul className="text-muted-foreground text-sm list-disc ml-4 mt-1">
							<li>What&apos;s your name? Where are you based?</li>
							<li>What scientific field are you most interested in?</li>
							<li>Are you a researcher or a student?</li>
							<li>What type of projects are you working on?</li>
							<li>
								Is there a particular problem you&apos;re trying to solve?
							</li>
						</ul>
					</PopoverContent>
				</Popover>
			</div>

			<p className="text-muted-foreground pb-3 pt-2 text-sm">
				How would you like Isaac to respond?
			</p>

			<div className="relative">
				<Popover open={showResponsePopover}>
					<PopoverTrigger asChild>
						<Textarea
							rows={8}
							maxLength={maxLength}
							value={responseInstructions}
							onChange={e => setResponseInstructions(e.target.value)}
							onMouseEnter={() => setShowResponsePopover(true)}
							onMouseLeave={() => setShowResponsePopover(false)}
							ref={responseTextareaRef}
						/>
					</PopoverTrigger>
					<p className="text-muted-foreground text-xs mt-2">
						{responseInstructions.length}/{maxLength}
					</p>

					<PopoverContent side="right" align="center" sideOffset={20}>
						<p className="text-foreground font-medium">Thought starters</p>
						<ul className="text-muted-foreground text-sm list-disc ml-4 mt-1">
							<li>How formal or casual should Isaac respond?</li>
							<li>How long or short should responses generally be?</li>
							<li>How do you want to be addressed?</li>
							<li>Should Isaac have opinions on topics or remain neutral?</li>
						</ul>
					</PopoverContent>
				</Popover>
			</div>

			<DialogFooter>
				<Button variant="outline">Cancel</Button>
				<Button onClick={submitUpdateCustomInstructions}>Save</Button>
			</DialogFooter>
		</DialogContent>
	);
};

export default React.memo(CustomInstructionsModal);
