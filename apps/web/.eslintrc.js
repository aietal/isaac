module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:@typescript-eslint/recommended',
		'next',
		'next/core-web-vitals',
		'prettier',
	],
	parser: '@typescript-eslint/parser',
	plugins: ['react', '@typescript-eslint'],
	overrides: [
		{
			files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
		},
	],
	rules: {
		'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
		'no-irregular-whitespace': 'warn',
		'no-console': ['warn', {}],
		'react-hooks/rules-of-hooks': 'warn',
		'react-hooks/exhaustive-deps': 'warn',
		'@typescript-eslint/ban-ts-comment': 'warn',
		'react/display-name': 'off',
	},
	settings: {
		react: {
			version: 'detect',
		},
		'import/resolver': {
			node: {
				extensions: ['.js', '.jsx', '.ts', '.tsx'],
			},
			typescript: {
				alwaysTryTypes: true,
			},
		},
	},
};
