/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from 'next';

import { getDbInstance } from '@utils/pgClient';
import { getServiceSupabase } from '../../utils/supabase';
import { createEmbedding } from '@utils/create_embedding';

export type CitationSearchRequest = {
	query: string;
	max_results: number;
	project_id: string;
};

type Citation = {
	year: number;
	title: string;
	authors: string[];
};

type PDFMetadata = {
	source: string;
	category: string;
	citation: {
		year: string;
		title: string;
		authors: string[];
		isAutoImport: boolean;
	};
	filename: string;
	filetype: string;
	coordinates: {
		points: [number, number][];
		system: string;
		layout_width: number;
		layout_height: number;
	};
	page_number: number;
	start_index: number;
	last_modified: string;
};

export type SimilarSource = {
	content: string;
	metadata: any | PDFMetadata;
	similarity_score: number;
	citation: Citation;
};

export type CitationSearchResponse = {
	similarSources: SimilarSource[];
};

function calculateCosineSimilarity(A: number[], B: number[]): number {
	let dotProduct = 0;
	let magnitudeA = 0;
	let magnitudeB = 0;

	for (let i = 0; i < A.length; i++) {
		dotProduct += A[i] * B[i];
		magnitudeA += A[i] * A[i];
		magnitudeB += B[i] * B[i];
	}

	magnitudeA = Math.sqrt(magnitudeA);
	magnitudeB = Math.sqrt(magnitudeB);

	const similarityScore = dotProduct / (magnitudeA * magnitudeB);
	return similarityScore;
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const body = req.body as CitationSearchRequest;

	const requestData = {
		input: body.query,
		model: 'text-embedding-ada-002',
	};

	try {
		const embedding = await createEmbedding(requestData);

		const pgClient = getDbInstance();

		const supabase = getServiceSupabase();

		const { data: projectData, error: projectError } = await supabase
			.from('uploads')
			.select('id,citation,custom_citation')
			.eq('project_id', body.project_id);

		if (projectError) {
			throw new Error('Failed to get user documents from supabase');
		}

		if (projectData.length === 0) {
			throw new Error('No documents found for this project');
		}

		const idToCitationMap = {}; // Create a map to store id to citation mapping

		projectData.forEach(item => {
			let citation = item.citation;
			if (item.citation === null) {
				citation = item.custom_citation;
			}
			idToCitationMap[item.id] = citation;
		});

		const projectIDs = projectData.map(item => item.id); // This creates an array of UUID strings

		const pgQuery = `SELECT * FROM document_embeddings WHERE upload_id IN ($1:csv)`;

		const embeddingVectors: number[][] = [];
		const embeddingTexts: string[] = [];
		const metadata: any[] = [];
		const citationsList: any[] = [];

		try {
			const documents = await pgClient.any(pgQuery, [projectIDs]);

			for (const row of documents) {
				const tmp = row.embedding
					.replace(' ', '')
					.split(',')
					.map(item => parseFloat(item) || 0.0);

				embeddingVectors.push(tmp);
				embeddingTexts.push(row.content);
				metadata.push(row.metadata);
				citationsList.push(idToCitationMap[row.upload_id]);
			}
		} catch (err) {
			console.error(err);
			throw new Error('Database query error');
		}

		const similarityScores = embeddingVectors.map(
			vec => calculateCosineSimilarity(embedding, vec) * 100,
		);

		const maxResults = Math.min(body.max_results, similarityScores.length);
		const topN: number[] = [];

		const scores = [];

		for (let x = 0; x < maxResults; x++) {
			const max = Math.max(...similarityScores);
			const maxIndex = similarityScores.indexOf(max);
			scores.push(max);
			topN.push(maxIndex);
			similarityScores[maxIndex] = -1;
		}

		const topNTexts = topN.map(index => embeddingTexts[index]);
		const topNMetadata = topN.map(index => metadata[index]);
		const topNCitations = topN.map(index => citationsList[index]);

		const similarSources = topNTexts.map((text, x) => ({
			content: text,
			metadata: topNMetadata[x],
			similarity_score: scores[x] / 100,
			citation: topNCitations[x],
		}));

		return res.status(200).json({ similarSources: similarSources });
	} catch (error) {
		console.error(error);
		return res.status(400).json({ error: error.message });
	}
}
