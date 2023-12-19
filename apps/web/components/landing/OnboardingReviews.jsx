import clsx from 'clsx';
import { useInView } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Container } from '@components/landing/Container';

const reviews = [
	{
		title: 'Effective Academic Tool.',
		body: 'I incorporated Isaac into my workflow today and it significantly enhanced my productivity, enabling me to achieve in half an hour what usually takes me a week.',
		author: 'Samuel Greene (MIT)',
		rating: 5,
	},
	{
		title: 'Essential for Researchers.',
		body: 'Prior to using Isaac, the world of academic research was a mystery to me. I still find it challenging, but at least I’m making significant progress.',
		author: 'Jane Patterson (Harvard University)',
		rating: 5,
	},
	{
		title: 'Extraordinarily Powerful.',
		body: 'Isaac makes navigating through the complexity of academic research so effortless, it feels almost revolutionary.',
		author: 'Vincent Hopkins (Stanford University)',
		rating: 5,
	},
	{
		title: 'Supersedes Traditional Methods.',
		body: 'My progress with conventional research methods was slow. With Isaac, my research efficiency has doubled every month.',
		author: 'Albert Russo (Princeton University)',
		rating: 5,
	},
	{
		title: 'Incredibly resourceful!',
		body: 'After initiating collaborations via Isaac, I now receive new research insights every few minutes. The abundance of information is such that I can’t even process them all. It´s transforming my work!',
		author: 'Irene Morrison (Yale University)',
		rating: 5,
	},
	{
		title: 'Surprisingly Legitimate.',
		body: 'The research speed with Isaac was so quick it felt surreal. But I checked my progress and indeed, it’s authentic. This tool is unbelievable!',
		author: 'Raymond Davis (Duke University)',
		rating: 5,
	},
	{
		title: 'Deserves More than Five Stars',
		body: 'Isaac is fundamentally the most impactful academic tool you could ever incorporate into your workflow. Try it before it becomes a staple in every university.',
		author: 'Sarah Matthews (Oxford University)',
		rating: 5,
	},
	{
		title: 'A Paradigm Shift.',
		body: 'Achieved a milestone with Isaac that seemed unattainable. Want your own academic breakthroughs? Try Isaac.',
		author: 'Edmund Marshall (Cambridge University)',
		rating: 5,
	},
	{
		title: 'Bypassed Challenges!',
		body: 'After two weeks of using Isaac, I overcame my academic hurdles. It makes me wonder why traditional educational paths are still dominant.',
		author: 'Bruce Benson (University of Chicago)',
		rating: 5,
	},
	{
		title: 'Empowering Even for Young Scholars.',
		body: 'I appreciate that Isaac´s user-friendly interface could help me start my research journey early. I made substantial academic progress before I even graduated high school!',
		author: 'Richard Bennett (UCLA)',
		rating: 5,
	},
	{
		title: 'Facilitates Successful Collaboration.',
		body: 'I charge a small administrative fee and help my clients streamline their research with Isaac. Effortless success!',
		author: 'Alexandre Dumas (Sorbonne University)',
		rating: 5,
	},
	{
		title: 'Feels like an Academic Superpower.',
		body: 'Every recommendation Isaac has given me has proven fruitful. It´s like having foresight in academic exploration!',
		author: 'Clark Norton (Columbia University)',
		rating: 5,
	},
	{
		title: 'Prompted Career Change.',
		body: 'I started using Isaac three days ago and it significantly changed my research trajectory. It´s fascinating that no one else thought of developing an academic tool this way!',
		author: 'George Cohen (University of Pennsylvania)',
		rating: 5,
	},
	{
		title: 'Avoid Isaac Only If...',
		body: 'You do not wish to significantly enhance your academic life! I am literally writing this from a scientific conference.',
		author: 'Jeffrey Bright (Cornell University)',
		rating: 5,
	},
];

function StarIcon(props) {
	return (
		<svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
			<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
		</svg>
	);
}

function StarRating({ rating }) {
	return (
		<div className="flex">
			{[...Array(5).keys()].map(index => (
				<StarIcon
					key={index}
					className={clsx(
						'h-5 w-5',
						rating > index ? 'fill-muted-foreground' : 'fill-gray-300',
					)}
				/>
			))}
		</div>
	);
}

