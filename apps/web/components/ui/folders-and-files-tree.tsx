import { ReferenceTypeIconsMap } from '@components/core/IconMap';
import { Checkbox } from '@components/ui/checkbox';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@components/ui/tooltip';
import clsx from 'clsx';
import { capitalize, startCase } from 'lodash';
import { ChevronDown, ChevronUp, Folder, FolderOpen } from 'lucide-react';
import React, { ReactNode, useState } from 'react';
import { ReferenceType } from 'types/literatureReference.type';

type FolderContainerProps = {
	children: ReactNode;
};

export const FolderContainer = ({ children }: FolderContainerProps) => {
	return (
		<div className="flex flex-col gap-4 border p-4 h-[300px] overflow-y-auto rounded-sm">
			{children}
		</div>
	);
};

type BaseCheckBoxProps = {
	label: string;
	id: string;
	checked: boolean;
	onCheckChange?: (bool: boolean) => void;
	type?: ReferenceType;
};

type FolderAccordionProps = BaseCheckBoxProps & {
	disabled: boolean;
	children?: ReactNode;
};

export const FolderCheckBox = ({
	id,
	label,
	checked,
	onCheckChange,
	disabled,
	children,
}: FolderAccordionProps) => {
	const [collapse, setCollapse] = useState(true);

	return (
		<div className="">
			<div className="flex items-center space-x-2">
				<Checkbox
					id={id}
					disabled={disabled}
					onCheckedChange={onCheckChange}
					checked={checked}
				/>
				{collapse ? (
					<Folder size={16} strokeWidth={1.4} />
				) : (
					<FolderOpen size={16} strokeWidth={1.4} />
				)}
				<label
					htmlFor={id}
					className="flex-grow text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					{label}
				</label>
				{!disabled &&
					(collapse ? (
						<ChevronDown size={16} onClick={() => setCollapse(s => !s)} />
					) : (
						<ChevronUp size={16} onClick={() => setCollapse(s => !s)} />
					))}
			</div>
			<div
				className={clsx(
					'flex flex-col gap-2 overflow-y-hidden transition-all',
					collapse ? 'max-h-0' : 'mt-2.5 max-h-[2000px]',
				)}
			>
				{children}
			</div>
		</div>
	);
};

export const DocumentCheckBox = ({
	id,
	label,
	checked,
	onCheckChange,
	type,
}: BaseCheckBoxProps) => {
	const Icon = ReferenceTypeIconsMap[type];
	return (
		<div className="flex items-center ml-6 space-x-2">
			<Checkbox id={id} checked={checked} onCheckedChange={onCheckChange} />
			<Tooltip>
				<TooltipTrigger asChild>
					<div>{Icon && <Icon strokeWidth={1.4} size={16} />}</div>
				</TooltipTrigger>
				<TooltipContent>{startCase(capitalize(type))}</TooltipContent>
			</Tooltip>
			<label
				htmlFor={id}
				className="pr-2 text-sm leading-5 line-clamp-1 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
			>
				{label}
			</label>
		</div>
	);
};
