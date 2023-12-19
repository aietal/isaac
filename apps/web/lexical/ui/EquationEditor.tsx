import type { Ref, RefObject } from 'react';

import { Input } from '@components/ui/input';
import { Textarea } from '@components/ui/textarea';
import * as React from 'react';
import { ChangeEvent, forwardRef } from 'react';

type BaseEquationEditorProps = {
	equation: string;
	inline: boolean;
	setEquation: (equation: string) => void;
};

function EquationEditor(
	{ equation, setEquation, inline }: BaseEquationEditorProps,
	forwardedRef: Ref<HTMLInputElement | HTMLTextAreaElement>,
): JSX.Element {
	const onChange = (event: ChangeEvent) => {
		setEquation((event.target as HTMLInputElement).value);
	};

	return inline && forwardedRef instanceof HTMLInputElement ? (
		<span className="EquationEditor_inputBackground">
			<span className="EquationEditor_dollarSign">$</span>
			<Input
				className="EquationEditor_inlineEditor"
				value={equation}
				onChange={onChange}
				autoFocus={true}
				ref={forwardedRef as RefObject<HTMLInputElement>}
			/>
			<span className="EquationEditor_dollarSign">$</span>
		</span>
	) : (
		<div className="EquationEditor_inputBackground">
			<span className="EquationEditor_dollarSign">{'$$\n'}</span>
			<Textarea
				className="EquationEditor_blockEditor"
				value={equation}
				onChange={onChange}
				ref={forwardedRef as RefObject<HTMLTextAreaElement>}
			/>
			<span className="EquationEditor_dollarSign">{'\n$$'}</span>
		</div>
	);
}

export default forwardRef(EquationEditor);
