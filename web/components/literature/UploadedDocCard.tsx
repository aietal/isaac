import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { useLiteratureReferenceStore } from '@context/literatureReference.store';
import { useUser } from '@context/user';
import useDeleteUserUpload from '@hooks/api/useDeleteUserUpload';
import { useHover } from '@mantine/hooks';
import clsx from 'clsx';
import { BookUp, Check, Pen, Trash, X } from 'lucide-react';
import { useState } from 'react';

type Props = {
	id: string;
	title: string;
	created_at: string;
	fileName: string;
	year?: number;
	authors?: string[];
	onClick: () => void;
};

function getDocumentType(extension) {
	const extensionLabels = {
		docx: 'Word',
		doc: 'Word',
		odt: 'Text',
		pptx: 'PowerPoint',
		ppt: 'PowerPoint',
		xlsx: 'Excel',
		csv: 'CSV',
		tsv: 'TSV',
		eml: 'Email',
		msg: 'Message',
		rtf: 'Rich Text',
		epub: 'eBook',
		html: 'HTML',
		xml: 'XML',
		pdf: 'PDF',
		png: 'Image',
		jpg: 'Image',
		jpeg: 'Image',
	};

	return extensionLabels[extension] || 'Unknown';
}

const UploadedDocCard = ({
	id,
	title,
	onClick,
	created_at,
	year,
	authors,
	fileName,
}: Props) => {
	const { hovered, ref } = useHover();
	const setShowUploadMetaModal = useLiteratureReferenceStore(
		s => s.setShowUploadMetaModal,
	);

	const extension = fileName ? fileName.split('.').pop().toLowerCase() : '';
	const documentType = getDocumentType(extension);
	const { deleteUpload } = useDeleteUserUpload();
	const [deleting, setDeleting] = useState(false);
	const { user } = useUser();

	return (
		<div
			ref={ref}
			className="text-xs w-full flex justify-between gap-3 rounded-md border border-border hover:shadow-md p-3 hover:cursor-pointer"
			onClick={onClick}
		>
			<div className="flex gap-3 ">
				<div>
					<BookUp
						strokeWidth={1.2}
						size={18}
						className="text-neutral-700 dark:text-neutral-200"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<p className="font-semibold text-neutral-700 dark:text-inherit">
						{title}
					</p>
					{Array.isArray(authors) && (
						<p>
							{authors.slice(0, 2).join(' & ')}
							{authors.length > 3 && ' et al.'}
						</p>
					)}
					<div className="flex gap-2">
						{!!year && <Badge variant="accent">{year}</Badge>}
						<Badge variant="accent">
							{/* {`Uploaded: ${format(new Date(created_at), 'dd MMMM yyyy')}`} */}
							{documentType}
						</Badge>
					</div>
				</div>
			</div>
			<div
				className={clsx(
					'flex gap-1  transition-opacity',
					hovered ? 'opacity-100' : 'opacity-0',
				)}
			>
				{deleting ? (
					<>
						<Button
							variant="ghost"
							size="icon"
							onClick={event => {
								event.stopPropagation();
								deleteUpload(id, user?.id);
							}}
							className={clsx('p-1 h-5 w-6 text-muted-foreground ')}
						>
							<Check size={18} strokeWidth={1.4} />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							onClick={event => {
								event.stopPropagation();
								setDeleting(false);
							}}
							className={clsx('p-1 h-6 w-6 text-muted-foreground ')}
						>
							<X strokeWidth={1.4} size={18} />
						</Button>
					</>
				) : (
					<>
						<Button
							variant="ghost"
							size="icon"
							onClick={event => {
								event.stopPropagation();
								setShowUploadMetaModal({ uploadId: id, fileName: title });
							}}
							className={clsx('p-1 h-6 w-6 text-muted-foreground ')}
						>
							<Pen size={18} strokeWidth={1.4} />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							onClick={event => {
								event.stopPropagation();
								setDeleting(true);
							}}
							className={clsx('p-1 h-6 w-6 text-muted-foreground ')}
						>
							<Trash strokeWidth={1.4} size={18} />
						</Button>
					</>
				)}
			</div>
		</div>
	);
};

export default UploadedDocCard;
