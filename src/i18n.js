/** Language for everything the user reads. */
import { React } from "./runtime.js";

/** Everything the user reads. Answer values stay language-neutral
 * ("yes"/"no", "left"/"right", option labels as authored), so switching
 * language changes the card and never the payload the model receives.
 * A "<key>.one" entry, when present, wins for a count of 1. */
const TEXT = {
	zh: {
		"eyebrow.survey": "问卷 · 共 {count} 题",
		"eyebrow.grid": "问卷矩阵 · 共 {count} 题",
		"title.survey": "请回答以下问题，填完统一提交",
		"title.grid": "逐项快速作答，填完统一提交",
		"type.single": "单选",
		"type.multi": "多选",
		"type.boolean": "是否",
		"type.compare": "对比",
		"type.open": "开放",
		"bool.yes": "是的",
		"bool.no": "不是",
		"compare.left": "方案 A",
		"compare.right": "方案 B",
		"badge.recommended": "推荐",
		"tag.skipped": "已跳过",
		"action.skip": "跳过此题",
		"action.restore": "恢复此题",
		"action.close": "关闭问卷",
		"progress.prefix": "已答 ",
		"progress.suffix": " / {count} 题",
		"submit.all": "提交全部回答",
		"submit.one": "提交回答",
		"submit.pending": "提交中…",
		"submit.done": "已提交 ✓",
		"placeholder.open": "请输入回答",
		"placeholder.custom": "自定义回答（可选）",
		"placeholder.gridOpen": "请输入",
		"placeholder.gridCustom": "补充（可选）",
		"recap.title": "✅ 问卷已回答",
		"recap.summary": "共 {count} 题已回答，结果已返回给模型",
		"recap.unanswered": "未回答",
		"recap.join": "、",
		"recap.note": "；",
		"settled.closed": "问卷已关闭",
		"settled.closedShort": "已关闭",
		"error.submit": "提交失败",
		"error.close": "关闭失败"
	},
	en: {
		"eyebrow.survey": "Survey · {count} questions",
		"eyebrow.survey.one": "Survey · 1 question",
		"eyebrow.grid": "Survey matrix · {count} questions",
		"eyebrow.grid.one": "Survey matrix · 1 question",
		"title.survey": "Answer these, then submit together",
		"title.grid": "Answer each, then submit together",
		"type.single": "Single",
		"type.multi": "Multi",
		"type.boolean": "Yes/No",
		"type.compare": "Compare",
		"type.open": "Open",
		"bool.yes": "Yes",
		"bool.no": "No",
		"compare.left": "Option A",
		"compare.right": "Option B",
		"badge.recommended": "Recommended",
		"tag.skipped": "Skipped",
		"action.skip": "Skip this question",
		"action.restore": "Restore this question",
		"action.close": "Close survey",
		"progress.prefix": "Answered ",
		"progress.suffix": " / {count}",
		"submit.all": "Submit all answers",
		"submit.one": "Submit answer",
		"submit.pending": "Submitting…",
		"submit.done": "Submitted ✓",
		"placeholder.open": "Type your answer",
		"placeholder.custom": "Custom answer (optional)",
		"placeholder.gridOpen": "Type an answer",
		"placeholder.gridCustom": "Add a note (optional)",
		"recap.title": "✅ Survey answered",
		"recap.summary": "{count} questions answered; the results went back to the model",
		"recap.summary.one": "1 question answered; the result went back to the model",
		"recap.unanswered": "Not answered",
		"recap.join": ", ",
		"recap.note": "; ",
		"settled.closed": "Survey closed",
		"settled.closedShort": "Closed",
		"error.submit": "Submit failed",
		"error.close": "Close failed"
	}
};

/** The Web UI's own language service, captured in apply(). Compositions
 * without it fall back to the browser's language. */
let localeFace = null;
const NO_LOCALE = { subscribe: () => () => {}, getSnapshot: () => null };

/** Adopt the host's language service. Called once from apply(); absent
 * compositions keep the browser-derived fallback. */
export function setLocaleFace(face) {
	localeFace = face;
}

// React is bound by the loader, so the hook is chosen at call time rather than
// at module scope. The locale reads the same without a client, so the server
// snapshot is the live one — omitting it makes useSyncExternalStore throw when
// rendered outside the browser.
function readStore(face) {
	const useStore = typeof React.useSyncExternalStore === "function"
		? React.useSyncExternalStore
		: (subscribe, getSnapshot) => getSnapshot();
	return useStore(face.subscribe, face.getSnapshot, face.getSnapshot);
}

function browserLocale() {
	const tag = typeof navigator === "object" && navigator !== null ? String(navigator.language || "") : "";
	return tag.toLowerCase().startsWith("zh") ? "zh" : "en";
}

function translator(locale) {
	const dict = TEXT[locale] || TEXT.en;
	return (key, vars) => {
		const plural = vars !== undefined && vars.count === 1 ? dict[key + ".one"] : undefined;
		const base = plural !== undefined ? plural : dict[key];
		const template = base !== undefined ? base : (TEXT.en[key] !== undefined ? TEXT.en[key] : key);
		if (vars === undefined) return template;
		return template.replace(/\{(\w+)\}/g, (whole, token) =>
			vars[token] === undefined ? whole : String(vars[token]));
	};
}

/** Read the active language, re-rendering when the user switches it. */
export function useText() {
	const face = localeFace === null ? NO_LOCALE : localeFace;
	const snapshot = readStore(face);
	const active = snapshot === null || snapshot === undefined ? null : snapshot.active;
	const locale = active === "zh" || active === "en" ? active : browserLocale();
	return React.useMemo(() => translator(locale), [locale]);
}
