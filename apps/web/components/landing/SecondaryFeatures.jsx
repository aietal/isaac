import { Logomark } from '@components/landing/Logo';
import {
	FileSearch,
	FolderCog,
	MessageSquare,
	PenTool,
	Workflow,
} from 'lucide-react';
import { useId } from 'react';

import { Container } from '@components/landing/Container';

function LogoIcon(props) {
	return (
		<svg
			viewBox="-17.325 -17.5 35 35"
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
			version="1.1"
			{...props}
		>
			<g
				transform="translate(-9.86315914027474 -9.9) scale(0.2286655162328319)"
				id="icon"
			>
				<g>
					<path d="M85.413 42.707C85.413 19.12 66.292 0 42.706 0 19.119 0 0 19.12 0 42.707c0 .059.004.118.004.177H0v18.99l.044.981c.935 13.687 19.673 24.609 42.662 24.609s41.727-10.923 42.663-24.609l.044-.647V42.884h-.005c0-.059.005-.118.005-.177zm-7.604 15.155v2.096c0 10.268-15.809 18.59-35.306 18.59-19.499 0-35.306-8.322-35.306-18.59v-.937V47.699c0-9.454 7.663-17.119 17.118-17.119h36.374c9.455 0 17.12 7.665 17.12 17.119v10.163z" />
					<path d="M59.17 34.187H25.837c-8.663 0-15.685 5.828-15.685 13.02v9.313c0 11.322 14.482 14.153 32.351 14.153 17.868 0 32.351-3.081 32.351-14.153v-4.743-4.57c0-7.192-7.024-13.02-15.684-13.02zM18.894 54.389a2.423 2.423 0 1 1 0-4.846 2.423 2.423 0 0 1 0 4.846zm8.989-4.192a6.242 6.242 0 0 1 0-12.484 6.24 6.24 0 0 1 6.24 6.241 6.241 6.241 0 0 1-6.24 6.243z" />
				</g>
			</g>
		</svg>
	);
}

function DeviceClockIcon(props) {
	return (
		<svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
			<circle cx={16} cy={16} r={16} fill="#A3A3A3" fillOpacity={0.2} />
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M5 4a4 4 0 014-4h14a4 4 0 014 4v10h-2V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9a2 2 0 00-2 2v24a2 2 0 002 2h5v2H9a4 4 0 01-4-4V4z"
				fill="#737373"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M24 32a8 8 0 100-16 8 8 0 000 16zm1-8.414V19h-2v5.414l4 4L28.414 27 25 23.586z"
				fill="#171717"
			/>
		</svg>
	);
}

const features = [
	{
		name: 'Integrated AI assistant',
		description:
			'Think of it as your own ChatGPT specifically designed for academic writing.',
		icon: LogoIcon,
	},
	{
		name: 'AI-supported writing',
		description:
			'Enhance your writing with autocomplete, paraphrasing, summarizing, and more.',
		icon: PenTool,
	},
	{
		name: 'Literature search',
		description:
			'Search and read relevant academic literature right inside of Isaac.',
		icon: FileSearch,
	},
	{
		name: 'Chat with documents',
		description:
			'Upload your papers and let Isaac answer your questions about them',
		icon: MessageSquare,
	},
	{
		name: 'Automate workflows',
		description:
			'Streamline your literature reviews with our automated functions. More coming soon.',
		icon: Workflow,
	},
	{
		name: 'References management',
		description:
			'Save and organize documents in your reference list, easily accessible right within the editor.',
		icon: FolderCog,
	},
];

export function SecondaryFeatures() {
	return (
		<section
			id="secondary-features"
			aria-label="Features for building a portfolio"
			className="py-20 sm:py-32"
		>
			<Container>
				<div className="mx-auto max-w-3xl sm:text-center">
					<h2 className="text-3xl font-medium tracking-tight text-gray-900">
						AI-first standard for academic writing
					</h2>
					<p className="mt-2 text-lg text-gray-600">
						Isaac integrates all steps of the academic writing workflow into one
						app.
					</p>
				</div>
				<ul
					role="list"
					className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 text-sm sm:mt-20 sm:grid-cols-2 md:gap-y-10 lg:max-w-none lg:grid-cols-3"
				>
					{features.map(feature => (
						<li
							key={feature.name}
							className="rounded-2xl border border-gray-200 p-8"
						>
							<feature.icon className="h-8 w-8" />
							<h3 className="mt-6 font-semibold text-gray-900">
								{feature.name}
							</h3>
							<p className="mt-2 text-gray-700">{feature.description}</p>
						</li>
					))}
				</ul>
			</Container>
		</section>
	);
}
