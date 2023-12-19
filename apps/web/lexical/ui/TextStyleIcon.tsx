import {
	Heading1,
	Heading2,
	Heading3,
	Heading4,
	Heading5,
	List,
	ListOrdered,
	Text,
} from 'lucide-react';
import React from 'react';

export enum TextBlockStyle {
	code = 'code',
	h1 = 'h1',
	h2 = 'h2',
	h3 = 'h3',
	h4 = 'h4',
	h5 = 'h5',
	ol = 'ol',
	paragraph = 'paragraph',
	quote = 'quote',
	ul = 'ul',
}

type Props = {
	style: TextBlockStyle;
};

const size = 18;
const strokeWidth = 1.5;

const TextStyleIcon = ({ style }: Props) => {
	return {
		[TextBlockStyle.paragraph]: <Text size={size} strokeWidth={strokeWidth} />,
		[TextBlockStyle.h1]: <Heading1 size={size} strokeWidth={strokeWidth} />,
		[TextBlockStyle.h2]: <Heading2 size={size} strokeWidth={strokeWidth} />,
		[TextBlockStyle.h3]: <Heading3 size={size} strokeWidth={strokeWidth} />,
		[TextBlockStyle.h4]: <Heading4 size={size} strokeWidth={strokeWidth} />,
		[TextBlockStyle.h5]: <Heading5 size={size} strokeWidth={strokeWidth} />,
		[TextBlockStyle.ul]: <List size={size} strokeWidth={strokeWidth} />,
		[TextBlockStyle.ol]: <ListOrdered size={size} strokeWidth={strokeWidth} />,
		// paragraph: <RiFontSize />,
		// h1: <RiH1 />,
		// h2: <RiH2 />,
		// h3: <RiH3 />,
		// h4: <RiH4 />,
		// h5: <RiH5 />,
		// ul: <RiListUnordered />,
		// ol: <RiListOrdered />,
	}[style];
};

export default TextStyleIcon;
