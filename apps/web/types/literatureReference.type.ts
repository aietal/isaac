export type Author = {
	authorId?: string;
	name: string;
};

export type CitationData = {
	title: string;
	year: string;
	authors: Author[];
	id: string;
	doi?: string;
	index: number;
	searchText?: string;
	type?: ReferenceType;
	sourceType: 'userUpload' | 'reference';
};

export type CustomCitation = {
	title: string;
	year: number;
	authors: string[];
	isAutoImport?: boolean;
};

export const exampleCitation: CitationData = {
	title: 'hello',
	authors: [{ authorId: 'fdasfsf', name: 'Abdullah' }],
	id: 'adasdasgdg',
	doi: 'hadsagrg ewtefq',
	year: '2002',
	index: 1,
	sourceType: 'reference',
};

export type ReferenceLiterature = {
	authors: Author[];
	created_at: string;
	doi: string;
	id: string;
	pdf: string | null;
	projectId: string;
	title: string;
	type: ReferenceType;
	tldr: string | null;
	year: string;
	abstract: string | null;
	source: string | null;
};

export type PublicationTypes = 'Review' | 'JournalArticle' | 'Conference';

export type LiteraturePreview = {
	paperId: string;
	title: string;
	authors: { name: string; authorId: string }[];
	year?: number;
	abstract: string;
	doi: string;
	litType?: PublicationTypes[];
	type: ReferenceType;
	journalName?: string;
	citationCount?: number;
	tldr?: string;
	pdfUrl?: string;
};

export type SemanticScholarReference = {
	paperId: string;
	title: string;
	authors: { authorId: string; name: string }[];
	url: string;
	abstract: string;
	year?: number;
	citationCount?: number;
	externalIds?: {
		CorpusId: number;
		DBLP: string;
		DOI: string;
		MAG: string;
		PubMed: string;
		PubMedCentral: string;
	};
	journal?: {
		name: string;
		pages: string;
		volume: string;
	};
	publicationTypes?: PublicationTypes[];
	openAccessPdf?: {
		status: string;
		url: string;
	};
};

export type UploadedFile = {
	id: string;
	status: string;
	file_name: string;
	created_at: string;
	citation: { name: string; metadata: { year: string } } | null;
	custom_citation?: CustomCitation;
	abstract: string | null;
	tldr: string | null;
};

export enum ReferenceType {
	UNSPECIFIED = 'UNSPECIFIED',
	JOURNAL = 'JOURNAL',
	ARTICLE = 'ARTICLE',
	WEB_PAGE = 'WEB_PAGE',
	REPORT = 'REPORT',
	BOOK = 'BOOK',
	PATENT = 'PATENT',
	BOOK_SECTION = 'BOOK_SECTION',
	THESIS = 'THESIS',
	NEWSPAPER = 'NEWSPAPER',
	FILM = 'FILM',
	BILL = 'BILL',
	STANDARD = 'STANDARD',
	HEARING = 'HEARING',
	CONFERENCE = 'CONFERENCE',
	USER_UPLOAD = 'USER_UPLOAD',
}

export enum ReferenceSource {
	SEMANTIC_SCHOLAR = 'SEMANTIC_SCHOLAR',
	MENDELEY = 'MENDELEY',
	ZOTERO = 'ZOTERO',
	MANUAL_UPLOAD = 'MANUAL_UPLOAD',
}

// TODO: Merge with Reference Source Type
export enum ReferenceSourceFilter {
	ALL = 'ALL',
	SAVED = 'SAVED',
	UPLOADED = 'UPLOADED',
}
