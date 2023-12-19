import { Input } from '@components/ui/input';
import clsx from 'clsx';
import { Search } from 'lucide-react';
import React from 'react';

type Props = {
	onSearch: (keyword: string) => void;
	className?: string;
};

const ReferenceSearchInput = ({ onSearch, className }: Props) => {
	return (
		<div
			className={clsx('flex items-center flex-wrap gap-2 relative', className)}
		>
			<Input
				onChange={e => onSearch(e.target.value)}
				placeholder="Search your references..."
				className="bg-white dark:bg-inherit"
			/>
			<button className="absolute right-4" type="submit">
				<Search className="w-6 h-4" strokeWidth={1.4} />
			</button>
		</div>
	);
};

export default ReferenceSearchInput;
