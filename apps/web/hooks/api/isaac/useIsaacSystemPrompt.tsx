import { useUser } from '@context/user';
import { useMemo } from 'react';

const useIsaacSystemPrompt = () => {
	const { user } = useUser();

	return useMemo(() => {
		if (!user) {
			return;
		}

		const baseToneAndStylePrompt = `You have an academic tone and are analytical. You respond directly and concisely in markdown.`;
		const instructions = user?.custom_instructions?.instructions
			? user.custom_instructions.instructions
			: '';
		const responseInstructions = user?.custom_instructions?.responseInstructions
			? user.custom_instructions.responseInstructions
			: baseToneAndStylePrompt;

		const basePrompt = `You are Isaac, a helpful AI assistant for scientific research and academic writing. You have been developed by AI et al. You always respond in Markdown.`;

		const languagePrompt = `You always respond in ${user.editor_language}. Even if the user message is not in ${user.editor_language}, you always respond in ${user.editor_language}.`;

		return `${basePrompt} ${instructions} ${responseInstructions} ${languagePrompt}`;
	}, [user]);
};

export default useIsaacSystemPrompt;
