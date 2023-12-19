import { Button } from '@components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import { $patchStyleText } from '@lexical/selection';
import { $getSelection, $isRangeSelection } from 'lexical';
import { useCallback } from 'react';

const FONT_FAMILY_OPTIONS = [
	['Arial', 'Arial'],
	['Courier New', 'Courier New'],
	['Georgia', 'Georgia'],
	['Times New Roman', 'Times New Roman'],
	['Trebuchet MS', 'Trebuchet MS'],
	['Verdana', 'Verdana'],
];

function dropDownActiveClass(active) {
	if (active) return 'active dropdown-item-active';
	else return '';
}

function FontDropDown({
	editor,
	value,
	style,
	disabled = false,
	setFontFamily, // TODO: Move to global state
	fontFamily, // TODO: Move to global State
}) {
	const handleClick = useCallback(
		option => {
			editor.update(() => {
				const selection = $getSelection();

				if ($isRangeSelection(selection) && selection.anchor.type === 'text') {
					// $selectAll(selection);
					$patchStyleText(selection, {
						[style]: option,
					});
				} else {
					// document.documentElement.style.setProperty('--font-family', option);

					setFontFamily(option);
				}
			});
		},
		[editor, style],
	);

	const buttonAriaLabel =
		style === 'font-family'
			? 'Formatting options for font family'
			: 'Formatting options for font size';

	return (
		<DropdownMenu>
			<DropdownMenuTrigger disabled={disabled}>
				<Button
					variant="ghost"
					className="px-2"
					aria-label="Formatting options for font family"
				>
					<span className="text">{fontFamily}</span>
					<i className="chevron-down" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				{FONT_FAMILY_OPTIONS.map(([option, text]) => (
					<DropdownMenuItem
						className={`item ${dropDownActiveClass(value === option)} ${
							style === 'font-size' ? 'fontsize-item' : ''
						}`}
						onClick={() => handleClick(option)}
						key={option}
					>
						<span className="text">{text}</span>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default FontDropDown;
