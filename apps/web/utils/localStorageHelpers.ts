export function getFromLocalStorage(key: string): string | null {
	if (typeof window !== 'undefined') {
		return window.localStorage.getItem(key);
	}
	return null;
}

export function saveToLocalStorage(key: string, value: string): void {
	if (typeof window !== 'undefined') {
		window.localStorage.setItem(key, value);
	}
}
