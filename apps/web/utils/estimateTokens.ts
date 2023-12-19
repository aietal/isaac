/**
 * Estimates the number of tokens in a string.
 *
 * @param str - The input string.
 * @returns The estimated number of tokens.
 */
export function estimateTokens(str: string): number {
	const tokenLength = 4;
	const estimatedTokens = Math.ceil(str.length / tokenLength);
	return estimatedTokens;
}
