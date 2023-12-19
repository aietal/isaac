import Link from 'next/link';

import { Container } from '@components/landing/Container';

const faqs = [
	[
		{
			question: 'Do I cheat using Isaac?',
			answer:
				'No. Isaac is not designed to output papers with a click of a button. Isaac is a powerful tool to augment your research workflow.',
		},
		{
			question: 'Is my data safe?',
			answer:
				'Yes. Your data is 100% safe and hosted on GDPR-compliant severs in the EU.',
		},
		{
			question: 'Does Isaac support multiple languages?',
			answer:
				'Yes, you can use Isaac in 13 languages. We are working on adding support for more languages soon.',
		},
	],
	[
		{
			question: 'Who developed Isaac?',
			answer:
				'A small team of German-based engineers with a background in academia.',
		},
		{
			question: 'Is my usage limited?',
			answer:
				'No, once you have subscribed, you can use Isaac indefinitely. Create and upload as many documents as you like.',
		},
		{
			question: 'Is there a free plan?',
			answer: 'Yes, there is. Free forever. No credit card required.',
		},
	],
	[
		{
			question: 'Is Isaac available on mobile?',
			answer:
				'Currently, Isaac is only available on Desktop. But, we´re working hard to enable mobile support as soon as possible.',
		},
		// {
		//   question: 'How do I become an insider?',
		//   answer:
		//     'Contact us with some details about your industry and the type of access you have to apply for an insider account. Once approved, we’ll send you a guide on collecting insider information without being detected at work.',
		// },
		{
			question: 'What if Isaac doesn’t work?',
			answer:
				'Message us via our support chat and we will provide you with a refund.',
		},
	],
];

export function Faqs() {
	return (
		<section
			id="faqs"
			aria-labelledby="faqs-title"
			className="border-t border-gray-200 py-20 sm:py-32"
		>
			<Container>
				<div className="mx-auto max-w-2xl lg:mx-0">
					<h2
						id="faqs-title"
						className="text-3xl font-medium tracking-tight text-gray-900"
					>
						Frequently asked questions
					</h2>
					<p className="mt-2 text-lg text-gray-600">
						If you have anything else you want to ask,{' '}
						<Link
							href="mailto:eimen@aietal.com"
							className="text-gray-900 underline"
						>
							reach out to us
						</Link>
						.
					</p>
				</div>
				<ul
					role="list"
					className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:max-w-none lg:grid-cols-3"
				>
					{faqs.map((column, columnIndex) => (
						<li key={columnIndex}>
							<ul role="list" className="space-y-10">
								{column.map((faq, faqIndex) => (
									<li key={faqIndex}>
										<h3 className="text-lg font-semibold leading-6 text-gray-900">
											{faq.question}
										</h3>
										<p className="mt-4 text-sm text-gray-700">{faq.answer}</p>
									</li>
								))}
							</ul>
						</li>
					))}
				</ul>
			</Container>
		</section>
	);
}
