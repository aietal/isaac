export type EditorLanguage = {
	label: string;
	image: string;
	value: string;
};

type EditorLanguages = EditorLanguage[];

export const languages: EditorLanguages = [
	{ label: 'English', image: '🇬🇧', value: 'English' },
	{ label: 'German', image: '🇩🇪', value: 'German' },
	{ label: 'Italian', image: '🇮🇹', value: 'Italian' },
	{ label: 'French', image: '🇫🇷', value: 'French' },
	{ label: 'Spanish', image: '🇪🇸', value: 'Spanish' },
	{ label: 'Arabic', image: '🇸🇦', value: 'Arabic' },
	{ label: 'Turkish', image: '🇹🇷', value: 'Turkish' },
	{ label: 'Hindi', image: '🇮🇳', value: 'Hindi' },
	{ label: 'Chinese', image: '🇨🇳', value: 'Chinese' },
	{ label: 'Japanese', image: '🇯🇵', value: 'Japanese' },
	{ label: 'Russian', image: '🇷🇺', value: 'Russian' },
	{ label: 'Korean', image: '🇰🇷', value: 'Korean' },
	{ label: 'Portuguese', image: '🇵🇹', value: 'Portuguese' },
];
