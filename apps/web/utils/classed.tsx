import { cn } from '@components/lib/utils';
import { type cva, type VariantProps } from 'cva';
import {
	forwardRef,
	memo,
	type ComponentProps,
	type ComponentType,
	type JSX,
} from 'react';

type ClassValue =
	| ClassArray
	| ClassDictionary
	| string
	| number
	| null
	| boolean
	| undefined;
type ClassDictionary = Record<string, any>;
type ClassArray = ClassValue[];
type ClassProps =
	| { class?: ClassValue; className?: never }
	| { class?: never; className?: ClassValue };

type GetClassName = ((props: ClassProps) => ClassValue) | ClassValue;

type TagName = keyof JSX.IntrinsicElements;
type ValidComponent = TagName | ComponentType<any>;

function _classed<
	T extends ValidComponent = ValidComponent,
	C extends GetClassName = GetClassName,
>(component: T, getClassName: C) {
	const Tag = component as (props: ComponentProps<T>) => JSX.Element;

	return memo(
		forwardRef(function Classed<P = {}>(
			props: (C extends ReturnType<typeof cva> ? VariantProps<C> : unknown) &
				ComponentProps<T> &
				P,
			ref: React.Ref<HTMLElement>,
		) {
			return (
				<Tag
					ref={ref}
					{...props}
					className={cn(
						typeof getClassName === 'function'
							? getClassName(props)
							: getClassName,
					)}
				/>
			);
		}),
	);
}

// Create a proxy that will convert classed.button to _classed("button", ...)
// This way, web components should work as well (not tested)
const classed = new Proxy(_classed, {
	apply(target, _thisArg, [component, getClassName]: [TagName, GetClassName]) {
		return target(component, getClassName);
	},
	get(target, prop, _receiver) {
		return (getClassName: GetClassName) =>
			target(prop as TagName, getClassName);
	},
}) as typeof _classed & {
	[T in TagName]: <P = {}, C extends GetClassName = GetClassName>(
		getClassName: C,
	) => (
		props: (C extends ReturnType<typeof cva> ? VariantProps<C> : unknown) &
			ComponentProps<T> &
			P,
	) => JSX.Element;
};

export default classed;
