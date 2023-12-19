import { supabase } from '@utils/supabase';
import {
	MendeleyDocument,
	MendeleyFolder,
	MendeleyToken,
} from 'types/integration';

const appId = process.env.NEXT_PUBLIC_MENDELEY_APP_ID;
const redirectUri = process.env.NEXT_PUBLIC_MENDELEY_REDIRECT;
const secret = process.env.NEXT_PUBLIC_MENDELEY_SECRET;

const baseUrl = 'https://api.mendeley.com';
const credentials = `${appId}:${secret}`;
const base64Credentials = btoa(credentials);
const basicAuthHeader = `Basic ${base64Credentials}`;

const userAuthorizationRequestPath = `${baseUrl}/oauth/authorize?client_id=${appId}&response_type=code&scope=all&redirect_uri=${redirectUri}`;
const userTokenPath = `${baseUrl}/oauth/token`;
const getFolders = `${baseUrl}/folders`;
const getGroups = `${baseUrl}/groups`;
const getDocuments = `${baseUrl}/documents`;

const headers = new Headers();
headers.append('Content-Type', 'application/x-www-form-urlencoded');
headers.append('Authorization', basicAuthHeader);

export const getMendeleyUserAuthorizationUrl = async (projectId: string) => {
	window.location.href = `${userAuthorizationRequestPath}&state=${projectId}`;
};

export const createMendeleyToken = async (authorizationCode: string) => {
	const urlencoded = new URLSearchParams();
	urlencoded.append('grant_type', 'authorization_code');
	urlencoded.append('code', authorizationCode);
	urlencoded.append('redirect_uri', redirectUri);
	urlencoded.append('scope', 'all');

	const requestOptions = {
		method: 'POST',
		headers,
		body: urlencoded,
	};

	const res = await fetch(userTokenPath, requestOptions);
	const status = res.status;
	const data = (await res.json()) as MendeleyToken;
	return { status, data };
};

export const refreshMendeleyToken = async (refreshToken: string) => {
	const urlencoded = new URLSearchParams();
	urlencoded.append('grant_type', 'refresh_token');
	urlencoded.append('redirect_uri', redirectUri);
	urlencoded.append('refresh_token', refreshToken);

	const requestOptions = {
		method: 'POST',
		headers,
		body: urlencoded,
	};

	const res = await fetch(userTokenPath, requestOptions);
	const status = res.status;
	const data = (await res.json()) as MendeleyToken;
	return { status, data };
};

export const getMendeleyFolders = async (token: string) => {
	const headers = new Headers();
	headers.append('Authorization', `Bearer ${token}`);
	headers.append('Content-Type', 'application/x-www-form-urlencoded');
	const res = await fetch(getFolders, { headers });
	const data = await res.json();
	return data as MendeleyFolder[] | undefined;
};

export const getMendeleyDocuments = async ({
	token,
	folderId,
}: {
	token: string;
	folderId: string;
}) => {
	const headers = new Headers();
	headers.append('Authorization', `Bearer ${token}`);
	headers.append('Content-Type', 'application/x-www-form-urlencoded');
	const url = `${getDocuments}?folder_id=${folderId}`;
	const res = await fetch(url, { headers });
	const data = await res.json();

	return data as MendeleyDocument[] | undefined;
};

export const saveMendeleyToken = async (
	userId: string,
	data: MendeleyToken,
) => {
	const { error, status } = await supabase.from('user_integrations').upsert([
		{
			id: userId,
			mendeley: {
				...data,
				expired_date: new Date(new Date().getTime() + 60 * 60 * 1000),
			},
		},
	]);

	return { error, status };
};

export const deleteMendeleyToken = async (userId: string) => {
	const { error, status } = await supabase
		.from('user_integrations')
		.update([
			{
				mendeley: null,
			},
		])
		.eq('id', userId);

	return { error, status };
};
