import { Button } from '@components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_ELEMENT_COMMAND } from 'lexical';
import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from 'lucide-react';

const JustifyTextDropdown = () => {
	const [editor] = useLexicalComposerContext();
	const size = 18;
	const strokeWidth = 1.5;
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="px-2" aria-label="Left Align">
					<AlignLeft size={size} strokeWidth={strokeWidth} />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="center" sideOffset={10}>
				<DropdownMenuItem
					onClick={() => {
						editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
					}}
				>
					<AlignLeft
						className="mr-2 h-4 w-4"
						size={size}
						strokeWidth={strokeWidth}
					/>
					<span>Align Left </span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => {
						editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
					}}
				>
					<AlignCenter
						className="mr-2 h-4 w-4"
						size={size}
						strokeWidth={strokeWidth}
					/>
					<span>Align Center </span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => {
						editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
					}}
				>
					<AlignRight
						className="mr-2 h-4 w-4"
						size={size}
						strokeWidth={strokeWidth}
					/>
					<span>Align Right</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => {
						editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
					}}
				>
					<AlignJustify
						className="mr-2 h-4 w-4"
						size={size}
						strokeWidth={strokeWidth}
					/>
					<span>Justify </span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default JustifyTextDropdown;
