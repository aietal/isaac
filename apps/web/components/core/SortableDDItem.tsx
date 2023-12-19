import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useHover } from '@mantine/hooks';
import clsx from 'clsx';
import { type ReactNode } from 'react';
import { RxDragHandleDots2 } from 'react-icons/rx';

type Props = {
	id: string;
	children: ReactNode;
	withDraggable?: boolean;
};

const SortableDDItem = ({ id, children, withDraggable }: Props) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({
			id,
		});
	const { ref: hoverRef, hovered } = useHover();
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	if (withDraggable) {
		return (
			<div ref={setNodeRef} style={style} {...attributes}>
				<div ref={hoverRef} className="items-start flex-nowrap gap-0">
					<RxDragHandleDots2
						{...listeners}
						className={clsx('text-gray-500 mt-2 transition-width')}
						cursor={'grab'}
						opacity={hovered ? 0.8 : 0.3}
					/>
					<div>{children}</div>
				</div>
			</div>
		);
	}

	return (
		<div ref={setNodeRef} style={style} {...listeners} {...attributes}>
			{children}
		</div>
	);
};

export default SortableDDItem;
