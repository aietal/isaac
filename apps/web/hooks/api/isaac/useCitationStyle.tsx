import { useLocalStorage } from '@mantine/hooks';
import { CitationStyle } from 'data/citationStyles';

export const citationStyleLocalStorageKey = 'isaac-citation-style-key';

const useCitationStyle = () => {
	const [citationStyle, setCitationStyle] = useLocalStorage<CitationStyle>({
		key: citationStyleLocalStorageKey,
		defaultValue: CitationStyle.APA,
	});

	return { citationStyle, setCitationStyle };
};

export default useCitationStyle;
