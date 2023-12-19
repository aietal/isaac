/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Checkbox } from '@components/ui/checkbox';
import useLexicalEditorStore from '@context/lexicalEditor.store';
import clsx from 'clsx';
import * as React from 'react';
import { useCallback, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Textarea } from '@components/ui/textarea';
import KatexRenderer from './KatexRenderer';

type Props = {
	initialEquation?: string;
	onConfirm: (equation: string, inline: boolean) => void;
};

export default function KatexEquationAlterer({
	onConfirm,
	initialEquation = '',
}: Props): JSX.Element {
	const { activeEditor } = useLexicalEditorStore();
	const [equation, setEquation] = useState<string>(initialEquation);
	const [inline, setInline] = useState<boolean>(true);

	const onClick = useCallback(() => {
		onConfirm(equation, inline);
	}, [onConfirm, equation, inline]);

	const onCheckboxChange = useCallback(() => {
		setInline(!inline);
	}, [setInline, inline]);

	return (
		<>
			<div className="items-top flex space-x-2 mt-4">
				<Checkbox
					id="inline-equation"
					checked={inline}
					onCheckedChange={onCheckboxChange}
				/>
				<div className="grid gap-1.5 leading-none">
					<label
						htmlFor="inline-equation"
						className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						Inline
					</label>
					<p className="text-sm text-muted-foreground">
						If checked the equation will be displayed inline
					</p>
				</div>
			</div>

			<div className="mt-4">
				{inline ? (
					<Input
						onChange={event => {
							setEquation(event.target.value);
						}}
						value={equation}
						className="KatexEquationAlterer_textArea"
					/>
				) : (
					<Textarea
						onChange={event => {
							setEquation(event.target.value);
						}}
						value={equation}
						className="KatexEquationAlterer_textArea"
					/>
				)}
			</div>
			<div>Visualization: </div>
			<div
				className={clsx(equation !== '' ? '' : 'bg-muted', 'h-20 rounded-md')}
			>
				<ErrorBoundary onError={e => activeEditor._onError(e)} fallback={null}>
					<KatexRenderer
						equation={equation}
						inline={false}
						onDoubleClick={() => null}
					/>
				</ErrorBoundary>
			</div>
			<div className="KatexEquationAlterer_dialogActions">
				<Button onClick={onClick}>Insert Equation</Button>
			</div>
		</>
	);
}
