/** Native session-row reminder for surveys awaiting the user.
 *
 * Native ask_user_question lights the owning session row in the sidebar by
 * feeding a `question/requested` frame into the client session runtime. This
 * bundle reaches that same public entry point (`SessionRuntime.handleMuxEnvelope`)
 * on its own: poll the host's pending list and feed one frame per pending
 * survey, so the sidebar shows the exact native amber "等待回答" dot on the
 * owning session — visible from every session, no UI seat of our own needed.
 * When the survey settles, a `question/resolved` frame clears the dot.
 *
 * The runtime also mints a PendingWait per requested frame, which the native
 * QuestionComposer would render in the composer. We take over that chain seat
 * for frames we fed (marked with `__dshSurvey`), so the composer shows a quiet
 * hint instead of a duplicate native question card; native ask_user_question
 * frames (no marker) still reach the shipped composer untouched. */
import { React } from "./runtime.js";
import { useText } from "./i18n.js";

const POLL_MS = 5000;
/** Marker carried on the question payload we feed, so our composer selector
 *  recognises our own frames and never touches native ask_user_question. */
const SURVEY_MARKER = "__dshSurvey";

/** The client session runtime, captured in apply(); absent faces stay null. */
let sessionsFace = null;

export function setSessionsFace(sessions) {
	sessionsFace = sessions;
}

async function fetchPending() {
	try {
		const res = await fetch("/api/dsh-survey/pending", { method: "GET" });
		const data = await res.json();
		if (data === null || typeof data !== "object" || data.ok !== true) return [];
		return Array.isArray(data.surveys) ? data.surveys : [];
	} catch (error) {
		return null;
	}
}

function asWaiting(surveys) {
	return surveys.filter((s) => s !== null && typeof s === "object");
}

function canFeed(sessions) {
	return sessions !== null && sessions !== undefined && typeof sessions.handleMuxEnvelope === "function";
}

/** Frame id: stable per pending survey, reused by the resolved frame. */
function frameIdOf(callId) {
	return `dsh-survey:${callId}`;
}

/** Feed one `question/requested` frame so the sidebar lights the owning
 *  session row with the native pending-question dot. The question payload is a
 *  marker carrier only — the real survey renders from the tool call block. */
function feedRequested(sessions, survey) {
	const callId = survey.callId;
	const sessionId = survey.sessionId;
	if (typeof callId !== "string" || typeof sessionId !== "string") return;
	try {
		sessions.handleMuxEnvelope({
			rpcId: frameIdOf(callId),
			payload: {
				type: "question/requested",
				sessionId,
				questions: [{ id: callId, question: "", [SURVEY_MARKER]: true }]
			}
		});
	} catch (error) {
		// A session that left the live list between poll and feed must not throw.
	}
}

/** Feed the matching `question/resolved` frame so the native dot clears. */
function feedResolved(sessions, survey) {
	const callId = survey.callId;
	const sessionId = survey.sessionId;
	if (typeof callId !== "string" || typeof sessionId !== "string") return;
	try {
		sessions.handleMuxEnvelope({
			rpcId: frameIdOf(callId),
			payload: {
				type: "question/resolved",
				sessionId,
				questionRpcId: frameIdOf(callId),
				outcome: "answered"
			}
		});
	} catch (error) {
		// Idempotent — a late duplicate resolve is a no-op.
	}
}

/** The pending-list snapshot the composer hint reads (module-level store). */
let snapshot = [];
let listener = null;

function publish(next) {
	snapshot = next;
	if (listener !== null) listener();
}

export function subscribe(fn) {
	listener = fn;
	return () => {
		if (listener === fn) listener = null;
	};
}

export function getSnapshot() {
	return snapshot;
}

/** Start the poll-and-feed loop. Returns a disposer; call once from apply().
 *  Feeding is idempotent (same frame id + status is a no-op), so re-feeding
 *  the still-pending set every poll is safe; only surveys that LEFT the list
 *  receive the resolved frame. */
export function startPendingSync() {
	let prev = new Map();
	const refresh = async () => {
		if (!canFeed(sessionsFace)) return;
		const list = await fetchPending();
		if (list === null) return;
		const waiting = asWaiting(list);
		const current = new Map(waiting.map((s) => [s.callId, s]));
		for (const [callId, survey] of prev) {
			if (!current.has(callId)) feedResolved(sessionsFace, survey);
		}
		for (const [callId, survey] of current) feedRequested(sessionsFace, survey);
		prev = current;
		publish(waiting);
	};
	refresh();
	const timer = setInterval(refresh, POLL_MS);
	const onVisible = () => {
		if (document.visibilityState === "visible") refresh();
	};
	document.addEventListener("visibilitychange", onVisible);
	return () => {
		clearInterval(timer);
		document.removeEventListener("visibilitychange", onVisible);
	};
}

/** Read the current pending list, re-rendering when the poll updates it. */
export function usePendingSurveys() {
	return React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/** Composer-chain takeover: claim the composer only for question frames WE fed
 *  (carrier marker present); everything else (native ask_user_question) passes
 *  through to the shipped QuestionComposer. */
export function selectSurveyQuestion({ interactions }) {
	const found = (interactions || []).find((i) =>
		i && i.kind === "question" &&
		Array.isArray(i.payload && i.payload.questions) &&
		i.payload.questions.some((q) => q !== null && typeof q === "object" && q[SURVEY_MARKER] === true)
	);
	return found ?? null;
}

/** The composer hint shown while THIS session has a pending survey: a quiet
 *  amber line instead of a duplicate native question card. Clicking scrolls to
 *  the survey card in the conversation flow. */
export function PendingComposerHint() {
	const t = useText();
	const scrollToCard = () => {
		const card = document.querySelector(".mq-frame");
		if (card !== null && card !== undefined && typeof card.scrollIntoView === "function") {
			card.scrollIntoView({ behavior: "smooth", block: "center" });
		}
	};

	return React.createElement("button", {
		type: "button",
		className: "mq-pending-composer",
		"data-active": true,
		"aria-label": t("pending.composer.hint"),
		title: t("pending.composer.hint"),
		onClick: scrollToCard
	},
		React.createElement("span", { className: "mq-pending-dot", "aria-hidden": true }),
		React.createElement("span", { className: "mq-pending-composer-text" }, t("pending.composer"))
	);
}
