import pgPromise from 'pg-promise';

const pgp = pgPromise({});

let pgClient;

export const getDbInstance = () => {
	if (!pgClient) {
		console.log('Initializing new pgClient');
		pgClient = pgp({
			user: process.env.EMBEDDINGS_DATABASE_USER,
			host: process.env.EMBEDDINGS_DATABASE_HOST,
			database: process.env.EMBEDDINGS_DATABASE_NAME,
			password: process.env.EMBEDDINGS_DATABASE_PASSWORD,
			port: process.env.EMBEDDINGS_DATABASE_PORT,
		});
	} else {
		console.log('Using existing pgClient');
	}
	return pgClient;
};

export const executeQuery = async query => {
	try {
		const db = getDbInstance();
		return await db.any(query);
	} catch (error) {
		console.error('Error executing query:', error);
		return [];
	}
};
