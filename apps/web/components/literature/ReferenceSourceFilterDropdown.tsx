import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@components/ui/select';
import React from 'react';
import { ReferenceSourceFilter } from './LiteratureSearchSection';

type Props = {
	onFilterChange: (value: ReferenceSourceFilter) => void;
	currentFilter: ReferenceSourceFilter;
	className?: string;
};

const ReferenceSourceFilterDropdown = ({
	onFilterChange,
	currentFilter,
	className,
}: Props) => {
	return (
		<Select
			value={currentFilter}
			onValueChange={value => onFilterChange(value as ReferenceSourceFilter)}
		>
			<SelectTrigger className={className}>
				<SelectValue placeholder="Select a document type" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Reference Type</SelectLabel>
					<SelectItem value="ALL">All</SelectItem>
					<SelectItem value="SAVED">Saved</SelectItem>
					<SelectItem value="UPLOADED">Uploaded</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	);
};

export default ReferenceSourceFilterDropdown;
