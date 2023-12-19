import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';
import { SearchResult } from './ddgSearch';

const cleanText = (text: string) =>
	text
		.trim()
		.replace(/(\n){4,}/g, '\n\n\n')
		.replace(/ {3,}/g, '  ')
		.replace(/\t/g, '')
		.replace(/\n+(\s*\n)*/g, '\n');

export async function apiExtractText(url: string): Promise<SearchResult[]> {
	let html;
	try {
		const response = await fetch(
			url.startsWith('http') ? url : `https://${url}`,
		);
		html = await response.text();
	} catch (e) {
		return [
			{
				title: 'Could not fetch the page.',
				body: `Could not fetch the page: ${e}.\nMake sure the URL is correct.`,
				url,
			},
		];
	}

	const dom = new JSDOM(html);
	const doc = dom.window.document;
	const parsed = new Readability(doc).parse();

	if (!parsed || !parsed.textContent) {
		return [
			{
				title: 'Could not parse the page.',
				body: 'Could not parse the page.',
				url,
			},
		];
	}

	const text = cleanText(parsed.textContent);

	return [
		{
			title: parsed.title,
			body: text,
			url,
		},
	];
}
