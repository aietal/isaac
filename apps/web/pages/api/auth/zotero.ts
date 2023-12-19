import { zoteroOauth } from '@resources/integration/zotero';
import { supabase } from '@utils/supabase';
import { ToastQuery } from 'types/queryParam';

let oauthTokenSecret: string;
let userId: string;
let projectId: string;

export default async function handler(req, res) {
	if (req.method === 'GET') {
		if (req.query && req.query.oauth_verifier) {
			await handleState1(req, res, userId, projectId);
		} else {
			userId = req.query.userId;
			projectId = req.query.projectId;
			await handleState0(req, res, userId);
		}
	} else {
		res.status(405).end();
	}
}
const handleState0 = async (req, res, userId) => {
	zoteroOauth.getOAuthRequestToken(
		(error, oauthToken, receivedOauthTokenSecret, results) => {
			if (error) {
				console.log('error', error);
				res.redirect('/cancelled');
				return;
			}

			// Store oauthTokenSecret temporarily in memory
			oauthTokenSecret = receivedOauthTokenSecret;

			console.log('oauthToken:', oauthToken);

			res
				.status(302)
				.setHeader(
					'Location',
					`https://www.zotero.org/oauth/authorize?oauth_token=${oauthToken}`,
				);
			res.end();
		},
	);
};

const handleState1 = async (req, res, userId, projectId) => {
	const oauthVerifier = req.query.oauth_verifier;
	const oauthToken = req.query.oauth_token;

	zoteroOauth.getOAuthAccessToken(
		oauthToken,
		oauthTokenSecret,
		oauthVerifier,
		async (error, accessToken, accessTokenSecret, results) => {
			if (error) {
				console.log('error:', error);

				res.redirect(`/editor/${projectId || ''}?t=${ToastQuery.ZOTERO_FAIL}`);
				return;
			}

			console.log('results', JSON.stringify(results.userID));

			const { error: upsertError } = await supabase
				.from('user_integrations')
				.upsert([
					{
						id: userId,
						zotero: { accessToken, userID: results.userID },
					},
				]);

			if (upsertError) {
				console.log('upsertError:', upsertError);
				res.redirect(`/editor/${projectId || ''}?t=${ToastQuery.ZOTERO_FAIL}`);
				return;
			}

			res.redirect(`/editor/${projectId || ''}?t=${ToastQuery.ZOTERO_SUCCESS}`);
		},
	);
};
