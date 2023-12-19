import { toast } from 'react-hot-toast';

export default async function generatePDF(
	documentName: string,
	html: any,
	options?: {
		onMutate?: () => void;
		onSuccess?: () => void;
		onSettled?: () => void;
	},
) {
	// setPdfExportLoading(true);
	options.onMutate();

	try {
		const response = await fetch('/api/export-pdf', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				html: html,
				format: 'format1',
			}),
		});

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		const blob = await response.blob();
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${documentName}.pdf`;
		a.click();

		toast.success('PDF Export was successful!');
	} catch (error) {
		console.error('There has been a problem with your fetch operation:', error);
		toast.error(`There was a problem exporting the PDF: ${error.message}`);
	} finally {
		// setPdfExportLoading(false);
		options?.onSettled();
	}
}
