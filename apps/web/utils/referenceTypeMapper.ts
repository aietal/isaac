import { ReferenceType } from 'types/literatureReference.type';

export const mendeleyToIsaacReferenceTypeMap = {
	web_page: ReferenceType.WEB_PAGE,
	hearing: ReferenceType.HEARING,
	film: ReferenceType.FILM,
	encyclopedia_article: ReferenceType.ARTICLE,
	conference_proceedings: ReferenceType.CONFERENCE,
	newspaper_article: ReferenceType.NEWSPAPER,
	journal: ReferenceType.JOURNAL,
	working_paper: ReferenceType.JOURNAL,
	book: ReferenceType.BOOK,
	report: ReferenceType.REPORT,
	book_section: ReferenceType.BOOK_SECTION,
	thesis: ReferenceType.THESIS,
	bill: ReferenceType.BILL,
	// TBC
	generic: ReferenceType.UNSPECIFIED,
	case: ReferenceType.UNSPECIFIED,
	computer_program: ReferenceType.UNSPECIFIED,
	statute: ReferenceType.UNSPECIFIED,
	television_broadcast: ReferenceType.UNSPECIFIED,
};

export const ZoteroToIsaacReferenceTypeMap = {
	bill: ReferenceType.BILL,
	blogPost: ReferenceType.WEB_PAGE,
	book: ReferenceType.BOOK,
	bookSection: ReferenceType.BOOK_SECTION,
	conferencePaper: ReferenceType.ARTICLE,
	encyclopediaArticle: ReferenceType.ARTICLE,
	film: ReferenceType.FILM,
	hearing: ReferenceType.HEARING,
	instantMessage: ReferenceType.ARTICLE,
	journalArticle: ReferenceType.JOURNAL,
	magazineArticle: ReferenceType.ARTICLE,
	newspaperArticle: ReferenceType.NEWSPAPER,
	patent: ReferenceType.PATENT,
	report: ReferenceType.REPORT,
	standard: ReferenceType.STANDARD,
	thesis: ReferenceType.THESIS,
	webpage: ReferenceType.WEB_PAGE,
	// TBC
	artwork: ReferenceType.UNSPECIFIED,
	attachment: ReferenceType.UNSPECIFIED,
	document: ReferenceType.UNSPECIFIED,
	audioRecording: ReferenceType.UNSPECIFIED,
	annotation: ReferenceType.UNSPECIFIED,
	email: ReferenceType.UNSPECIFIED,
	forumPost: ReferenceType.UNSPECIFIED,
	interview: ReferenceType.UNSPECIFIED,
	computerProgram: ReferenceType.UNSPECIFIED,
	letter: ReferenceType.UNSPECIFIED,
	dictionaryEntry: ReferenceType.UNSPECIFIED,
	manuscript: ReferenceType.UNSPECIFIED,
	map: ReferenceType.UNSPECIFIED,
	note: ReferenceType.UNSPECIFIED,
	case: ReferenceType.UNSPECIFIED,
	podcast: ReferenceType.UNSPECIFIED,
	preprint: ReferenceType.UNSPECIFIED,
	dataset: ReferenceType.UNSPECIFIED,
	presentation: ReferenceType.UNSPECIFIED,
	radioBroadcast: ReferenceType.UNSPECIFIED,
	statute: ReferenceType.UNSPECIFIED,
	tvBroadcast: ReferenceType.UNSPECIFIED,
	videoRecording: ReferenceType.UNSPECIFIED,
};

export type MendeleyReferenceType =
	keyof typeof mendeleyToIsaacReferenceTypeMap;

export type ZoteroReferenceType = keyof typeof ZoteroToIsaacReferenceTypeMap;
