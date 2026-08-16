/** Compact single-question card. */
import { QuestionBody } from "../controls.js";
import { useText } from "../i18n.js";
import { Md } from "../markdown.js";
import { useQuestionnaire } from "../model.js";
import { Button, React } from "../runtime.js";

/** Compact single-question card: like a rich ask_user_question. Reached only
 * with exactly one question — SurveyRoot routes anything longer to inline. */
export function CompactCard({ block, questions }) {
	const t = useText();
	const q = questions[0] || { id: "q", question: "" };
	const model = useQuestionnaire(block, questions);
	const d = model.drafts[0] || { picked: [], custom: "", skipped: false };

	if (model.closed) {
		return React.createElement("div", { className: "mq-frame" },
			React.createElement("div", { className: "mq-card" },
				React.createElement("div", { className: "mq-settled" }, React.createElement("span", { className: "mq-settled-title" }, t("settled.closedShort")))
			)
		);
	}

	const typeLabel = t(q.kind === "boolean" ? "type.boolean" : q.kind === "compare" ? "type.compare" : q.multi_select === true ? "type.multi" : (Array.isArray(q.options) ? q.options.length : 0) === 0 ? "type.open" : "type.single");
	return React.createElement("div", { className: "mq-frame" },
		React.createElement("section", { className: "mq-card mq-compact" },
			React.createElement("div", { className: "mq-qtop" },
				React.createElement("div", { className: "mq-qtop-left" }),
				React.createElement("div", { className: "mq-qtop-right" },
					React.createElement("span", { className: "mq-type" }, typeLabel)
				)
			),
			React.createElement("div", { className: "mq-qtext" },
				React.createElement(Md, { text: String(q.question) })
			),
			React.createElement(QuestionBody, {
				q, d,
				disabled: model.submitting || model.submitted,
				onChoose: (label) => model.choose(0, label),
				onBool: (value) => model.setBool(0, value),
				onCompare: (side) => model.setCompare(0, side),
				onCustom: (value) => model.setCustom(0, value)
			}),
			React.createElement("footer", { className: "mq-footer" },
				model.error
					? React.createElement("div", { className: "mq-progress" }, React.createElement("span", { className: "mq-error" }, String(model.error)))
					: null,
				React.createElement(Button, {
					variant: "primary",
					disabled: model.submitting || model.submitted,
					onClick: model.submit
				}, t(model.submitted ? "submit.done" : model.submitting ? "submit.pending" : "submit.one"))
			)
		)
	);
}
