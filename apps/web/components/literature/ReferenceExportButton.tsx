import { Button } from '@components/ui/button';
import { FileDown } from 'lucide-react';
import { list } from 'postcss';
import React from 'react';
import toast from 'react-hot-toast';

const ReferenceExportButton = () => {
	return (
		<Button size="xs" variant="ghost" onClick={() => downloadAsBibTex(list)}>
			<FileDown size={16} strokeWidth={1.4} className="mr-1" />
			Export BibTeX
		</Button>
	);
};

export default ReferenceExportButton;

function referenceLiteratureToBibTeX(reference) {
	const authors = reference.authors
		.map(author => `${author.lastName}, ${author.firstName}`)
		.join(' and ');
	const title = reference.title;
	const year = reference.year;
	const doi = reference.doi;
	const id = reference.id;

	let bibTeXEntry = `@article{${id},\n`;
	bibTeXEntry += `  author = {${authors}},\n`;
	bibTeXEntry += `  title = {${title}},\n`;
	bibTeXEntry += `  year = {${year}},\n`;
	bibTeXEntry += `  doi = {${doi}},\n`;
	bibTeXEntry += `}\n`;

	return bibTeXEntry;
}

const downloadAsBibTex = referenceList => {
	let bibTextEntries = '';

	if (referenceList.length === 0) {
		toast.error(
			'No references found to generate BibTeX. Please upload or create references before exporting to BibTeX.',
		);
		return;
	}

	for (let i = 0; i < referenceList.length; i++) {
		const currentRef = referenceList[i];

		if ('authors' in currentRef) {
			// It's a ReferenceLiterature
			const bibTeXEntry = referenceLiteratureToBibTeX(currentRef);
			bibTextEntries += bibTeXEntry;
		} else if ('citation' in currentRef && currentRef.citation !== null) {
			// It's an UploadedFile with citation
			const { name, metadata } = currentRef.citation;
			const authors = [{ lastName: name }];
			const title = name;
			const year = metadata.year;
			const doi = currentRef.doi;
			const id = currentRef.id;

			const bibTeXEntry = referenceLiteratureToBibTeX({
				authors,
				title,
				year,
				doi,
				id,
			});
			bibTextEntries += bibTeXEntry;
		} else if (currentRef.custom_citation) {
			// It's an UploadedFile with "custom_citation"
			const { title, year, authors } = currentRef.custom_citation;
			const authorString = authors?.join(' and ');
			const doi = currentRef.doi;
			const id = currentRef.id;

			const bibTeXEntry =
				`@article{${id},\n` +
				`  author = {${authorString}},\n` +
				`  title = {${title}},\n` +
				`  year = {${year}},\n` +
				`  doi = {${doi}},\n` +
				`}\n`;

			bibTextEntries += bibTeXEntry;
		}

		// Add a newline between entries (optional, adjust as needed)
		if (i < referenceList.length - 1) {
			bibTextEntries += '\n';
		}
	}

	const element = document.createElement('a');
	element.setAttribute(
		'href',
		'data:application/x-bibtex;charset=utf-8,' +
			encodeURIComponent(bibTextEntries),
	);
	element.setAttribute('download', 'isaac-references.bib');

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
};
