export function getDOMRangeRect(nativeSelection, rootElement) {
	// check if nativeSelection is longer than 1
	if (nativeSelection.rangeCount === 0) {
		return null;
	}

	const domRange = nativeSelection.getRangeAt(0);

	let rect;

	if (nativeSelection.anchorNode === rootElement) {
		let inner = rootElement;
		while (inner.firstElementChild != null) {
			inner = inner.firstElementChild;
		}
		rect = inner.getBoundingClientRect();
	} else {
		rect = domRange.getBoundingClientRect();
	}

	return rect;
}
