import type {
	DOMExportOutput,
	EditorConfig,
	LexicalEditor,
	LexicalNode,
	NodeKey,
	SerializedLexicalNode,
	Spread,
} from 'lexical';

import { $applyNodeReplacement, DecoratorNode } from 'lexical';
import * as React from 'react';
import { CitationData } from 'types/literatureReference.type';

const CitationComponent = React.lazy(
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	() => import('./CitationComponent'),
);

export type SerializedCitationNode = Spread<
	{
		type: 'citation';
		data: CitationData;
		inline: boolean;
		page?: string;
	},
	SerializedLexicalNode
>;

export class CitationNode extends DecoratorNode<JSX.Element> {
	__data: CitationData;
	__inline: boolean;
	__citationText: string;
	__page: string;

	static getType(): string {
		return 'citation';
	}

	static clone(node: CitationNode): CitationNode {
		return new CitationNode(
			node.__data,
			node.__inline,
			node.__page,
			node.__key,
		);
	}

	constructor(
		data: CitationData,
		inline?: boolean,
		page?: string,
		key?: NodeKey,
	) {
		super(key);
		this.__data = data;
		this.__inline = inline ?? false;
		this.__page = page;
	}

	static importJSON(serializedNode: SerializedCitationNode): CitationNode {
		const node = $createCitationNode(
			serializedNode.data,
			serializedNode.inline,
			serializedNode.page,
		);
		return node;
	}

	exportJSON(): SerializedCitationNode {
		return {
			data: this.getData(),
			page: this.__page,
			inline: this.__inline,
			type: 'citation',
			version: 1,
		};
	}

	createDOM(_config: EditorConfig): HTMLElement {
		return document.createElement(this.__inline ? 'span' : 'div');
	}

	getData(): CitationData {
		return this.__data;
	}

	getTextContent(): string {
		return this.__citationText;
	}

	updateDOM(prevNode: CitationNode): boolean {
		// If the inline property changes, replace the element
		return this.__inline !== prevNode.__inline;
	}

	exportDOM(editor: LexicalEditor): DOMExportOutput {
		const element = document.createElement(this.__inline ? 'span' : 'div');
		element.setAttribute('data-lexical-decorator', 'true');
		element.textContent = '';
		return { element };
	}

	// Responsible for rendering component
	decorate(): JSX.Element {
		return this.__data ? (
			<CitationComponent
				nodeKey={this.getKey()}
				citation={this.__data}
				page={this.__page}
			/>
		) : null;
	}

	// custom function
	setTextContent(textContent: string): void {
		const writable = this.getWritable();
		writable.__citationText = textContent;
	}

	setPage(pageDetail: string) {
		const writable = this.getWritable();
		writable.__page = pageDetail;
	}

	// sync refrence index with IEE Citation
	setReferenceIndex(newIndex: number): void {
		const writable = this.getWritable();
		writable.__data.index = newIndex;
	}
}

export function $createCitationNode(
	data: CitationData,
	inline: boolean,
	page?: string,
): CitationNode {
	const citationNode = new CitationNode(data, inline, page);

	return $applyNodeReplacement(citationNode);
}

export function $isCitationNode(
	node: LexicalNode | null | undefined,
): node is CitationNode {
	return node instanceof CitationNode;
}
