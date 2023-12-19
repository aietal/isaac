import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@components/ui/accordion';
import { Button } from '@components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@components/ui/dialog';
import { useUIStore } from '@context/ui.store';
import { useTour } from '@reactour/tour';
import { productGuideContent } from 'data/productGuideData';
import React from 'react';

const ProductGuideModal = () => {
	const { setIsOpen: setTutorialMode, setCurrentStep } = useTour();
	const closePanel = useUIStore(s => s.closePanel);
	const setProductGuideModalOpen = useUIStore(s => s.setProductGuideModalOpen);
	const productGuideModalOpen = useUIStore(s => s.productGuideModalOpen);

	return (
		<Dialog
			open={productGuideModalOpen}
			onOpenChange={setProductGuideModalOpen}
		>
			<DialogContent className="sm:max-w-[725px]">
				<DialogHeader>
					<DialogTitle>How to use Isaac</DialogTitle>
				</DialogHeader>
				<Accordion type="single" collapsible className="w-full">
					{productGuideContent.map(item => (
						<AccordionItem value={item.title} key={item.title}>
							<AccordionTrigger>{item.title}</AccordionTrigger>
							<AccordionContent>
								<div dangerouslySetInnerHTML={{ __html: item.content }} />
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>

				<DialogFooter>
					<Button
						className="mt-8"
						onClick={() => {
							setProductGuideModalOpen(false);
							closePanel();
							setCurrentStep(0);
							setTutorialMode(true);
						}}
					>
						Restart Product Tour
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default ProductGuideModal;
