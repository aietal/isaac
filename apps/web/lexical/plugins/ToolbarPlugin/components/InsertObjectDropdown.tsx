import { Button } from '@components/ui/button';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@components/ui/popover';
import { useUIStore } from '@context/ui.store';
import { INSERT_IMAGE_COMMAND } from '@lexical/plugins/ImagesPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import { ChevronDown, ImagePlus, MinusSquare, Pi, Table2 } from 'lucide-react';
import React, { useRef } from 'react';

const InsertObjectDropdown = () => {
	const [editor] = useLexicalComposerContext();

	const inputFile = useRef<HTMLInputElement | null>(null);

	const handleInsertImage = (files: FileList | null) => {
		const reader = new FileReader();
		reader.onload = function () {
			if (typeof reader.result === 'string') {
				const src = reader.result;
				const filename = files?.[0]?.name || '';
				editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
					src,
					altText: filename,
				});
			}
			return '';
		};
		if (files !== null) {
			reader?.readAsDataURL(files[0]);
		}
	};

	const addTable = () => {
		editor.dispatchCommand(INSERT_TABLE_COMMAND, {
			columns: '3',
			rows: '3',
			includeHeaders: false,
		});
	};

	const showEquationModal = useUIStore(s => s.showEquationModal);
	const setShowEquationModal = useUIStore(s => s.setShowEquationModal);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="px-2"
					aria-label="Formatting Options"
				>
					<div className="flex inline-flex items-center justify-between w-auto">
						<span className="w-auto mx-3 font-normal">Insert</span>
						<ChevronDown size={18} strokeWidth={1.5} />
					</div>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="center" sideOffset={10} className="w-auto">
				<DropdownMenuItem onClick={() => inputFile.current.click()}>
					<ImagePlus size={18} opacity={0.6} strokeWidth={1.8} />
					<span className="ml-2"> Image</span>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => addTable()}>
					<Table2 size={18} opacity={0.6} strokeWidth={1.8} />
					<span className="ml-2"> Table</span>
				</DropdownMenuItem>

				<DropdownMenuItem onClick={() => setShowEquationModal(true)}>
					<Pi size={18} opacity={0.6} strokeWidth={1.8} />
					<span className="ml-2"> Equation </span>
				</DropdownMenuItem>

				<DropdownMenuItem
					onClick={() =>
						editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)
					}
				>
					<MinusSquare size={18} opacity={0.6} strokeWidth={1.8} />
					<span className="ml-2"> Horizontal Rule </span>
				</DropdownMenuItem>
			</DropdownMenuContent>
			<input
				type="file"
				id="file"
				accept="image/png, image/gif, image/jpeg"
				ref={inputFile}
				style={{ display: 'none' }}
				onChange={e => handleInsertImage(e.target.files)}
			/>
		</DropdownMenu>
	);
};

export default InsertObjectDropdown;
