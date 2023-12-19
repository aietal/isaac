export type PromptBuilderPayload = {
	selection: string;
	additionalContext?: string;
	editorLanguage?: string;
};

//

/**
 * Replaces the placeholders in a base prompt with their corresponding values from the params object.
 *
 * @param basePrompt The base prompt string with placeholders.
 * @param params An object containing the key-value pairs to replace the placeholders.
 * @returns The modified prompt string.
 */
export function buildPrompt(
	basePrompt: string,
	params: { [key: string]: string },
): string {
	let prompt: string = basePrompt;
	for (const key in params) {
		prompt = prompt.replace(`{${key}}`, params[key]);
	}
	return prompt;
}

// Example usage:
// const basePrompt = 'Hello, my name is {name} and I am from {country}.';
// const message = buildPrompt(basePrompt, { name: 'John', country: 'USA' });

export const summarizationPrompt = ({
	selection,
	editorLanguage,
}: PromptBuilderPayload) =>
	`

  I will give you text content, you will rewrite it and output that in a short summarized version of my text. Keep the meaning the same. Ensure that the revised content has significantly fewer characters than the original text, and no more than 100 words, the fewer the better. Only reply to the summary, and nothing else. Do not write explanations. Do not echo my prompt. Do not remind me what I asked you for. Do not apologize. Do not self-reference. Do not use generic filler phrases. Get to the point precisely and accurately. Do not explain what and why, just give me your best possible result.

  Now, using the concepts above, summarize the following text. You must respond in ${
		editorLanguage || 'English'
	}: ${selection}`;

export const bulletsToTextPrompt = ({
	selection,
	editorLanguage,
}: PromptBuilderPayload) =>
	`
  \`no quotes\`
  \`no explanations\`
  \`no prompt\`
  \`no self-reference\`
  \`no apologies\`
  \`no filler\`
  \`just answer\`
  I'll give you a list of bullet points. You'll rewrite it and output it as a paragraph.
  Keep the meaning the same. Only give me the output and nothing else. You must respond in ${
		editorLanguage || 'English'
	}: ${selection}`;

// Manipulate Text Modal Prompts

export const expandPrompt = ({
	selection,
	editorLanguage,
}: PromptBuilderPayload) =>
	`
\`no quotes\`
\`no explanations\`
\`no prompt\`
\`no self-reference\`
\`no apologies\`
\`no filler\`
\`just answer\`
I'll give you text. You'll rewrite it and output it longer to be more than twice the number of characters of the original text.
Keep the meaning the same. Do not continue the text. Expand the input text to say the same thing with more words. Only give me the output and nothing else. Respond in ${
		editorLanguage || 'English'
	}: ${selection}`;

export const shortenPrompt = ({
	selection,
	editorLanguage,
}: PromptBuilderPayload) =>
	`
  \`no quotes\`
  \`no explanations\`
  \`no prompt\`
  \`no self-reference\`
  \`no apologies\`
  \`no filler\`
  \`just answer\`
  I'll give you text. You'll rewrite it and output it shorter to be no more than half the number of characters of the original text.
  Keep the meaning the same. Only give me the output and nothing else. Now, using the concepts above, re-write the following text. Respond in ${
		editorLanguage || 'English'
	}: ${selection}`;

export const paraphrasePrompt = ({
	selection,
	editorLanguage,
}: PromptBuilderPayload) =>
	`
\`no quotes\`
\`no explanations\`
\`no prompt\`
\`no self-reference\`
\`no apologies\`
\`no filler\`
\`just answer\`
I will give you text content, you will rewrite it and output that in a re-worded version of my text. Reword the text to convey the same meaning using a lot different words and sentence structures. Avoiding plagiarism, improving the flow and readability of the text, and ensuring that the re-written content is unique and original. Keep the tone the same.
Keep the meaning the same. Make sure the re-written content's number of characters is approximately the same as the original text's number of characters. Do not alter the original structure and formatting outlined too much. Only give me the output and nothing else.
Now, using the concepts above, re-write the following text. Respond in ${
		editorLanguage || 'English'
	}: ${selection}`;

export const improvePrompt = ({
	selection,
	editorLanguage,
}: PromptBuilderPayload) =>
	`
  \`no quotes\`
  \`no explanations\`
  \`no prompt\`
  \`no self-reference\`
  \`no apologies\`
  \`no filler\`
  \`just answer\`
  I will give you text content, you will improve it to be more academic and an overall better version of my text. The intention is for the text to be published in an academic paper.
Keep the meaning approximately the same. Only give me the output and nothing else.
Now, using the concepts above, re-write the following text. You must respond in ${
		editorLanguage || 'English'
	}: ${selection}`;

export const isaacSystemPrompt = (editorLanguage?: string) =>
	`You are Isaac. A helpful AI assistant for students and researchers trained by AI et al. You have an academic tone. You are analytical. You answer in a no bullshit, direct and concise manner. You always answer in markdown. You always respond in ${editorLanguage}. `;

export const explainPrompt = ({
	selection,
	editorLanguage,
}: PromptBuilderPayload) =>
	`
  \`no quotes\`
  \`no explanations\`
  \`no prompt\`
  \`no self-reference\`
  \`no apologies\`
  \`no filler\`
  \`just answer\`
  Explain the following concept, word or phrase in a concise and simple manner, such that a high school student could understand it. You must respond in ${editorLanguage}:

  ${selection}`;

export const textToBulletPrompt = ({
	selection,
	editorLanguage,
}: PromptBuilderPayload) =>
	`
  \`no quotes\`
  \`no explanations\`
  \`no prompt\`
  \`no self-reference\`
  \`no apologies\`
  \`no filler\`
  \`just answer\`
  Rephrase the text content in bullet short and concise bullet points. You must respond in ${editorLanguage}:

  ${selection}`;

export const customPrompt = ({
	selection,
	additionalContext,
	editorLanguage,
}: PromptBuilderPayload) =>
	`
    \`no quotes\`
    \`no explanations\`
    \`no prompt\`
    \`no self-reference\`
    \`no apologies\`
    \`no filler\`
    \`just answer\`
    Using the following text input:

    ${selection}

    Please modify the text according to the following instruction: ${additionalContext}.

    If you are not asked to translate to a specific language, you must respond in ${editorLanguage}:
    `;

export const generateOutlineHeaderPrompt = (title: string) => {
	return `
			\`no quotes\`
			\`no explanations\`
			\`no prompt\`
			\`no self-reference\`
			\`no apologies\`
			\`no filler\`
			\`just answer\`
			Using the following text input:

			Please create an outline for an academic paper with the title "${title}".
			The outline should consist of headers, each starting with "##" and ending with two new lines.
			Please provide the headers without any additional commentary.
			`;
};
