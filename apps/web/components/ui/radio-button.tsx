import { Button } from '@components/ui/button';
import React from 'react';

type Props = {
	value?: string;
	onChange: (value: string) => void;
	data: { label: string; value: string }[];
};

const RadioButton = ({ value, data, onChange }: Props) => {
	return (
		<div className="flex gap-1">
			{data.map(item => (
				<Button
					size="sm"
					key={item.value}
					onClick={() => onChange(item.value)}
					className="rounded-full"
					variant={value === item.value ? 'default' : 'outline'}
				>
					{item.label}
				</Button>
			))}
		</div>
	);
};

export default RadioButton;
