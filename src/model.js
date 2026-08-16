/** Draft state, submit/cancel, and modal dismissal for one survey. */
import { pickedToSelected } from "./answers.js";
import { useText } from "./i18n.js";
import { postRoute } from "./net.js";
import { React } from "./runtime.js";

/** Shared submit/cancel helpers given the block + drafts. Drafts hold picked
 * option indices rather than labels, so two options sharing a label stay
 * independently selectable; labels are resolved at submit time. */
export function useQuestionnaire(block, questions) {
	const t = useText();
	const blankDrafts = () => questions.map(() => ({ picked: [], custom: "", skipped: false }));
	const [drafts, setDrafts] = React.useState(blankDrafts);
	const [submitting, setSubmitting] = React.useState(false);
	const [submitted, setSubmitted] = React.useState(false);
	const [error, setError] = React.useState(null);
	const [closed, setClosed] = React.useState(false);
	React.useEffect(() => {
		setDrafts(blankDrafts());
		setSubmitting(false);
		setSubmitted(false);
		setError(null);
		setClosed(false);
	}, [block.callId]);
	const answeredCount = drafts.filter((d) => !d.skipped && (d.picked.length > 0 || d.custom.trim() !== "")).length;
	const choose = (index, optionIndex) => {
		if (submitting || submitted) return;
		setDrafts((current) => current.map((d, i) => {
			if (i !== index) return d;
			const q = questions[index];
			if (q.multi_select === true) {
				const picked = d.picked.includes(optionIndex)
					? d.picked.filter((item) => item !== optionIndex)
					: [...d.picked, optionIndex].sort((a, b) => a - b);
				return { ...d, picked, skipped: false };
			}
			return { ...d, picked: [optionIndex], skipped: false };
		}));
	};
	const setBool = (index, value) => {
		if (submitting || submitted) return;
		setDrafts((current) => current.map((d, i) => i === index ? { ...d, picked: [value], skipped: false } : d));
	};
	const setCompare = (index, side) => {
		if (submitting || submitted) return;
		setDrafts((current) => current.map((d, i) => i === index ? { ...d, picked: [side], skipped: false } : d));
	};
	const setCustom = (index, value) => {
		if (submitting || submitted) return;
		setDrafts((current) => current.map((d, i) => i === index ? { ...d, custom: value, skipped: false } : d));
	};
	const toggleSkip = (index) => {
		if (submitting || submitted) return;
		setDrafts((current) => current.map((d, i) => i === index ? { ...d, skipped: !d.skipped, picked: [], custom: "" } : d));
	};
	const submit = async () => {
		if (submitting || submitted) return;
		setSubmitting(true);
		setError(null);
		try {
			const answers = questions.map((q, i) => {
				const d = drafts[i] || { picked: [], custom: "", skipped: false };
				if (d.skipped) return { id: q.id, selected: [], skipped: true };
				const custom = (d.custom || "").trim();
				const selected = pickedToSelected(q, d.picked);
				return {
					id: q.id,
					selected: custom === "" || q.multi_select === true ? selected : [],
					...(custom === "" ? {} : { custom })
				};
			});
			const res = await postRoute("/api/dsh-survey/submit", { callId: block.callId, answers });
			if (res && res.ok === true) {
				setSubmitted(true);
			} else {
				setError((res && res.error) || t("error.submit"));
				setSubmitting(false);
			}
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : String(cause));
			setSubmitting(false);
		}
	};
	const cancel = async () => {
		if (closed || submitting || submitted) return;
		setClosed(true);
		setError(null);
		try {
			const res = await postRoute("/api/dsh-survey/cancel", { callId: block.callId });
			// The host owns the pending call; if it did not accept the cancel,
			// the survey is still live and the card must not claim otherwise.
			if (!res || res.ok !== true) {
				setClosed(false);
				setError((res && res.error) || t("error.close"));
			}
		} catch (cause) {
			setClosed(false);
			setError(cause instanceof Error ? cause.message : String(cause));
		}
	};
	return { drafts, setDrafts, submitting, submitted, error, closed, answeredCount, choose, setBool, setCompare, setCustom, toggleSkip, submit, cancel };
}

/** Fullscreen modes cover the page, so they carry a modal's expected exits:
 * Escape, a click on the backdrop, and Tab cycling inside the card. */
export function useOverlayDismiss(active, cardRef, onDismiss) {
	const dismiss = React.useRef(onDismiss);
	dismiss.current = onDismiss;
	React.useEffect(() => {
		if (!active) return undefined;
		const onKeyDown = (event) => {
			if (event.key !== "Escape") return;
			event.stopPropagation();
			dismiss.current();
		};
		document.addEventListener("keydown", onKeyDown, true);
		return () => document.removeEventListener("keydown", onKeyDown, true);
	}, [active]);
	React.useEffect(() => {
		if (!active) return;
		const node = cardRef.current;
		if (node !== null && node !== undefined && typeof node.focus === "function") {
			node.focus({ preventScroll: true });
		}
	}, [active]);
	const onCardKeyDown = (event) => {
		if (!active || event.key !== "Tab") return;
		const node = cardRef.current;
		if (node === null || node === undefined) return;
		const focusable = node.querySelectorAll(
			'button:not(:disabled), textarea:not(:disabled), input:not(:disabled), [tabindex]:not([tabindex="-1"])'
		);
		if (focusable.length === 0) return;
		const first = focusable[0];
		const last = focusable[focusable.length - 1];
		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first.focus();
		}
	};
	const onBackdropClick = (event) => {
		if (!active || event.target !== event.currentTarget) return;
		dismiss.current();
	};
	return { onCardKeyDown, onBackdropClick };
}
