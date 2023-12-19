import { ShieldAlert } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function TextFilesViewer({ path }) {
	const [content, setContent] = useState('');
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(path);
				if (!response.ok) {
					toast.error('Failed to load file');
				}
				const data = await response.text();
				setContent(data);
			} catch (e) {
				setError(e.message);
			}
		};

		fetchData();
	}, [path]);

	return (
		<div className="items-center justify-center mx-auto text-center">
			{error ? (
				<div className="flex inline-flex items-center">
					<ShieldAlert size={18} strokeWidth={1.4} className="mr-1" />
					<span>Failed to load file.</span>
				</div>
			) : (
				<pre>{content}</pre>
			)}
		</div>
	);
}
