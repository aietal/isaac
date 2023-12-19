import {
	closestCenter,
	DndContext,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
} from '@dnd-kit/core';
import {
	restrictToHorizontalAxis,
	restrictToParentElement,
	restrictToVerticalAxis,
} from '@dnd-kit/modifiers';
import {
	arrayMove,
	horizontalListSortingStrategy,
	rectSortingStrategy,
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { type ReactNode } from 'react';
type Props = {
	children: ReactNode;
	itemIds: string[];
	onSort: (ids: string[]) => void;
	sortDirection?: 'vertical' | 'horizontal' | 'free';
	onDragStart?: () => void;
	onDragEnd?: () => void;
};

const SortableDDContainer = ({
	itemIds,
	onSort,
	children,
	sortDirection = 'vertical',
	onDragStart,
	onDragEnd,
}: Props) => {
	const handleDragEnd = ({ active, over }: DragEndEvent) => {
		if (active.id !== over?.id) {
			const activeIdx = itemIds.indexOf(active.id as string);
			const overIdx = itemIds.indexOf(over?.id as string);
			const sortedItem = arrayMove(itemIds, activeIdx, overIdx);
			onSort(sortedItem);
			onDragEnd?.();
		}
	};

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { delay: 160, tolerance: 50 }, // delay means you hold on longer to activate the drag and drop
		}),
	);

	const sortStrategy = {
		vertical: verticalListSortingStrategy,
		horizontal: horizontalListSortingStrategy,
		free: rectSortingStrategy,
	};

	const sortRestriction = [restrictToParentElement];
	if (sortDirection === 'vertical') {
		sortRestriction.push(restrictToVerticalAxis);
	} else if (sortDirection === 'horizontal') {
		sortRestriction.push(restrictToHorizontalAxis);
	}

	return (
		<DndContext
			sensors={sensors}
			onDragStart={onDragStart}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
			modifiers={[...sortRestriction]}
		>
			<SortableContext items={itemIds} strategy={sortStrategy[sortDirection]}>
				{children}
			</SortableContext>
		</DndContext>
	);
};

export default SortableDDContainer;
