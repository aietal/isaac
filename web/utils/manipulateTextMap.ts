import {
	bulletsToTextPrompt,
	customPrompt,
	expandPrompt,
	explainPrompt,
	improvePrompt,
	paraphrasePrompt,
	PromptBuilderPayload,
	shortenPrompt,
	summarizationPrompt,
	textToBulletPrompt,
} from '@utils/promptBuilder';

export enum ManipulateTextMethods {
	SUMMARIZE = 'SUMMARIZE',
	PARAPHRASE = 'PARAPHRASE',
	EXPAND = 'EXPAND',
	IMPROVE = 'IMPROVE',
	SHORTEN = 'SHORTEN',
	BULLET_TO_TEXT = 'BULLET_TO_TEXT',
	TEXT_TO_BULLET = 'TEXT_TO_BULLET',
	EXPLAIN = 'EXPLAIN',
	CUSTOM = 'CUSTOM',
}

type ManipulateTextProps = {
	mixpanelTrack: string;
	userManipulationTitle: string;
	assistantManipulationTitle: string;
	endpoint: string;
	promptBuilder: (payload: PromptBuilderPayload) => string;
};

type ManipulateTextMap = Record<ManipulateTextMethods, ManipulateTextProps>;

export const manipulateTextMap: ManipulateTextMap = {
	[ManipulateTextMethods.SUMMARIZE]: {
		mixpanelTrack: 'Summarize Text',
		userManipulationTitle: 'Please summarize the following text:',
		assistantManipulationTitle: 'Here is a summary of your highlighted text:',
		endpoint: '/api/summarize',
		promptBuilder: summarizationPrompt,
	},
	[ManipulateTextMethods.PARAPHRASE]: {
		mixpanelTrack: 'Paraphrase Text',
		userManipulationTitle: 'Please paraphrase the following text:',
		assistantManipulationTitle:
			'Here is a paraphrased version of your highlighted text:',
		endpoint: '/api/manipulate-text',
		promptBuilder: paraphrasePrompt,
	},
	[ManipulateTextMethods.EXPAND]: {
		mixpanelTrack: 'Expand',
		userManipulationTitle: 'Please expand the following text:',
		assistantManipulationTitle:
			'Here is a expanded version of your highlighted text:',
		endpoint: '/api/manipulate-text',
		promptBuilder: expandPrompt,
	},
	[ManipulateTextMethods.IMPROVE]: {
		mixpanelTrack: 'Improve',
		userManipulationTitle: 'Please improve the following text:',
		assistantManipulationTitle:
			'Here is a improved version of your highlighted text:',
		endpoint: '/api/manipulate-text',
		promptBuilder: improvePrompt,
	},
	[ManipulateTextMethods.SHORTEN]: {
		mixpanelTrack: 'Shorten',
		userManipulationTitle: 'Please shorten the following text:',
		assistantManipulationTitle:
			'Here is a short version of your highlighted text:',
		endpoint: '/api/manipulate-text',
		promptBuilder: shortenPrompt,
	},
	[ManipulateTextMethods.BULLET_TO_TEXT]: {
		mixpanelTrack: 'Bullet to Text',
		userManipulationTitle:
			'Please re-phrase the following text without bullet points:',
		assistantManipulationTitle:
			'Here is a version of your highlighted text without the bullet points:',
		endpoint: '/api/bullets', // TODO: Change to manipulate text endpoint
		promptBuilder: bulletsToTextPrompt,
	},
	[ManipulateTextMethods.TEXT_TO_BULLET]: {
		mixpanelTrack: 'Text to Bullet',
		userManipulationTitle:
			'Please re-phrase the following text with bullet points:',
		assistantManipulationTitle:
			'Here is a version of your highlighted text without the bullet points:',
		endpoint: '/api/manipulate-text',
		promptBuilder: textToBulletPrompt,
	},
	[ManipulateTextMethods.EXPLAIN]: {
		mixpanelTrack: 'Explain',
		userManipulationTitle: 'Please explain the following text:',
		assistantManipulationTitle:
			'Here is an explanation of your highlighted text:',
		endpoint: '/api/explain',
		promptBuilder: explainPrompt,
	},
	[ManipulateTextMethods.CUSTOM]: {
		mixpanelTrack: 'Custom',
		userManipulationTitle: 'Please modify the following text:',
		assistantManipulationTitle:
			'Here is the modified version of your highlighted text:',
		endpoint: '/api/explain',
		promptBuilder: customPrompt,
	},
};
