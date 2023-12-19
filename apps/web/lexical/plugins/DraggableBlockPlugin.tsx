import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { eventFiles } from '@lexical/rich-text';
import { mergeRegister } from '@lexical/utils';
import {
	$getNearestNodeFromDOMNode,
	$getNodeByKey,
	$getRoot,
	COMMAND_PRIORITY_HIGH,
	COMMAND_PRIORITY_LOW,
	DRAGOVER_COMMAND,
	DROP_COMMAND,
	LexicalEditor,
} from 'lexical';
import * as React from 'react';
import {
	DragEvent as ReactDragEvent,
	useEffect,
	useRef,
	useState,
} from 'react';
import { createPortal } from 'react-dom';

const SPACE = 4;
const TARGET_LINE_HALF_HEIGHT = 2;
const DRAGGABLE_BLOCK_MENU_CLASSNAME = 'draggable-block-menu';
const DRAG_DATA_FORMAT = 'application/x-lexical-drag-block';
const TEXT_BOX_HORIZONTAL_PADDING = 28;

function getTopLevelNodeKeys(editor: LexicalEditor): string[] {
	return editor.getEditorState().read(() => $getRoot().getChildrenKeys());
}

function getBlockElement(
	anchorElem: HTMLElement,
	editor: LexicalEditor,
	event: MouseEvent,
): HTMLElement | null {
	const anchorElementRect = anchorElem.getBoundingClientRect();
	const topLevelNodeKeys = getTopLevelNodeKeys(editor);

	const point = new Point(event.x, event.y); // Moved outside of the loop

	let blockElem: HTMLElement | null = null;

	for (const key of topLevelNodeKeys) {
		const elem = editor.getElementByKey(key);
		if (elem === null) {
			continue; // Continue to the next iteration
		}
		const domRect = Rect.fromDOM(elem);
		const { marginTop, marginBottom } = window.getComputedStyle(elem);

		const rect = domRect.generateNewRect({
			bottom: domRect.bottom + parseFloat(marginBottom),
			left: anchorElementRect.left,
			right: anchorElementRect.right,
			top: domRect.top - parseFloat(marginTop),
		});

		const { result } = rect.contains(point);

		if (result) {
			blockElem = elem;
			break;
		}
	}

	return blockElem;
}

function isOnMenu(element: HTMLElement): boolean {
	return !!element.closest(`.${DRAGGABLE_BLOCK_MENU_CLASSNAME}`);
}

function setMenuPosition(
	targetElem: HTMLElement | null,
	floatingElem: HTMLElement,
	anchorElem: HTMLElement,
) {
	if (!targetElem) {
		floatingElem.style.opacity = '0';
		floatingElem.style.transform = 'translate(-10000px, -10000px)';
		return;
	}

	const targetRect = targetElem.getBoundingClientRect();
	const targetStyle = window.getComputedStyle(targetElem);
	const floatingElemRect = floatingElem.getBoundingClientRect();
	const anchorElementRect = anchorElem.getBoundingClientRect();

	const top =
		targetRect.top +
		(parseInt(targetStyle.lineHeight, 10) - floatingElemRect.height) / 2 -
		anchorElementRect.top;

	const left = SPACE;

	floatingElem.style.opacity = '1';
	floatingElem.style.transform = `translate(${left}px, ${top}px)`;
}

function setDragImage(
	dataTransfer: DataTransfer,
	draggableBlockElem: HTMLElement,
) {
	const { transform } = draggableBlockElem.style;

	// Remove dragImage borders
	draggableBlockElem.style.transform = 'translateZ(0)';
	dataTransfer.setDragImage(draggableBlockElem, 0, 0);

	setTimeout(() => {
		draggableBlockElem.style.transform = transform;
	});
}

