import { CitationStyle } from 'data/citationStyles';
import { CitationData } from 'types/literatureReference.type';

type CitationDataProps = CitationData;

export async function getCitationByDoi(doi: string) {
	// fetch the citation from the following url https://api.citeas.org/product/10.5281/zenodo.1005176?email=test@example.com and return the citation
	const response = await fetch(
		`https://api.citeas.org/product/${doi}?email=eimen@aietal.com`,
	);

	const data = await response.json();

	return data.citations[0].citation;
}

export function getCitation(
	authors: string[],
	title: string,
	year: number,
	journal: string,
	volume: string,
	pages: string,
) {
	let citation = '';
	citation += authors[0];
	if (authors.length > 2) {
		citation += ' et al.';
	}
	citation += ` ({year}). ${title}. ${journal} ${volume}, ${pages}.`;
	return citation;
}

export function generateCitation(
	citationData: CitationDataProps,
	citationName: CitationStyle,
	pagePageDetail?: string,
	isInText = true,
	shorten = true,
): string {
	switch (citationName) {
		case CitationStyle.APA:
			return generateAPACitation(
				citationData,
				isInText,
				pagePageDetail,
				shorten,
			);
		case CitationStyle.MLA:
			return generateMLACitation(
				citationData,
				isInText,
				pagePageDetail,
				shorten,
			);
		case CitationStyle.CHICAGO:
			return generateChicagoCitation(
				citationData,
				isInText,
				pagePageDetail,
				shorten,
			);
		default:
			throw new Error('Invalid citation style');
	}
}
function generateAPACitation(
	citationData: CitationData,
	isInText: boolean,
	pageDetail: string,
	shorten: boolean,
): string {
	const authors =
		citationData.authors.length > 2
			? `${citationData.authors[0].name.split(' ')[1]} et al.`
			: citationData.authors
					.map(author => author.name.split(' ')[1])
					.join(' & ');

	if (isInText) {
		return `(${authors}, ${citationData.year})`;
	} else {
		const authors = citationData.authors.map(author => author.name).join(', ');
		return `${authors} (${citationData.year}). ${citationData.title}.`;
	}
}

function generateMLACitation(
	citationData: CitationData,
	isInText: boolean,
	pageDetail: string,
	shorten: boolean,
): string {
	if (isInText) {
		const authors =
			citationData.authors.length > 2
				? `${citationData.authors[0].name.split(' ')[1]} et al.`
				: citationData.authors
						.map(author => author.name.split(' ')[1])
						.join(' and ');

		return pageDetail ? `(${authors} ${pageDetail})` : `(${authors})`;
	} else {
		const authors = citationData.authors.map(author => author.name).join(', ');
		return `${authors}. "${citationData.title}." ${citationData.year}.`;
	}
}

function generateChicagoCitation(
	citationData: CitationData,
	isInText: boolean,
	pageDetail: string,
	shorten: boolean,
): string {
	const authors =
		citationData.authors.length > 2
			? `${citationData.authors[0].name.split(' ')[1]} et al.`
			: citationData.authors
					.map(author => author.name.split(' ')[1])
					.join(' & ');

	if (isInText) {
		return pageDetail
			? `(${authors}, ${citationData.year}, ${pageDetail})`
			: `(${authors}, ${citationData.year})`;
	} else {
		return `${authors} (${citationData.year}). ${citationData.title}.`;
	}
}
