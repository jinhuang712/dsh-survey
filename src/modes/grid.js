/** Grid matrix: fullscreen overlay, one card per question. */
import { BOOL_CHOICES } from "../answers.js";
import { Mark } from "../controls.js";
import { useText } from "../i18n.js";
import { Md, parseRecommendedLabel, stripLeadingIndex, toInlineMarkdown } from "../markdown.js";
import { useOverlayDismiss, useQuestionnaire } from "../model.js";
import { Button, IconCloseOutline16, React } from "../runtime.js";

/** Compact question body for grid cells: bool toggle / options / open. */
function GridQuestionBody(props) {
	const t = useText();
	const q = props.q;
	const d = props.d;
	const disabled = props.disabled;
	const options = Array.isArray(q.options) ? q.options : [];
	const isBool = q.kind === "boolean";
	const isCompare = q.kind === "compare";
	const isOpen = !isBool && !isCompare && options.length === 0;

	if (isBool) {
		return React.createElement("div", { className: "mq-grid-bool" },
			React.createElement("span", { className: "mq-grid-bool-switch", role: "radiogroup", "aria-label": String(q.question) },
				BOOL_CHOICES.map((choice) => React.createElement("button", {
					type: "button", role: "radio", key: choice.value,
					"aria-checked": d.picked[0] === choice.value || undefined,
					className: "mq-grid-bool-side", "data-on": d.picked[0] === choice.value || undefined,
					disabled,
					onClick: () => props.onBool(choice.value)
				}, t(choice.key)))
			)
		);
	}
	if (isCompare) {
		return React.createElement("div", { className: "mq-grid-options" },
			["left", "right"].map((side) => {
				const item = (q.compare && q.compare[side]) || {};
				const on = d.picked[0] === side;
				return React.createElement("button", {
					type: "button", key: side,
					className: "mq-grid-opt", "data-on": on || undefined,
					disabled,
					onClick: () => props.onCompare(side)
				},
					React.createElement(Mark, { index: side === "left" ? 1 : 2 }),
					React.createElement("span", { className: "mq-grid-opt-label" }, React.createElement(Md, { text: toInlineMarkdown(item.title ? item.title : t(side === "left" ? "compare.left" : "compare.right")) }))
				);
			})
		);
	}
	return React.createElement(React.Fragment, null,
		!isOpen && React.createElement("div", { className: "mq-grid-options" },
			options.map((opt, oi) => {
				const on = d.picked.includes(oi);
				const display = parseRecommendedLabel(stripLeadingIndex(opt.label));
				return React.createElement("button", {
					type: "button", key: String(oi),
					className: "mq-grid-opt", "data-on": on || undefined,
					disabled,
					onClick: () => props.onChoose(oi)
				},
					React.createElement(Mark, { on, check: q.multi_select === true, index: oi + 1 }),
					React.createElement("span", { className: "mq-grid-opt-label" },
						React.createElement(Md, { text: toInlineMarkdown(display.label) }),
						display.recommended && React.createElement("span", { className: "mq-badge" }, t("badge.recommended"))
					)
				);
			})
		),
		React.createElement(isOpen ? "textarea" : "input", {
			className: isOpen ? "mq-grid-custom mq-open" : "mq-grid-custom",
			placeholder: t(isOpen ? "placeholder.gridOpen" : "placeholder.gridCustom"),
			rows: isOpen ? 2 : undefined,
			value: d.custom,
			disabled,
			onChange: (event) => props.onCustom(event.target.value)
		})
	);
}

/** Grid matrix mode: fullscreen overlay, many simple questions, one card each. */
export function GridCard({ block, questions }) {
	const t = useText();
	const cardRef = React.useRef(null);
	const model = useQuestionnaire(block, questions);
	const overlay = useOverlayDismiss(!model.closed, cardRef, model.cancel);

	if (model.closed) {
		return React.createElement("div", { className: "mq-frame" },
			React.createElement("div", { className: "mq-card" },
				React.createElement("div", { className: "mq-settled" }, React.createElement("span", { className: "mq-settled-title" }, t("settled.closed")))
			)
		);
	}

	return React.createElement("div", {
		className: "mq-frame mq-wide",
		onClick: overlay.onBackdropClick
	},
		React.createElement("section", {
			className: "mq-card",
			ref: cardRef,
			tabIndex: -1,
			role: "dialog",
			"aria-modal": true,
			onKeyDown: overlay.onCardKeyDown
		},
			React.createElement("header", { className: "mq-header" },
				React.createElement("div", { className: "mq-heading" },
					React.createElement("div", { className: "mq-eyebrow" }, t("eyebrow.grid", { count: questions.length })),
					React.createElement("h2", { className: "mq-title" }, t("title.grid"))
				),
				React.createElement("button", {
					type: "button", className: "mq-close", title: t("action.close"), "aria-label": t("action.close"),
					disabled: model.submitting || model.submitted,
					onClick: model.cancel
				}, React.createElement(IconCloseOutline16, null))
			),
			React.createElement("div", { className: "mq-grid-body" },
				questions.map((q, index) => {
					const d = model.drafts[index] || { picked: [], custom: "", skipped: false };
					const bodyDisabled = model.submitting || model.submitted || d.skipped;
					return React.createElement("div", { className: "mq-grid-item" + (d.skipped ? " mq-skipped" : ""), key: q.id || String(index) },
						React.createElement("div", { className: "mq-grid-qtext" },
							React.createElement("span", { className: "mq-grid-qindex" }, String(index + 1) + "."),
							React.createElement(Md, { text: toInlineMarkdown(q.question) }),
							React.createElement("button", {
								type: "button", className: "mq-grid-skip",
								title: t(d.skipped ? "action.restore" : "action.skip"),
								"aria-label": t(d.skipped ? "action.restore" : "action.skip"),
								disabled: model.submitting || model.submitted,
								onClick: () => model.toggleSkip(index)
							}, d.skipped ? "↺" : "✕")
						),
						React.createElement(GridQuestionBody, {
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
			React.createElement("footer", { className: "mq-grid-footer" },
				React.createElement("div", { className: "mq-grid-progress" },
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