function setTargetLine(
	targetLineElem: HTMLElement,
	targetBlockElem: HTMLElement,
	mouseY: number,
	anchorElem: HTMLElement,
) {
	const targetStyle = window.getComputedStyle(targetBlockElem);
	const { top: targetBlockElemTop, height: targetBlockElemHeight } =
		targetBlockElem.getBoundingClientRect();
	const { top: anchorTop, width: anchorWidth } =
		anchorElem.getBoundingClientRect();

	let lineTop = targetBlockElemTop;
	// At the bottom of the target
	if (mouseY - targetBlockElemTop > targetBlockElemHeight / 2) {
		lineTop += targetBlockElemHeight + parseFloat(targetStyle.marginBottom);
	} else {
		lineTop -= parseFloat(targetStyle.marginTop);
	}

	const top = lineTop - anchorTop - TARGET_LINE_HALF_HEIGHT;
	const left = TEXT_BOX_HORIZONTAL_PADDING - SPACE;

	targetLineElem.style.transform = `translate(${left}px, ${top}px)`;
	targetLineElem.style.width = `${
		anchorWidth - (TEXT_BOX_HORIZONTAL_PADDING - SPACE) * 2
	}px`;
	targetLineElem.style.opacity = '.4';
}

function hideTargetLine(targetLineElem: HTMLElement | null) {
	if (targetLineElem) {
		targetLineElem.style.opacity = '0';
		targetLineElem.style.transform = 'translate(-10000px, -10000px)';
	}
}

function useDraggableBlockMenu(
	editor: LexicalEditor,
	anchorElem: HTMLElement,
	isEditable: boolean,
): JSX.Element {
	const scrollerElem = anchorElem.parentElement;
	const menuRef = useRef<HTMLDivElement>(null);
	const targetLineRef = useRef<HTMLDivElement>(null);
	const isDraggingBlockRef = useRef<boolean>(false);
	const [draggableBlockElem, setDraggableBlockElem] =
		useState<HTMLElement | null>(null);
	useEffect(() => {
		function onMouseMove(event: MouseEvent) {
			const target = event.target;
			if (!isHTMLElement(target)) {
				setDraggableBlockElem(null);
				return;
			}

			if (isOnMenu(target)) {
				return;
			}

			const _draggableBlockElem = getBlockElement(anchorElem, editor, event);

			setDraggableBlockElem(_draggableBlockElem);
		}

		function onMouseLeave() {
			setDraggableBlockElem(null);
		}

		scrollerElem?.addEventListener('mousemove', onMouseMove);
		scrollerElem?.addEventListener('mouseleave', onMouseLeave);

		return () => {
			scrollerElem?.removeEventListener('mousemove', onMouseMove);
			scrollerElem?.removeEventListener('mouseleave', onMouseLeave);
		};
	}, [scrollerElem, anchorElem, editor]);

	useEffect(() => {
		if (menuRef.current) {
			setMenuPosition(draggableBlockElem, menuRef.current, anchorElem);
		}
	}, [anchorElem, draggableBlockElem]);

	useEffect(() => {
		function onDragover(event: DragEvent): boolean {
			if (!isDraggingBlockRef.current) {
				return false;
			}
			const [isFileTransfer] = eventFiles(event);
			if (isFileTransfer) {
				return false;
			}
			const { pageY, target } = event;
			if (!isHTMLElement(target)) {
				return false;
			}
			const targetBlockElem = getBlockElement(anchorElem, editor, event);
			const targetLineElem = targetLineRef.current;
			if (targetBlockElem === null || targetLineElem === null) {
				return false;
			}
			setTargetLine(targetLineElem, targetBlockElem, pageY, anchorElem);
			// Prevent default event to be able to trigger onDrop events
			event.preventDefault();
			return true;
		}

		function onDrop(event: DragEvent): boolean {
			if (!isDraggingBlockRef.current) {
				return false;
			}
			const [isFileTransfer] = eventFiles(event);
			if (isFileTransfer) {
				return false;
			}
			const { target, dataTransfer, pageY } = event;
			const dragData = dataTransfer?.getData(DRAG_DATA_FORMAT) || '';
			const draggedNode = $getNodeByKey(dragData);
			if (!draggedNode) {
				return false;
			}
			if (!isHTMLElement(target)) {
				return false;
			}
			const targetBlockElem = getBlockElement(anchorElem, editor, event);
			if (!targetBlockElem) {
				return false;
			}
			const targetNode = $getNearestNodeFromDOMNode(targetBlockElem);
			if (!targetNode) {
				return false;
			}
			if (targetNode === draggedNode) {
				return true;
			}
			const { top, height } = targetBlockElem.getBoundingClientRect();
			const shouldInsertAfter = pageY - top > height / 2;
			if (shouldInsertAfter) {
				targetNode.insertAfter(draggedNode);
			} else {
				targetNode.insertBefore(draggedNode);
			}
			setDraggableBlockElem(null);

			return true;
		}

		return mergeRegister(
			editor.registerCommand(
				DRAGOVER_COMMAND,
				event => {
					return onDragover(event);
				},
				COMMAND_PRIORITY_LOW,
			),
			editor.registerCommand(
				DROP_COMMAND,
				event => {
					return onDrop(event);
				},
				COMMAND_PRIORITY_HIGH,
			),
		);
	}, [anchorElem, editor]);

	function onDragStart(event: ReactDragEvent<HTMLDivElement>): void {
		const dataTransfer = event.dataTransfer;
		if (!dataTransfer || !draggableBlockElem) {
			return;
		}
		setDragImage(dataTransfer, draggableBlockElem);
		let nodeKey = '';
		editor.update(() => {
			const node = $getNearestNodeFromDOMNode(draggableBlockElem);
			if (node) {
				nodeKey = node.getKey();
			}
		});
		isDraggingBlockRef.current = true;
		dataTransfer.setData(DRAG_DATA_FORMAT, nodeKey);
	}

	function onDragEnd(): void {
		isDraggingBlockRef.current = false;
		hideTargetLine(targetLineRef.current);
	}
	return createPortal(
		<>
			<div
				className="icon draggable-block-menu hover:bg-gray-100 dark:hover:bg-gray-900"
				ref={menuRef}
				draggable={true}
				onDragStart={onDragStart}
				onDragEnd={onDragEnd}
			>
				<div className={'dark:icon-dark icon-light'} />
			</div>

			<div className="draggable-block-target-line" ref={targetLineRef} />
		</>,
		anchorElem,
	);
}

