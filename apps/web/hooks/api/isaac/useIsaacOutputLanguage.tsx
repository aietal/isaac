import { useLocalStorage } from '@mantine/hooks';
import { languages } from 'data/languages';

const useIsaacOutputLanguage = () => {
	const [language, setLanguage] = useLocalStorage({
		key: 'isaac-output-language',
		defaultValue: languages[0],
	});
	return { language, setLanguage };
};

export default useIsaacOutputLanguage;
