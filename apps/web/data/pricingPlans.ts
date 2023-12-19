export const freePlanLimits = {
	dailyFreeToken: 20,
	uploadStorage: 100,
};

const weeklyId =
	process.env.NODE_ENV === 'development'
		? 'price_1NPa8JK2peOePDsbKvkI67oi'
		: 'price_1NTOgCK2peOePDsbsBsU8bgr';
const monthlyId =
	process.env.NODE_ENV === 'development'
		? 'price_1NPj0LK2peOePDsbxRe4OJAw'
		: 'price_1NY8QnK2peOePDsbTE1LuTrT';

const yearlyId =
	process.env.NODE_ENV === 'development'
		? 'price_1NPj0LK2peOePDsbxRe4OJAw'
		: 'price_1NY8RIK2peOePDsbANwbErOS';

export const pricingPlans = [
	{
		name: 'Free forever',
		featured: false,
		price: '$0',
		priceId: undefined,
		description: 'No subscription required',
		features: [
			`${freePlanLimits.dailyFreeToken} daily tokens generative AI & chat`,
			`${freePlanLimits.uploadStorage} MB of file upload storage`,
			'AI-assisted writing',
			`Upload and Chat with your documents`,
			'Literature Search',
			'Community Support',
		],
		logomarkClassName: 'fill-primary',
	},
	{
		name: 'Monthly',
		featured: false,
		priceId: monthlyId,
		oldPrice: '$25/mo ',
		price: '$11/mo',
		description: 'Monthly Subscription',
		features: [
			'Unlimited generative AI & Chat',
			'Unlimited file upload storage',
			'AI-assisted writing',
			'Upload and Chat with your documents',
			'Literature Search',
			'Premium Support',
		],
		logomarkClassName: 'fill-primary',
	},
	{
		name: 'Yearly',
		featured: false,
		priceId: yearlyId,
		oldPrice: '$19/mo',
		price: '$7/mo',
		description: 'Yearly Subscription',
		features: [
			'Unlimited generative AI & Chat',
			'Unlimited file upload storage',
			'AI-assisted writing',
			'Upload and Chat with your documents',
			'Literature Search',
			'Premium Support',
		],
		logomarkClassName: 'fill-primary',
	},
];
