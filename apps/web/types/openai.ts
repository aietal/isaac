export interface ChatGPTMessage {
	role: 'system' | 'assistant' | 'user';
	content: string;
}

export interface OpenAIStreamPayload {
	model: string;
	messages: ChatGPTMessage[];
	max_tokens: number;
	temperature: number;
}
