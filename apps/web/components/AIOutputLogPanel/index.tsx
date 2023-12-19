import { Separator } from '@components/ui/separator';
import useApplyChangesToEditor from '@hooks/api/isaac/useApplyChangesToEditor';
import useAIOutput, { AIOutputLogItem } from '@hooks/api/useAIOutput';
import { useHover } from '@mantine/hooks';
import { getRelativeDateTime } from '@utils/dateUtils';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

const AIOutputLog = () => {
	const { currentProjectOutput } = useAIOutput();

	return (
		<div className="w-full flex flex-col gap-1 h-full">
			{/* HEADER */}
			<div className="flex justify-between p-3 pb-0 ">
				<p className="font-semibold text-sm flex gap-2 items-center">
					{'Output Log'}
				</p>
			</div>
			{/* BODY */}
			<div className="flex flex-col overflow-scroll">
				{currentProjectOutput?.map((i, idx) => (
					<AIOutputLogCard isNewestItem={idx === 0} data={i} key={i.id} />
				))}
			</div>
		</div>
	);
};

export default AIOutputLog;

const AIOutputLogCard = ({
	data,
	isNewestItem,
}: {
	data: AIOutputLogItem;
	isNewestItem: boolean;
}) => {
	const { applyChanges, editorFocused } = useApplyChangesToEditor();
	const [showReference, setShowReference] = useState(false);
	const { ref, hovered } = useHover();

	useEffect(() => {
		setShowReference(isNewestItem);
	}, [isNewestItem]);

	return (
		<div
			className=" px-3 py-2 text-sm hover:bg-slate-100 transition-colors"
			ref={ref}
		>
			<p className="flex justify-between mb-1 text-xs">
				<span className="font-semibold">
					{data.actionType.charAt(0).toUpperCase() +
						data.actionType.slice(1).toLowerCase()}
				</span>
				<span>{getRelativeDateTime(new Date(data.createdAt))}</span>
			</p>
			<p className={clsx('leading-5', !showReference && 'line-clamp-3')}>
				{data.content}
			</p>
			{showReference && data.inputReference && (
				<div className="flex gap-2  mt-2">
					<Separator orientation="vertical" className="h-auto my-1 " />
					<p className="leading-5 italic">{data.inputReference}</p>
				</div>
			)}

			<div
				className={clsx(
					'flex justify-end text-xs gap-1 mt-1',
					hovered || isNewestItem ? 'opacity-100' : 'opacity-0',
				)}
			>
				{data.inputReference && (
					<>
						<button
							className={'text-isaac'}
							onClick={() => {
								setShowReference(!showReference);
							}}
						>
							{showReference ? 'See Less' : 'Show More'}
						</button>
						<span>·</span>
					</>
				)}
				<button
					className={'text-isaac'}
					onClick={() => {
						applyChanges(data.content);
					}}
				>
					Apply Changes
				</button>
			</div>
		</div>
	);
};
