import { useWindowEvent } from './useWindowEvent';

export function useKeyboardShortcut(key, callback, metaKey, shiftKey) {
	useWindowEvent('keydown', event => {
		const activeElem = document.activeElement;

		if (
			event.key?.toLowerCase() === key &&
			event.metaKey === !!metaKey &&
			event.shiftKey === !!shiftKey &&
			activeElem?.getAttribute('role') !== 'menu' &&
			activeElem?.tagName !== 'INPUT' &&
			activeElem?.tagName !== 'TEXTAREA'
		) {
			event.preventDefault();
			event.stopPropagation();
			callback();
		}
	});
}
