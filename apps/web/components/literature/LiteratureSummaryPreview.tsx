import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Separator } from '@components/ui/separator';
import useDocumentTabs, { TabType } from '@hooks/useDocumentTabs';
import { startCase } from 'lodash';
import { ArrowLeft, BookOpen, FileSymlink, Users } from 'lucide-react';

import Link from 'next/link';
import { LiteraturePreview } from 'types/literatureReference.type';

export type LiteraturePreviewProps = LiteraturePreview & {
	onOpenPdf?: () => void;
	onClose: () => void;
};

const LiteratureSummaryPreview = ({ ...lit }: LiteraturePreviewProps) => {
	const { openDocument } = useDocumentTabs();

	const openPdf = () => {
		openDocument({
			source: lit.pdfUrl,
			type: TabType.SemanticScholar,
			label: lit.title,
		});
	};
	return (
		<div className="flex flex-col relative p-3">
			<Button
				className="p-0 justify-start text-muted-foreground hover:bg-transparent hover:shadow-none hover:text-isaac"
				variant="ghost"
				size="xs"
				onClick={lit.onClose}
			>
				<ArrowLeft className="mr-1" strokeWidth={1.2} size={16} />
				<span>Back to Results</span>{' '}
			</Button>

			<div className="flex flex-col gap-3 relative mt-4">
				<p className="text-md font-medium">{lit.title}</p>

				<div className="flex flex-col gap-2">
					<div className="flex items-start gap-2 text-xs ">
						<div>
							<Users size={18} strokeWidth={1.4} />
						</div>
						<p className="line-clamp-5">
							{lit.authors?.map(author => author.name).join(', ')}
						</p>
					</div>

					<div className="flex items-start gap-2 text-xs">
						<div>
							<BookOpen size={18} strokeWidth={1.4} />
						</div>
						<p className="">{lit.journalName || 'Unknown Journal'}</p>
					</div>
				</div>
				<div className="flex flex-wrap gap-1 text-xs items-center inline-flex min-h-6">
					<Badge
						className="whitespace-nowrap text-xs font-medium bg-accent"
						variant="accent"
					>
						{lit.year}
					</Badge>

					<Badge variant="accent">{`${
						lit.citationCount || '?'
					} Citations`}</Badge>

					{lit.litType?.map(type => (
						<Badge variant="accent" key={type}>
							{startCase(type)}
						</Badge>
					))}
					<Separator orientation="vertical" />
					<Link
						href={{
							pathname: location.pathname,
							query: {
								url: lit.pdfUrl,
							},
						}}
					>
						<Button
							onClick={openPdf}
							disabled={!lit.pdfUrl}
							variant="outline"
							size="sm"
							className="h-6 text-xs"
						>
							<FileSymlink className="w-4 h-4 mr-1" strokeWidth={1.4} />{' '}
							<span> {lit.pdfUrl ? 'View PDF' : 'No PDF'}</span>
						</Button>
					</Link>
				</div>
				<p className="font-medium over">Abstract</p>

				{lit.abstract ? (
					<p className="pr-4 text-sm leading-relaxed text-justify overflow-y-auto max-h-[60vh]">
						{lit.abstract}{' '}
					</p>
				) : (
					<p className="pr-4 text-sm text-muted-foreground max-h-[50vh]">
						No abstract available
					</p>
				)}
			</div>
		</div>
	);
};

export default LiteratureSummaryPreview;
