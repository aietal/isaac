import {
	DOMConversionMap,
	DOMConversionOutput,
	DOMExportOutput,
	EditorConfig,
	ElementNode,
	LexicalNode,
	SerializedElementNode,
} from 'lexical';

type SerializedCollapsibleContentNode = SerializedElementNode;

export function convertCollapsibleContentElement(
	domNode: HTMLElement,
): DOMConversionOutput | null {
	const node = $createCollapsibleContentNode();
	return {
		node,
	};
}

export class CollapsibleContentNode extends ElementNode {
	static getType(): string {
		return 'collapsible-content';
	}

	static clone(node: CollapsibleContentNode): CollapsibleContentNode {
		return new CollapsibleContentNode(node.__key);
	}

	createDOM(config: EditorConfig): HTMLElement {
		const dom = document.createElement('div');
		dom.classList.add('Collapsible__content');
		dom.innerText = 'Ayoooo mein brdr';
		// add a data attribute to the div
		dom.setAttribute('data-attribute', 'nice mein brdr');
		return dom;
	}

	updateDOM(prevNode: CollapsibleContentNode, dom: HTMLElement): boolean {
		return false;
	}

	static importDOM(): DOMConversionMap | null {
		return {
			div: (domNode: HTMLElement) => {
				if (!domNode.hasAttribute('data-lexical-collapsible-content')) {
					return null;
				}
				return {
					conversion: convertCollapsibleContentElement,
					priority: 2,
				};
			},
		};
	}

	exportDOM(): DOMExportOutput {
		const element = document.createElement('div');
		element.setAttribute('data-lexical-collapsible-content', 'true');
		return { element };
	}

	static importJSON(
		serializedNode: SerializedCollapsibleContentNode,
	): CollapsibleContentNode {
		return $createCollapsibleContentNode();
	}

	// To use this method, you would get a reference to your CollapsibleContentNode instance
	// and call `updateContent` with the new text content whenever your API streams data.
	// For example:

	isShadowRoot(): boolean {
		return true;
	}

	exportJSON(): SerializedCollapsibleContentNode {
		return {
			...super.exportJSON(),
			type: 'collapsible-content',
			version: 1,
		};
	}
}

export function $createCollapsibleContentNode(): CollapsibleContentNode {
	return new CollapsibleContentNode();
}

export function $isCollapsibleContentNode(
	node: LexicalNode | null | undefined,
): node is CollapsibleContentNode {
	return node instanceof CollapsibleContentNode;
}
