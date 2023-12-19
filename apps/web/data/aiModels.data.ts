export const AIModelLocalStorageKey = 'AIModelSelection';

export enum AIModels {
	GPT_3_5 = 'gpt-3.5-turbo',
	GPT_4 = 'gpt-4-1106-preview',
}

export const aiModelList = [
	{ model: AIModels.GPT_3_5, label: 'GPT-3.5', disabled: false },
	{ model: AIModels.GPT_4, label: 'GPT-4', disabled: true },
];
