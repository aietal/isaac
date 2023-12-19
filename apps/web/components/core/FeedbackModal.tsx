import { Button } from '@components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@components/ui/dialog';
import { Textarea } from '@components/ui/textarea';
import { useUIStore } from '@context/ui.store';
import clsx from 'clsx';
import { Check, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface FeedbackModalProps {
	userEmail: string;
}

const FeedbackModal = (props: FeedbackModalProps) => {
	const [loading, setLoading] = useState(false);
	const [feedbackText, setFeedbackText] = useState('');
	const [submitted, setSubmitted] = useState(false);
	const setFeedbackModalOpen = useUIStore(s => s.setFeedbackModalOpen);
	const feedbackModalOpen = useUIStore(s => s.feedbackModalOpen);
	const { userEmail } = props;

	async function submitFeedback() {
		setLoading(true);

		try {
			const response = await fetch('/api/submit-feedback', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					feedbackText: feedbackText,
					userEmail: userEmail,
				}),
			});

			const data = await response.json();

			if (data) {
				setLoading(false);
				setSubmitted(true);

				// timeout for 2 seconds
				setTimeout(() => {
					setFeedbackModalOpen(false);
					setSubmitted(false);
				}, 1500);
			} else {
				throw new Error('Failed to submit feedback');
			}
		} catch (error) {
			console.error(error);
			toast.error('Failed to submit feedback.');
		} finally {
			setLoading(false);
		}
	}

	return (
		<Dialog open={feedbackModalOpen} onOpenChange={setFeedbackModalOpen}>
			<DialogContent className="sm:max-w-[725px]">
				<DialogHeader>
					<DialogTitle>How can we improve Isaac?</DialogTitle>
				</DialogHeader>
				<div>
					<div className="mt-1">
						<Textarea
							onChange={e => setFeedbackText(e.target.value)}
							placeholder="How can we improve Isaac? What don't you like?"
							defaultValue={''}
							rows={5}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button
						variant="default"
						onClick={submitFeedback}
						className={clsx(
							' text-sm font-semibold rounded-md py-2 px-4 text-white inline-flex gap-2 items-center',
							submitted ? 'bg-teal-600' : 'bg-primary',
						)}
						disabled={loading || submitted}
					>
						{submitted ? 'Feedback Submitted!' : 'Submit Feedback'}
						{submitted && <Check size={20} strokeWidth={1.2} />}
						{loading && (
							<Loader2 size={20} strokeWidth={1.2} className="animate-spin" />
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default FeedbackModal;
