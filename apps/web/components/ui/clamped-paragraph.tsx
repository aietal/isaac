import clsx from 'clsx';
import React, { ReactNode, useEffect, useRef, useState } from 'react';

const ClampedParagraph = ({
	text,
	EmptyText,
}: {
	text: string;
	EmptyText: ReactNode;
}) => {
	const ref = useRef<HTMLParagraphElement>(null);
	const [isDefaultTruncated, setIsDefaultTruncated] = useState(false);
	const [showMore, setShowMore] = useState(false);

	useEffect(() => {
		if (ref.current) {
			if (ref.current.scrollHeight > ref.current.clientHeight) {
				setIsDefaultTruncated(true);
			}
		}
	}, [text, ref]);

	return (
		<div>
			{text ? (
				<p
					ref={ref}
					className={clsx('leading-relaxed', !showMore && 'line-clamp-5')}
				>
					{text}
				</p>
			) : (
				EmptyText
				// <span className="text-gray-400 h-full"> Abstract not found</span>
			)}
			<div className="flex justify-end">
				{isDefaultTruncated && (
					<button
						onClick={() => setShowMore(!showMore)}
						className="mt-1.5 text-xs pr-2.5 text-isaac"
					>
						{showMore ? 'Show less' : 'Show less'}
					</button>
				)}
			</div>
		</div>
	);
};

export default ClampedParagraph;
