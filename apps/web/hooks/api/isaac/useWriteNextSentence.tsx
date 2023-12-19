import { useUser } from '@context/user';
import { createDOMRange } from '@lexical/selection';
import {
	CitationSearchRequest,
	CitationSearchResponse,
	SimilarSource,
} from '@pages/api/similarity-search';
import { $createTextNode, $getSelection, LexicalEditor } from 'lexical';
import { SSE } from 'sse.js';

function formatCitation(authors, year) {
	const authorList = authors.split(',');
	const firstAuthor = authorList[0].trim();
	const lastSpaceIndex = firstAuthor.lastIndexOf(' ');

	if (authorList.length > 1) {
		const lastName =
			lastSpaceIndex !== -1
				? firstAuthor.slice(lastSpaceIndex + 1)
				: firstAuthor;
		return `${lastName} et al. (${year})`;
	} else {
		return `${firstAuthor} (${year})`;
	}
}

const similarityThreshold = 0.75;

const getCitationsForText = async (text: string, project_id: string) => {
	const apiURL = '/api/similarity-search';

	const data: CitationSearchRequest = {
		query: text,
		max_results: 5,
		project_id: project_id,
	};

	const response = await fetch(apiURL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});
	if (response.status !== 200) {
		return [];
	}

	const citations = await response.json();

	return citations as CitationSearchResponse;
};
const useWriteNextSentence = (editor: LexicalEditor) => {
	const { user } = useUser();

	const writeNextSentence = () => {
		editor.update(async () => {
			const selection = $getSelection();

			// @ts-ignore
			const anchor = selection.anchor;
			// @ts-ignore
			const focus = selection.focus;
			const range = createDOMRange(
				editor,
				anchor.getNode(),
				anchor.offset,
				focus.getNode(),
				focus.offset,
			);

			// const range = selection.getRangeAt(0);
			const preCursorRange = range.cloneRange();
			preCursorRange.selectNodeContents(editor.getRootElement());
			preCursorRange.setEnd(range.endContainer, range.endOffset);
			const text = preCursorRange.toString();

			// if text is longer than 750 characters keep only the last 750 characters
			const textCompletion = text.length > 750 ? text.slice(-750) : text;

			// get project id from url
			const project_id = window.location.pathname.split('/')[2];

			// get citations for text
			const citations = await getCitationsForText(textCompletion, project_id);
			let source = null;

			if ('similarSources' in citations) {
				const relevantSourceResponse =
					citations.similarSources as SimilarSource[];

				const filteredRelevantSourceResponse = relevantSourceResponse.filter(
					source => source.similarity_score > similarityThreshold,
				);
				const relevantCitations = [];
				for (const source of relevantSourceResponse) {
					const quotation = '"' + source.content + '"';
					const authors =
						source.citation && source.citation.authors
							? String(source.citation.authors)
							: 'Unknown author';
					const year =
						source.citation && source.citation.year
							? source.citation.year
							: 'Unknown year';

					const currCitation = formatCitation(authors, year);
					relevantCitations.push(quotation + ' ' + currCitation);
				}

				source = new SSE('/api/completion', {
					payload:
						`Relevant Citations: \n` +
						String(relevantCitations) +
						`\n\n Continue the following text in one to two sentences. Feel free to insert relevant citations as it makes sense. Your output must be in ${user?.editor_language}: \n\n ${textCompletion}.`,
				});
			} else {
				source = new SSE('/api/completion', {
					payload: `Complete the following text with one or two sentences. If the text to continue is shorter than three words, you must say "Please write at least three words and try again. Kindly - Isaac 🧑‍🚀". Your output must be in ${user?.editor_language}: \n\n Text to Continue: ${textCompletion}.`,
				});
			}

			source.addEventListener('message', function (e) {
				const binaryString = atob(e.data);
				const eventMessage = decodeURIComponent(escape(binaryString))
				if (eventMessage === '[DONE]') {
					source.close();
				} else {
					const text = eventMessage;

					editor.update(() => {
						const selection = $getSelection();
						selection.insertNodes([$createTextNode(text)]);
					});
				}
			});
			source.stream();
		});
	};

	return { writeNextSentence };
};

export default useWriteNextSentence;
