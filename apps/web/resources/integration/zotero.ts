import { supabase } from '@utils/supabase';
import { OAuth } from 'oauth';
import {
	ZoteroAPIToken,
	ZoteroCollection,
	ZoteroDocument,
} from 'types/integration';

export const zoteroClientKey = process.env.NEXT_PUBLIC_ZOTERO_CLIENT_KEY;
export const zoteroClientSecret = process.env.NEXT_PUBLIC_ZOTERO_CLIENT_SECRET;
export const zoteroRedirectUri = process.env.NEXT_PUBLIC_ZOTERO_REDIRECT;

const apiBaseUrl = 'https://api.zotero.org';
const baseUrl = 'https://www.zotero.org';

export const zoteroOauth = new OAuth(
	`${baseUrl}/oauth/request`,
	`${baseUrl}/oauth/access`,
	'5b17c296a499f7788a6f', // consumerKey
	'1a88b66076f2f0181135', // consumerSecret
	'1.0A',
	zoteroRedirectUri,
	'HMAC-SHA1',
);

export const getZoteroFolders = async (payload: ZoteroAPIToken) => {
	const response = await fetch(
		`https://api.zotero.org/users/${payload.userID}/collections?v=3`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Zotero-API-Key': payload.accessToken,
			},
		},
	);

	const collections = await response.json();
	return collections as ZoteroCollection[];
};

export const getZoteroDocuments = async (
	payload: ZoteroAPIToken & {
		folderId: string;
	},
) => {
	const response = await fetch(
		`https://api.zotero.org/users/${payload.userID}/collections/${payload.folderId}/items?v=3`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Zotero-API-Key': payload.accessToken,
			},
		},
	);

	const collections = await response.json();
	return collections as ZoteroDocument[];
};
