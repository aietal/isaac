export enum CitationStyle {
	APA = 'APA',
	MLA = 'MLA',
	CHICAGO = 'Chicago',
}

export const citationStyles = {
	[CitationStyle.APA]: { name: 'APA' },
	[CitationStyle.MLA]: { name: 'MLA' },
	[CitationStyle.CHICAGO]: { name: 'Chicago' },
};

export const citationStyleList = Object.values(CitationStyle);
