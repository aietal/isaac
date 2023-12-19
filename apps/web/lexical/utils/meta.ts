export const platform =
	typeof window !== 'undefined'
		? (window.navigator.platform as 'MacIntel' | 'windows' | 'linux')
		: undefined;

export const commandKey = platform === 'MacIntel' ? '⌘' : 'Ctrl';
