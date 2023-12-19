import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@components/ui/select';

function CodeSelect({ onChange, options }) {
	return (
		<Select onValueChange={onChange}>
			<SelectTrigger className="w-[200px]">
				<SelectValue placeholder="Progamming language" />
			</SelectTrigger>
			<SelectContent>
				{options.map(option => (
					<SelectItem key={option} value={option}>
						{option}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

export default CodeSelect;
