/** Read the tool call once: every card takes the questions as a prop. */
export function parseCall(block) {
	try {
		const parsed = JSON.parse(block.argsRaw || "{}");
		return {
			mode: parsed.mode,
			questions: Array.isArray(parsed.questions) ? parsed.questions : []
		};
	} catch (error) {
		return { mode: undefined, questions: [] };
	}
}
