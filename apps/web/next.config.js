// https://nextjs.org/docs/api-reference/next.config.js/introduction
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
let nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	experimental: {
		scrollRestoration: true,
	},
	pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
	images: {
		domains: [
			'ueftdvxzwiswsoiqoqwf.supabase.co',
			'gzxyhflukmcbrfvltcgj.supabase.co',
		],
	},
};

module.exports = withBundleAnalyzer(nextConfig);
