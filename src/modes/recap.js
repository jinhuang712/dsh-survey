/** Settled view: the two-column recap rendered from the tool result. */
import { describeChoice } from "../answers.js";
import { useText } from "../i18n.js";
import { Md } from "../markdown.js";
import { React } from "../runtime.js";

export function RecapCard({ block }) {
	const t = useText();
	let questions = [];
	let answers = [];
	try {
		if (block.call && typeof block.call.argsRaw === "string") {
			const parsed = JSON.parse(block.call.argsRaw);
			if (Array.isArray(parsed.questions)) questions = parsed.questions;
		}
	} catch (error) {
		questions = [];
	}
	try {
		if (block.content && Array.isArray(block.content)) {
			const text = block.content.map((c) => (c && typeof c.text === "string" ? c.text : "")).join("");
			if (text) {
				const parsed = JSON.parse(text);
				if (Array.isArray(parsed.answers)) answers = parsed.answers;
			}
		}
	} catch (error) {
		answers = [];
	}
	const renderAnswer = (q, a) => {
		if (!a) return t("recap.unanswered");
		if (a.skipped) return t("tag.skipped");
		const custom = a.custom && String(a.custom).trim() !== "" ? String(a.custom).trim() : "";
		const chosen = Array.isArray(a.selected) ? a.selected.map((value) => describeChoice(q, value, t)) : [];
		// A multi-select answer is every pick, and a free-text note sits
		// beside the picks rather than replacing them.
		if (chosen.length > 0 && custom !== "") return chosen.join(t("recap.join")) + t("recap.note") + custom;
		if (chosen.length > 0) return chosen.join(t("recap.join"));
		if (custom !== "") return custom;
		return t("recap.unanswered");
	};
	return React.createElement("div", { className: "mq-frame" },
		React.createElement("div", { className: "mq-card" },
			React.createElement("div", { className: "mq-settled" },
				React.createElement("span", { className: "mq-settled-title" }, t("recap.title")),
				questions.length > 0
					? React.createElement("div", { className: "mq-recap" },
						questions.map((q, index) => {
							const a = answers.find((item) => item.id === q.id);
							return React.createElement("div", { className: "mq-recap-row", key: q.id || String(index) },
								React.createElement("span", { className: "mq-recap-q" }, React.createElement(Md, { text: String(index + 1) + "\\. " + String(q.question) })),
								React.createElement("span", { className: a && (a.custom || (a.selected || []).length > 0) ? "mq-recap-a" : "mq-recap-empty" }, React.createElement(Md, { text: renderAnswer(q, a) }))
							);
						})
					)
					: React.createElement("div", { className: "mq-recap-empty" }, t("recap.summary", { count: answers.length }))
			)
		)
	);
}
