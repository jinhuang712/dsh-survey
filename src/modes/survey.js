/** Multi-question card: inline (748px) or fullscreen overlay (wide). */
import { QuestionBody } from "../controls.js";
import { useText } from "../i18n.js";
import { Md } from "../markdown.js";
import { useOverlayDismiss, useQuestionnaire } from "../model.js";
import { Button, IconCloseOutline16, React } from "../runtime.js";

/** Multi-question card: inline (748px) or fullscreen overlay (wide). */
export function SurveyCard({ block, questions, mode }) {
	const t = useText();
	const isWide = mode === "overlay";
	const cardRef = React.useRef(null);
	const model = useQuestionnaire(block, questions);
	const overlay = useOverlayDismiss(isWide && !model.closed, cardRef, model.cancel);

	if (model.closed) {
		return React.createElement("div", { className: "mq-frame" },
			React.createElement("div", { className: "mq-card" },
				React.createElement("div", { className: "mq-settled" }, React.createElement("span", { className: "mq-settled-title" }, t("settled.closed")))
			)
		);
	}

	return React.createElement("div", {
		className: "mq-frame" + (isWide ? " mq-wide" : ""),
		onClick: isWide ? overlay.onBackdropClick : undefined
	},
		React.createElement("section", {
			className: "mq-card",
			ref: cardRef,
			tabIndex: isWide ? -1 : undefined,
			role: isWide ? "dialog" : undefined,
			"aria-modal": isWide ? true : undefined,
			onKeyDown: isWide ? overlay.onCardKeyDown : undefined
		},
			React.createElement("header", { className: "mq-header" },
				React.createElement("div", { className: "mq-heading" },
					React.createElement("div", { className: "mq-eyebrow" }, t("eyebrow.survey", { count: questions.length })),
					React.createElement("h2", { className: "mq-title" }, t("title.survey"))
				),
				React.createElement("button", {
					type: "button", className: "mq-close", title: t("action.close"), "aria-label": t("action.close"),
					disabled: model.submitting || model.submitted,
					onClick: model.cancel
				}, React.createElement(IconCloseOutline16, null))
			),
			React.createElement("div", { className: "mq-body" },
				questions.map((q, index) => {
					const d = model.drafts[index] || { picked: [], custom: "", skipped: false };
					const options = Array.isArray(q.options) ? q.options : [];
					const isBool = q.kind === "boolean";
					const isCompare = q.kind === "compare";
					const isOpen = !isBool && !isCompare && options.length === 0;
					const typeLabel = t(isBool ? "type.boolean" : isCompare ? "type.compare" : q.multi_select === true ? "type.multi" : isOpen ? "type.open" : "type.single");
					const bodyDisabled = model.submitting || model.submitted || d.skipped;
					return React.createElement("div", { className: "mq-question" + (d.skipped ? " mq-skipped" : ""), key: q.id || String(index) },
						React.createElement("div", { className: "mq-qtop" },
							React.createElement("div", { className: "mq-qtop-left" },
								React.createElement("div", { className: "mq-qheader" },
									React.createElement("span", { className: "mq-qindex" }, String(index + 1) + " ·"),
									q.header !== undefined && React.createElement(Md, { text: q.header })
								)
							),
							React.createElement("div", { className: "mq-qtop-right" },
								React.createElement("span", { className: "mq-type" }, typeLabel),
								d.skipped && React.createElement("span", { className: "mq-skipped-tag" }, t("tag.skipped")),
								React.createElement("button", {
									type: "button", className: "mq-skip",
									title: t(d.skipped ? "action.restore" : "action.skip"),
									"aria-label": t(d.skipped ? "action.restore" : "action.skip"),
									disabled: model.submitting || model.submitted,
									onClick: () => model.toggleSkip(index)
								}, d.skipped ? "↺" : "✕")
							)
						),
						React.createElement("div", { className: "mq-qtext" },
							React.createElement(Md, { text: String(q.question) })
						),
						React.createElement(QuestionBody, {
							q, d,
							disabled: bodyDisabled,
							onChoose: (label) => model.choose(index, label),
							onBool: (value) => model.setBool(index, value),
							onCompare: (side) => model.setCompare(index, side),
							onCustom: (value) => model.setCustom(index, value)
						})
					);
				})
			),
			React.createElement("footer", { className: "mq-footer" },
				React.createElement("div", { className: "mq-progress" },
					model.error
						? React.createElement("span", { className: "mq-error" }, String(model.error))
						: React.createElement("span", null, t("progress.prefix"), React.createElement("b", null, String(model.answeredCount)), t("progress.suffix", { count: questions.length }))
				),
				React.createElement(Button, {
					variant: "primary",
					disabled: model.submitting || model.submitted || questions.length === 0,
					onClick: model.submit
				}, t(model.submitted ? "submit.done" : model.submitting ? "submit.pending" : "submit.all"))
			)
		)
	);
}
