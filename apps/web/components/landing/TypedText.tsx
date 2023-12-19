import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';

const TypedText = () => {
	const el = useRef(null);

	useEffect(() => {
		const typed = new Typed(el.current, {
			strings: [
				'Researchers',
				'Students',
				'Scientists',
				'Knowledge Workers',
				'Academics',
			],
			startDelay: 300,
			typeSpeed: 50,
			backSpeed: 50,
			backDelay: 1000,
			loop: true,
		});

		return () => {
			typed.destroy();
		};
	}, []);

	return <span className="text-isaac min-w-max" ref={el} />;
};

export default TypedText;
