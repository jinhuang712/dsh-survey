/** Translation between what the user picked and what the model receives. */
import { parseRecommendedLabel, stripLeadingIndex } from "./markdown.js";

/** Yes/no answers travel as language-neutral values; the row labels are
 * looked up so the card reads the way the rest of the UI does. */
export const BOOL_CHOICES = [{ value: "yes", key: "bool.yes" }, { value: "no", key: "bool.no" }];

/** Map one question's picked entries — option indices, or the boolean and
 * compare literals — onto the answer values the model receives. */
export function pickedToSelected(q, picked) {
	if (q.kind === "boolean" || q.kind === "compare") return picked.slice();
	const options = Array.isArray(q.options) ? q.options : [];
	const labels = [];
	for (const index of picked) {
		const opt = options[index];
		if (opt !== undefined && opt !== null) labels.push(String(opt.label));
	}
	return labels;
}

/** Turn one answer value back into what the user saw. Boolean and compare
 * answers travel as neutral literals, so they are looked up; an option answer
 * carries the label as authored, which still holds the "(recommended)" marker
 * and any leading numbering the card strips before display. The recap should
 * read the way the card read, so strip them here too — the payload the model
 * received keeps the label verbatim either way. */
export function describeChoice(q, value, t) {
	const text = String(value);
	if (q.kind === "boolean") {
		const choice = BOOL_CHOICES.find((item) => item.value === text);
		return choice === undefined ? text : t(choice.key);
	}
	if (q.kind === "compare" && q.compare) {
		const side = q.compare[text];
		if (side && side.title) return String(side.title);
		return text;
	}
	return parseRecommendedLabel(stripLeadingIndex(text)).label;
}
