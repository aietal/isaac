import { Input } from '@components/ui/input';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@components/ui/popover';
import { RangeSlider } from '@components/ui/range-slider';
import { GetLiteraturePayload } from '@resources/literature.api';
import { currentYear, earliestLiteratureYear } from 'data/meta';
import { Search } from 'lucide-react';
import React, { ReactNode, useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type Props = {
	onSubmit?: SubmitHandler<GetLiteraturePayload>;
};

const exampleSearch = ['Covid-19', 'LLMs', 'Gravity'];

const LiteratureSearchInput = ({ onSubmit }: Props) => {
	const {
		register,
		handleSubmit,
		getValues,
		watch,
		setValue,
		formState: { errors },
	} = useForm<GetLiteraturePayload>({
		defaultValues: { startYear: earliestLiteratureYear, endYear: currentYear },
	});

	const formRef = useRef(null);

	return (
		<div className="flex-grow-0">
			<form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
				<div className="flex items-center flex-wrap gap-2 mb-2 relative">
					<Input
						id="literature-search-input"
						className="bg-white dark:bg-inherit"
						placeholder="Search more than 200 million scientific papers"
						{...register('keyword', { required: true, minLength: 3 })}
						spellCheck={false}
						autoComplete="off"
					/>
					<div className="absolute right-2 flex">
						<button type="submit">
							<Search className="w-6 h-4" strokeWidth={1.4} />
						</button>
					</div>
				</div>

				<div className="">
					{errors.keyword && (
						<p className="text-sm text-destructive mb-1">
							*Please enter at least 3 characters
						</p>
					)}
					<Popover>
						<PopoverTrigger>
							<div className="flex text-xs items-center gap-1 px-2 py-1 transition-all duration-100 ease-in-out bg-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md border cursor-pointer dark:bg-neutral-950">
								Year: {watch('startYear')} to {watch('endYear')}
							</div>
						</PopoverTrigger>
						<PopoverContent
							className="flex flex-col gap-2"
							side="bottom"
							align="start"
							sideOffset={10}
						>
							<p className="text-sm mb-2 text-center">
								Slide to select year range
							</p>
							<RangeSlider
								className="bg-transparent"
								min={earliestLiteratureYear}
								max={currentYear}
								step={1}
								defaultValue={[getValues('startYear'), getValues('endYear')]}
								onValueChange={value => {
									setValue('startYear', value[0]);
									setValue('endYear', value[1]);
								}}
							/>
							<div className="flex items-center justify-between text-sm text-neutral-500">
								<span className="text-xs">{earliestLiteratureYear}</span>
								<span className="text-xs">{currentYear}</span>
							</div>
						</PopoverContent>
					</Popover>
				</div>
			</form>
		</div>
	);
};

export default LiteratureSearchInput;
