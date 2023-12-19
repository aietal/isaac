// postcss.config.js
module.exports = {
	plugins: {
		tailwindcss: {},
		'postcss-focus-visible': {
			replaceWith: '[data-focus-visible-added]',
		},
		autoprefixer: {},
	},
};
