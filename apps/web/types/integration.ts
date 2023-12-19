import {
	MendeleyReferenceType,
	ZoteroReferenceType,
} from '@utils/referenceTypeMapper';

export type UserIntegration = {
	mendeley: MendeleyToken;
	zotero: ZoteroAPIToken;
};

export type ZoteroAPIToken = {
	userID: string;
	accessToken: string;
};

export type MendeleyToken = {
	access_token: string;
	refresh_token: string;
	expired_date: Date | string;
	expires_in: 3600;
	// token_type: 'bearer';
	// msso: null;
	// scope: 'all';
};

export type MendeleyDocument = {
	id: string;
	title: string;
	type: MendeleyReferenceType;
	authors: { first_name: string; last_name: string }[];
	year: number;
	source: string;
	identifiers: {
		doi: string;
	};
	abstract: string;
};

export type MendeleyFolder = {
	id: string;
	name: string;
};

export type ZoteroCollection = {
	key: string; // Id
	data: {
		name: string;
		url: string;
	};
};

export type ZoteroDocument = {
	key: string; // Id
	data: {
		title: string;
		DOI: string;
		year: string;
		itemType: ZoteroReferenceType;
		creators: { firstName: string; lastName: string }[];
		date: string;
		url: string;
		abstractNote: string;
	};
};
