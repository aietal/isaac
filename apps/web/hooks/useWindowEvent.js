import { useEffect, useRef } from 'react';

export function useWindowEvent(type, listener, options) {
	let listenerRef = useRef(listener);
	listenerRef.current = listener;

	useEffect(() => {
		function handler(event) {
			listenerRef.current.call(window, event);
		}

		window.addEventListener(type, handler, options);
		return () => window.removeEventListener(type, handler, options);
	}, [type, options]);
}
