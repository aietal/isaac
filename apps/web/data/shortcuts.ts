export const hotKeys = {
	isaacPanel: {
		key: '8',
		withCommand: true,
	},
	referencePanel: {
		key: '9',
		withCommand: true,
	},
	notePanel: {
		key: '0',
		withCommand: true,
	},
	closePanel: {
		key: '-',
		withCommand: true,
	},
	toggleSidebar: {
		key: 'q',
		withCommand: true,
	},
	toggleTheme: {
		key: 'j',
		withCommand: true,
	},
	openCommand: {
		key: 'k',
		withCommand: true,
	},
	toggleComment: {
		key: 'm',
		withCommand: true,
	},
	toggleProjectNav: {
		key: 'p',
		withCommand: true,
	},
};

export const tabNumberKeys = ['1', '2', '3', '4', '5', '6', '7'];

export const allCommandKeys = Object.values(hotKeys)
	.filter(key => key.withCommand)
	.map(key => key.key)
	.concat(tabNumberKeys);
