/** Client half of dsh-survey: registers the `do_a_survey` toolview.
 *
 * The bundle is wrapped by build.mjs into the client module loader's
 * `factory(require)` shape, so `require` here is the loader's resolver — the
 * one that hands back the host's own React and UI primitives. */
import { bindRuntime, React } from "./runtime.js";
import { injectCss } from "./css.js";
import { setLocaleFace } from "./i18n.js";
import { parseCall } from "./call.js";
import { RecapCard } from "./modes/recap.js";
import { SurveyCard } from "./modes/survey.js";
import { CompactCard } from "./modes/compact.js";
import { GridCard } from "./modes/grid.js";

bindRuntime(require);

export const name = "dsh-survey";
export const inject = ["slots"];

function SurveyRoot(props) {
	const block = props.block;
	if (block.kind === "tool-result") {
		return React.createElement(RecapCard, { block });
	}
	const call = parseCall(block);
	const questions = call.questions;
	let mode = "inline";
	if (call.mode === "compact" || call.mode === "inline" || call.mode === "overlay" || call.mode === "grid") mode = call.mode;
	// A compact card shows exactly one question. Rendering a longer survey
	// through it would hide everything after the first while still submitting
	// those questions as unanswered, so widen to inline instead.
	if (mode === "compact" && questions.length > 1) mode = "inline";
	if (mode === "compact") return React.createElement(CompactCard, { block, questions });
	if (mode === "grid") return React.createElement(GridCard, { block, questions });
	return React.createElement(SurveyCard, { block, questions, mode });
}

export function apply(ctx) {
	injectCss();
	// Bind once: useSyncExternalStore wants a stable subscribe reference, and
	// the runtime's methods need their receiver.
	const locale = ctx.get("locale");
	if (locale !== undefined && locale !== null && typeof locale.subscribe === "function") {
		setLocaleFace({
			subscribe: (listener) => locale.subscribe(listener),
			getSnapshot: () => locale.getSnapshot()
		});
	}
	const slots = ctx.get("slots");
	if (slots === undefined) return;
	return ctx.slots.inject("tool.call.toolview", () => ctx.slots.register(
		{ name: "tool.call.toolview", key: "do_a_survey" },
		SurveyRoot
	));
}