function Review({ title, body, author, rating, className, ...props }) {
	let animationDelay = useMemo(() => {
		let possibleAnimationDelays = [
			'0s',
			'0.1s',
			'0.2s',
			'0.3s',
			'0.4s',
			'0.5s',
		];
		return possibleAnimationDelays[
			Math.floor(Math.random() * possibleAnimationDelays.length)
		];
	}, []);

	return (
		<figure
			className={clsx(
				'animate-fade-in rounded-3xl bg-white p-6 opacity-0 shadow-md shadow-gray-900/5',
				className,
			)}
			style={{ animationDelay }}
			{...props}
		>
			<blockquote className="text-gray-900">
				<StarRating rating={rating} />
				<p className="mt-4 text-lg font-semibold leading-6 before:content-['“'] after:content-['”']">
					{title}
				</p>
				<p className="mt-3 leading-7 text-base-font">{body}</p>
			</blockquote>
			<figcaption className="mt-3 text-sm text-gray-600 before:content-['–_']">
				{author}
			</figcaption>
		</figure>
	);
}

function splitArray(array, numParts) {
	let result = [];
	for (let i = 0; i < array.length; i++) {
		let index = i % numParts;
		if (!result[index]) {
			result[index] = [];
		}
		result[index].push(array[i]);
	}
	return result;
}

function ReviewColumn({
	className,
	reviews,
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	reviewClassName = () => {},
	msPerPixel = 0,
}) {
	let columnRef = useRef();
	let [columnHeight, setColumnHeight] = useState(0);
	let duration = `${columnHeight * msPerPixel}ms`;

	useEffect(() => {
		if (columnRef.current) {
			// Check if current is not null
			const resizeObserver = new window.ResizeObserver(() => {
				// Check inside the callback as well since this might be called later after unmounting
				if (columnRef.current) {
					setColumnHeight(columnRef.current.offsetHeight);
				}
			});

			resizeObserver.observe(columnRef.current);

			return () => {
				resizeObserver.disconnect();
			};
		}
	}, []);

	return (
		<div
			ref={columnRef}
			className={clsx('animate-marquee space-y-8 py-4', className)}
			style={{ '--marquee-duration': duration }}
		>
			{reviews.concat(reviews).map((review, reviewIndex) => (
				<Review
					key={reviewIndex}
					aria-hidden={reviewIndex >= reviews.length}
					className={reviewClassName(reviewIndex % reviews.length)}
					{...review}
				/>
			))}
		</div>
	);
}

function ReviewGrid() {
	let containerRef = useRef();
	let isInView = useInView(containerRef, { once: true, amount: 0.4 });
	let columns = splitArray(reviews, 3);
	columns = [columns[0], columns[1], splitArray(columns[2], 2)];

	return (
		<div
			ref={containerRef}
			className="relative -mx-4 mt-16 grid h-[49rem] max-h-[150vh] grid-cols-1 items-start gap-8 overflow-hidden px-4 sm:mt-20 md:grid-cols-2 lg:grid-cols-3"
		>
			{isInView && (
				<>
					<ReviewColumn
						reviews={[...columns[0], ...columns[2].flat(), ...columns[1]]}
						reviewClassName={reviewIndex =>
							clsx(
								reviewIndex >= columns[0].length + columns[2][0].length &&
									'md:hidden',
								reviewIndex >= columns[0].length && 'lg:hidden',
							)
						}
						msPerPixel={10}
					/>
					<ReviewColumn
						reviews={[...columns[1], ...columns[2][1]]}
						className="hidden md:block"
						reviewClassName={reviewIndex =>
							reviewIndex >= columns[1].length && 'lg:hidden'
						}
						msPerPixel={15}
					/>
					<ReviewColumn
						reviews={columns[2].flat()}
						className="hidden lg:block"
						msPerPixel={10}
					/>
				</>
			)}
			<div className="absolute inset-x-0 top-0 h-32 pointer-events-none bg-gradient-to-b from-gray-50" />
			<div className="absolute inset-x-0 bottom-0 h-32 pointer-events-none bg-gradient-to-t from-gray-50" />
		</div>
	);
}

export function OnboardingReviews() {
	return (
		<section
			id="reviews"
			aria-labelledby="reviews-title"
			className="pt-20 pb-16 sm:pb-24 sm:pt-32"
		>
			<Container>
				<ReviewGrid />
			</Container>
		</section>
	);
}
