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
 * The composer is never touched: the CURRENT session is skipped entirely (its
 * survey card is already visible in the conversation flow, and feeding a frame
 * there would mint a PendingWait the native QuestionComposer would render),
 * and frames are only fed for OTHER sessions, whose waits stay invisible to
 * the current composer. Opening a waiting session resolves its frame, so the
 * dot clears exactly when the user arrives — the card is in front of them. */
import { React } from "./runtime.js";

const POLL_MS = 5000;

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

/** The session currently open in the UI, when any. */
function currentSessionId(sessions) {
	try {
		const list = sessions && sessions.list;
		if (list === undefined || list === null || typeof list.getSnapshot !== "function") return undefined;
		const snapshot = list.getSnapshot();
		return snapshot && typeof snapshot.current === "string" ? snapshot.current : undefined;
	} catch (error) {
		return undefined;
	}
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
				questions: [{ id: callId, question: "" }]
			}
		});
	} catch (error) {
		// A session that left the live list between poll and feed must not throw.
	}
}

/** Feed the matching `question/resolved` frame so the native dot clears and
 *  any PendingWait this bundle minted is settled (composer stays untouched). */
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

/** Start the poll-and-feed loop. Returns a disposer; call once from apply().
 *  Feeding is idempotent (same frame id + status is a no-op), so re-feeding
 *  the still-pending set every poll is safe; only surveys that LEFT the list,
 *  or whose session just became current, receive the resolved frame. */
export function startPendingSync() {
	let prev = new Map();
	const refresh = async () => {
		if (!canFeed(sessionsFace)) return;
		const list = await fetchPending();
		if (list === null) return;
		const waiting = asWaiting(list);
		const current = new Map(waiting.map((s) => [s.callId, s]));
		const open = currentSessionId(sessionsFace);
		for (const [callId, survey] of prev) {
			if (!current.has(callId) || survey.sessionId === open) feedResolved(sessionsFace, survey);
		}
		for (const [callId, survey] of current) {
			// Never feed the session the user is looking at: the survey card is
			// already in its conversation flow, and feeding there would mint a
			// PendingWait the native QuestionComposer renders in the composer.
			if (survey.sessionId === open) continue;
			feedRequested(sessionsFace, survey);
		}
		prev = current;
	};
	refresh();
	const timer = setInterval(refresh, POLL_MS);
	const onVisible = () => {
		if (document.visibilityState === "visible") refresh();
	};
	document.addEventListener("visibilitychange", onVisible);
	// Re-sync the instant the open session changes: the session that just came
	// into view resolves its frame (card is in front of the user), and the one
	// left behind re-lights.
	let unsubscribe = null;
	try {
		const list = sessionsFace && sessionsFace.list;
		if (list !== undefined && list !== null && typeof list.subscribe === "function") {
			unsubscribe = list.subscribe(() => refresh());
		}
	} catch (error) {
		unsubscribe = null;
	}
	return () => {
		clearInterval(timer);
		document.removeEventListener("visibilitychange", onVisible);
		if (unsubscribe !== null) unsubscribe();
	};
}
