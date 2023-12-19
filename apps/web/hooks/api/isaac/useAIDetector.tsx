import { Check, X } from 'lucide-react';
import React from 'react';
import toast from 'react-hot-toast';

const useAIDetector = () => {
	const sendToAIDetector = async (text: string) => {
		const detectAI = async () => {
			const response = await fetch('/api/ai-detector', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ text }),
			});
			return await response.json();
		};

		toast.promise(
			detectAI(),
			{
				loading: 'Detecting...',
				success: data => {
					const fake = data.data.fake_probability > data.data.real_probability;

					const icon = fake ? (
						<X size={16} className="text-red-500" />
					) : (
						<Check size={16} className="text-green-500" />
					);

					const message = fake
						? `Likely AI Generated (${Math.round(
								data.data.fake_probability * 100,
						  )}%)`
						: `Likely not AI Generated (${Math.round(
								data.data.real_probability * 100,
						  )}%)`;

					return (
						<div className="flex items-center gap-2">
							{icon}
							{message}
						</div>
					);
				},
				error: error => `Detection failed: ${error.message}`,
			},
			{
				style: {
					minWidth: '250px',
				},
				success: {
					duration: 5000,
				},
			},
		);
	};
	return { sendToAIDetector };
};

export default useAIDetector;
