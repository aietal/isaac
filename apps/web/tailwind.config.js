const defaultTheme = require('tailwindcss/defaultTheme');
const { fontFamily } = require('tailwindcss/defaultTheme');

/**
 * @type {import('@types/tailwindcss/tailwind-config').TailwindConfig}
 */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'components/**/*.{js,ts,jsx,tsx}',
		'./lexical/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			boxShadow: {
				'2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
			},

			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				gray: {
					50: '#FAFAFA',
					100: '#F4F4F5',
					200: '#E4E4E7',
					300: '#D4D4D8',
					400: '#A2A2A8',
					500: '#6E6E76',
					600: '#52525A',
					700: '#3F3F45',
					800: '#2E2E33',
					900: '#1c1c1c',
				},
				neutral: {
					50: '#FAFAFA',
					100: '#f5f5f5',
					200: '#e5e5e5',
					300: '#d4d4d4',
					400: '#a3a3a3',
					500: '#737373',
					600: '#525252',
					700: '#404040',
					800: '#262626',
					900: '#171717',
				},

				indigo: {
					50: '#F8FBFF',
					100: '#EBF4FF',
					200: '#C3DAFE',
					300: '#A3BFFA',
					400: '#7F9CF5',
					500: '#667EEA',
					600: '#5A67D8',
					700: '#4C51BF',
					800: '#34399B',
					900: '#1E2156',
				},
				purple: {
					50: '#FAF5FF',
					100: '#F3E8FF',
					200: '#E9D8FD',
					300: '#D6BCFA',
					400: '#B794F4',
					500: '#9F7AEA',
					600: '#805AD5',
					700: '#6B46C1',
					800: '#553C9A',
					900: '#44337A',
				},
				pink: {
					50: '#FFF5F7',
					100: '#FFEBEF',
					200: '#FED7E2',
					300: '#FBB6CE',
					400: '#F687B3',
					500: '#ED64A6',
					600: '#D53F8C',
					700: '#B83280',
					800: '#97266D',
					900: '#702459',
				},
				base: '#fffefc',
				'venetian-red': {
					100: '#e16259',
					200: '#ea4e43',
				},
				formButton: {
					100: '#2383E2',
					200: '#0075D3',
				},
				desertStorm: {
					100: '#FBFBFA',
				},
				isaac: {
					DEFAULT: '#F95730',
				},
			},
			borderRadius: {
				lg: `var(--radius)`,
				md: `calc(var(--radius) - 2px)`,
				sm: 'calc(var(--radius) - 4px)',
			},
			outline: {
				blue: '2px solid rgba(0, 112, 244, 0.5)',
			},
			spacing: {
				128: '32rem',
				'9/16': '56.25%',
				'3/4': '75%',
				'1/1': '100%',
			},
			// fontFamily: {
			//   sans: ['Segoe UI', ...defaultTheme.fontFamily.sans],
			// },
			fontFamily: {
				sans: ['system-ui', ...fontFamily.sans],
			},
			fontSize: {
				xs: ['0.75rem', { lineHeight: '1.5' }],
				sm: ['14px', { lineHeight: '16.8px' }],
				'base-font': ['1rem', { lineHeight: '1.5' }],
				lg: ['1.125rem', { lineHeight: '1.5' }],
				xl: ['1.25rem', { lineHeight: '1.5' }],
				'2xl': ['1.63rem', { lineHeight: '1.35' }],
				'3xl': ['2.63rem', { lineHeight: '1.24' }],
				'4xl': ['40px', { lineHeight: '1.18' }],
				'5xl': ['4rem', { lineHeight: '1.16' }],
				'6xl': ['5.5rem', { lineHeight: '1.11' }],
			},
			inset: {
				'1/2': '50%',
				full: '100%',
			},
			letterSpacing: {
				tighter: '-0.02em',
				tight: '-0.01em',
				normal: '0',
				wide: '0.01em',
				wider: '0.02em',
				widest: '0.4em',
			},
			minWidth: {
				10: '2.5rem',
			},
			scale: {
				98: '.98',
			},
			animation: {
				float: 'float 5s ease-in-out infinite',
				'fade-in': 'fade-in 0.5s linear forwards',
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				ripple: 'ripple 3400ms ease infinite',
				marquee: 'marquee var(--marquee-duration) linear infinite',
				'spin-slow': 'spin 4s linear infinite',
				'spin-slower': 'spin 6s linear infinite',
				'spin-reverse': 'spin-reverse 1s linear infinite',
				'spin-reverse-slow': 'spin-reverse 4s linear infinite',
				'spin-reverse-slower': 'spin-reverse 6s linear infinite',
				meteor: 'meteor 5s linear infinite',
				grid: 'grid 15s linear infinite',
			},
			keyframes: {
				float: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10%)' },
				},
				ripple: {
					'0%, 100%': {
						transform: 'translate(-50%, -50%) scale(1)',
					},
					'50%': {
						transform: 'translate(-50%, -50%) scale(0.9)',
					},
				},
				grid: {
					'0%': { transform: 'translateY(-50%)' },
					'100%': { transform: 'translateY(0)' },
				},
				'fade-in': {
					from: { opacity: 0 },
					to: { opacity: 1 },
				},
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
				marquee: {
					to: { transform: 'translateY(-50%)' },
				},
				'spin-reverse': {
					to: { transform: 'rotate(-360deg)' },
				},
				meteor: {
					'0%': { transform: 'rotate(215deg) translateX(0)', opacity: 1 },
					'70%': { opacity: 1 },
					'100%': {
						transform: 'rotate(215deg) translateX(-500px)',
						opacity: 0,
					},
				},
			},
			zIndex: {
				'-1': '-1',
				'-10': '-10',
			},
			transitionProperty: {
				width: 'width',
				height: 'height',
			},
			transitionTimingFunction: {
				'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
				'out-back': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
			},
		},
	},
	plugins: [
		// eslint-disable-next-line global-require
		require('@tailwindcss/forms'),
		require('tailwind-scrollbar-hide'),
		require('@tailwindcss/typography'),
		require('tailwindcss-animate'),
	],
};
