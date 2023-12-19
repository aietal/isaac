import { ReferenceTypeIconsMap } from '@components/core/IconMap';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Skeleton } from '@components/ui/skeleton';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@components/ui/tooltip';
import { useHover } from '@mantine/hooks';
import clsx from 'clsx';
import { capitalize, startCase } from 'lodash';
import { Book, Bookmark, FileSymlink } from 'lucide-react';
import { ReferenceType } from 'types/literatureReference.type';

type FindSourcesLiteratureCardProps = {
	title: string;
	onClick: () => void;
	authors: string[];
	year: number;
	source: 'Search' | 'Upload';
	onAdd?: () => void;
	onRemove?: () => void;
	onApply?: () => void;
	added?: boolean;
	type: ReferenceType;
	displayCta?: boolean;
};

const FindSourcesLiteratureCard = ({
	title,
	onClick,
	year,
	authors,
	source,
	onRemove,
	onAdd,
	onApply,
	type,
	added,
	displayCta,
}: FindSourcesLiteratureCardProps) => {
	const { hovered, ref } = useHover();

	const Icon = ReferenceTypeIconsMap[type] || Book;

	return (
		<div
			ref={ref}
			className="flex justify-between w-full p-2 text-sm rounded-md hover:cursor-pointer"
			onClick={onClick}
		>
			<div className="flex gap-3">
				<div>
					{source === 'Search' && (
						<Icon
							strokeWidth={1.2}
							className="mt-1 text-neutral-700 dark:text-inherit"
							size={18}
						/>
					)}
				</div>
				<div>
					<p className="my-0 font-semibold text-neutral-700 dark:text-inherit text-xs">
						{title}
					</p>
					<div className="leading-7 break-words text-neutral-700 dark:text-neutral-400 line-clamp-1 text-xs">
						<p className="my-0">
							{!authors.length && 'Authors Unspecified'}
							{authors.slice(0, 2).join(' & ')}
							{authors.length > 3 && ' et al.'}
						</p>
						<div className="flex gap-2">
							<Badge variant="accent" className="text-xs" key={type}>
								{startCase(capitalize(type || ReferenceType.JOURNAL))}
							</Badge>
							{!!year && <Badge variant="accent">{year}</Badge>}
							<Badge variant="accent">PDF</Badge>
						</div>
					</div>
				</div>
			</div>
			<div
				className={clsx(
					'inline-flex items-center transition-opacity gap-3',
					displayCta || hovered ? 'opacity-100' : 'opacity-0',
				)}
			>
				{!!onApply && (
					<Button
						size="sm"
						variant="ghost"
						onClick={e => {
							e.stopPropagation();
							onApply();
						}}
					>
						{' '}
						<FileSymlink className="mr-1 h-4 w-4" size={20} strokeWidth={1.2} />
						Insert citation{' '}
					</Button>
				)}
				<Tooltip>
					<TooltipTrigger>
						<Button
							size="icon"
							variant="ghost"
							onClick={e => {
								e.stopPropagation();
								!added ? onAdd() : onRemove();
							}}
						>
							<Bookmark
								className={clsx(' h-4 w-4', added && 'fill-isaac stroke-isaac')}
								size={20}
								strokeWidth={1.2}
							/>
						</Button>
					</TooltipTrigger>
					<TooltipContent side="right">
						{added ? 'Remove from references' : 'Save to references'}{' '}
					</TooltipContent>
				</Tooltip>
			</div>
		</div>
	);
};

export default FindSourcesLiteratureCard;

export const FindSourcesLiteratureCardSkeleton = () => {
	return (
		<div className="flex justify-between gap-10 p-4 text-sm border rounded-md border-border hover:shadow-md hover:cursor-pointer">
			<Skeleton className="w-8 h-8 rounded-xl" />
			<div className="flex-grow space-y-2">
				<Skeleton className="w-full h-3" />
				<Skeleton className="w-full h-3" />
				<Skeleton className="h-3 w-[50%]" />
			</div>
		</div>
	);
};