export default function DraggableBlockPlugin({
	anchorElem = document.body,
}: {
	anchorElem?: HTMLElement;
}): JSX.Element {
	const [editor] = useLexicalComposerContext();

	return useDraggableBlockMenu(editor, anchorElem, editor._editable);
}

class Point {
	private readonly _x: number;
	private readonly _y: number;

	constructor(x: number, y: number) {
		this._x = x;
		this._y = y;
	}

	get x(): number {
		return this._x;
	}

	get y(): number {
		return this._y;
	}

	public equals({ x, y }: Point): boolean {
		return this.x === x && this.y === y;
	}

	public calcDeltaXTo({ x }: Point): number {
		return this.x - x;
	}

	public calcDeltaYTo({ y }: Point): number {
		return this.y - y;
	}

	public calcHorizontalDistanceTo(point: Point): number {
		return Math.abs(this.calcDeltaXTo(point));
	}

	public calcVerticalDistance(point: Point): number {
		return Math.abs(this.calcDeltaYTo(point));
	}

	public calcDistanceTo(point: Point): number {
		return Math.sqrt(
			Math.pow(this.calcDeltaXTo(point), 2) +
				Math.pow(this.calcDeltaYTo(point), 2),
		);
	}
}

export function isPoint(x: unknown): x is Point {
	return x instanceof Point;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

type ContainsPointReturn = {
	result: boolean;
	reason: {
		isOnTopSide: boolean;
		isOnBottomSide: boolean;
		isOnLeftSide: boolean;
		isOnRightSide: boolean;
	};
};

class Rect {
	private readonly _left: number;
	private readonly _top: number;
	private readonly _right: number;
	private readonly _bottom: number;

	constructor(left: number, top: number, right: number, bottom: number) {
		const [physicTop, physicBottom] =
			top <= bottom ? [top, bottom] : [bottom, top];

		const [physicLeft, physicRight] =
			left <= right ? [left, right] : [right, left];

		this._top = physicTop;
		this._right = physicRight;
		this._left = physicLeft;
		this._bottom = physicBottom;
	}

	get top(): number {
		return this._top;
	}

	get right(): number {
		return this._right;
	}

	get bottom(): number {
		return this._bottom;
	}

	get left(): number {
		return this._left;
	}

	get width(): number {
		return Math.abs(this._left - this._right);
	}

	get height(): number {
		return Math.abs(this._bottom - this._top);
	}

	public equals({ top, left, bottom, right }: Rect): boolean {
		return (
			top === this._top &&
			bottom === this._bottom &&
			left === this._left &&
			right === this._right
		);
	}

	public contains({ x, y }: Point): ContainsPointReturn;
	public contains({ top, left, bottom, right }: Rect): boolean;
	public contains(target: Point | Rect): boolean | ContainsPointReturn {
		if (isPoint(target)) {
			const { x, y } = target;

			const isOnTopSide = y < this._top;
			const isOnBottomSide = y > this._bottom;
			const isOnLeftSide = x < this._left;
			const isOnRightSide = x > this._right;

			const result =
				!isOnTopSide && !isOnBottomSide && !isOnLeftSide && !isOnRightSide;

			return {
				reason: {
					isOnBottomSide,
					isOnLeftSide,
					isOnRightSide,
					isOnTopSide,
				},
				result,
			};
		} else {
			const { top, left, bottom, right } = target;

			return (
				top >= this._top &&
				top <= this._bottom &&
				bottom >= this._top &&
				bottom <= this._bottom &&
				left >= this._left &&
				left <= this._right &&
				right >= this._left &&
				right <= this._right
			);
		}
	}

	public intersectsWith(rect: Rect): boolean {
		const { left: x1, top: y1, width: w1, height: h1 } = rect;
		const { left: x2, top: y2, width: w2, height: h2 } = this;
		const maxX = x1 + w1 >= x2 + w2 ? x1 + w1 : x2 + w2;
		const maxY = y1 + h1 >= y2 + h2 ? y1 + h1 : y2 + h2;
		const minX = x1 <= x2 ? x1 : x2;
		const minY = y1 <= y2 ? y1 : y2;
		return maxX - minX <= w1 + w2 && maxY - minY <= h1 + h2;
	}

	public generateNewRect({
		left = this.left,
		top = this.top,
		right = this.right,
		bottom = this.bottom,
	}): Rect {
		return new Rect(left, top, right, bottom);
	}

	static fromLTRB(
		left: number,
		top: number,
		right: number,
		bottom: number,
	): Rect {
		return new Rect(left, top, right, bottom);
	}

	static fromLWTH(
		left: number,
		width: number,
		top: number,
		height: number,
	): Rect {
		return new Rect(left, top, left + width, top + height);
	}

	static fromPoints(startPoint: Point, endPoint: Point): Rect {
		const { y: top, x: left } = startPoint;
		const { y: bottom, x: right } = endPoint;
		return Rect.fromLTRB(left, top, right, bottom);
	}

	static fromDOM(dom: HTMLElement): Rect {
		const { top, width, left, height } = dom.getBoundingClientRect();
		return Rect.fromLWTH(left, width, top, height);
	}
}

export function isHTMLElement(x: unknown): x is HTMLElement {
	return x instanceof HTMLElement;
}
