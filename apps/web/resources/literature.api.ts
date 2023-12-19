import { UniqueTabSources } from '@hooks/useDocumentTabs';
import { currentYear, earliestLiteratureYear } from 'data/meta';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import { SemanticScholarReference } from 'types/literatureReference.type';

export type GetLiteraturePayload = {
	startYear?: number;
	endYear?: number;
	openNewTab?: boolean;
	keyword: string;
};

export type LiteratureResponse = {
	literature: SemanticScholarReference[];
};

const getLiterature = async ({
	startYear = earliestLiteratureYear,
	endYear = currentYear,
	keyword,
}: GetLiteraturePayload) => {
	const yearRange = `${startYear}-${endYear}`;

	const response = await fetch('/api/litsearch', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			search_query: keyword.replace(/ /g, '+'),
			year_range: yearRange,
		}),
	});
	const data = await response.json();

	return data as LiteratureResponse;
};

export const useGetLiterature = (
	payload?: GetLiteraturePayload,
	options?: { onSuccess?: (data: LiteratureResponse) => void },
) => {
	return useQuery(['get-literature', payload], () => getLiterature(payload), {
		enabled: !!payload && payload?.keyword !== UniqueTabSources.NEW_LIT_SEARCH,
		onSuccess: data => {
			options?.onSuccess?.(data);
		},
		onError: error => {
			console.log({ error });
			//TODO: need to show a more clearer message
			toast.error('There is something wrong. Please try again.');
		},
	});
};

const proxyUrl = 'https://isaac-cors-anywhere.fly.dev/';

const fetchPdf = async (targetUrl: string) => {
	const data = await fetch(proxyUrl + targetUrl);
	const blob = await data.blob();
	return URL.createObjectURL(blob);
};

export const useFetchLiteraturePdf = (targetUrl?: string) => {
	return useQuery(
		['get-literature-pdf', targetUrl],
		() => fetchPdf(targetUrl),
		{
			enabled: !!targetUrl,
		},
	);
};

const getLiteratureDetails = async (doi?: string) => {
	const response = await fetch('/api/paper-details', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ doi: doi }),
	});
	const data = await response.json();
	return data.paperDetails as SemanticScholarReference;
};

export const useGetLiteratureDetails = (
	id?: string,
	options?: { onSuccess?: (data: SemanticScholarReference) => void },
) => {
	return useQuery(
		['get-literature-detail', id],
		() => getLiteratureDetails(id),
		{
			enabled: !!id,
			onSuccess: data => {
				options?.onSuccess(data);
			},

			onError: error => {
				console.log({ error });
				//TODO: need to show a more clearer message
				toast.error('There is something wrong. Please try again.');
			},
		},
	);
};
