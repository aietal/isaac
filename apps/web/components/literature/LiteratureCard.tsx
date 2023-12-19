import { ReferenceTypeIconsMap } from '@components/core/IconMap';
import { Badge } from '@components/ui/badge';
import { Skeleton } from '@components/ui/skeleton';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@components/ui/tooltip';
import { useHover } from '@mantine/hooks';
import clsx from 'clsx';
import { capitalize, startCase } from 'lodash';
import { Book, Bookmark, Pencil } from 'lucide-react';
import { ReferenceType } from 'types/literatureReference.type';

type LiteratureCardProps = {
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

const LiteratureCard = ({
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
}: LiteratureCardProps) => {
	const { hovered, ref } = useHover();

	const Icon = ReferenceTypeIconsMap[type] || Book;

	return (
		<div
			ref={ref}
			className="flex justify-between w-full p-3 text-sm border rounded-md border-border hover:shadow-md hover:cursor-pointer"
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
					'flex transition-opacity gap-3',
					displayCta || hovered ? 'opacity-100' : 'opacity-0',
				)}
			>
				<Bookmark
					onClick={e => {
						e.stopPropagation();
						!added ? onAdd() : onRemove();
					}}
					className={clsx(
						'text-right mt-1 cursor-pointer hover:stroke-yellow-500 hover:stroke-1',
						added && 'fill-yellow-400 stroke-yellow-500',
					)}
					size={20}
					strokeWidth={0.6}
				/>
				{!!onApply && (
					<Tooltip>
						<TooltipTrigger asChild>
							<Pencil
								className="mt-1 hover:stroke-1"
								onClick={e => {
									e.stopPropagation();
									onApply();
								}}
								size={18}
								strokeWidth={0.6}
							/>
						</TooltipTrigger>
						<TooltipContent>
							<span>Cite!</span>
						</TooltipContent>
					</Tooltip>
				)}
			</div>
		</div>
	);
};

export default LiteratureCard;

export const LiteratureCardSkeleton = () => {
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
