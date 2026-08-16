/** Client half of dsh-survey: registers the `do_a_survey` toolview and the
 *  native session-row reminder for pending surveys.
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
import { setSessionsFace, startPendingSync } from "./pending.js";

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
	// The client session runtime (`SessionRuntime`) is served as ctx.sessions.
	// Its public handleMuxEnvelope is the native entry the sidebar dot reads;
	// capture it so the pending sync can feed frames that light the owning
	// session row exactly like ask_user_question does.
	const sessions = ctx.get("sessions");
	if (sessions !== undefined && sessions !== null && typeof sessions.handleMuxEnvelope === "function") {
		setSessionsFace(sessions);
	}
	const slots = ctx.get("slots");
	if (slots === undefined) return;
	const disposers = [];
	disposers.push(ctx.slots.inject("tool.call.toolview", () => ctx.slots.register(
		{ name: "tool.call.toolview", key: "do_a_survey" },
		SurveyRoot
	)));
	// Poll the host's pending list and feed native question frames: the sidebar
	// shows the real amber "等待回答" dot on the owning session row. Frames are
	// fed only for sessions other than the one currently open — the composer
	// and the open session's flow stay completely untouched.
	if (typeof sessions !== "undefined" && sessions !== null && typeof sessions.handleMuxEnvelope === "function") {
		disposers.push(startPendingSync());
	}
	return () => {
		for (const dispose of disposers) dispose();
	};
}
