/** The answer controls shared by the column-width modes. */
import { BOOL_CHOICES } from "./answers.js";
import { useText } from "./i18n.js";
import { Md, parseRecommendedLabel, stripLeadingIndex } from "./markdown.js";
import { IconCheckOutline14, IconEditOutline16, React } from "./runtime.js";

/** Leading indicator, matching the composer look: multi-select shows a
 * 14px checkbox; boolean uses a radio dot; single-select shows the option
 * number seat (1/2/3). */
export function Mark(props) {
	if (props.check) {
		return React.createElement("span", { className: "mq-mark mq-check", "aria-hidden": true },
			props.on ? React.createElement(IconCheckOutline14, { size: 12 }) : null
		);
	}
	if (props.radio) {
		return React.createElement("span", { className: "mq-mark mq-radio", "aria-hidden": true },
			props.on ? React.createElement("span", { className: "mq-radio-dot" }) : null
		);
	}
	if (props.index == null) return null;
	return React.createElement("span", { className: "mq-mark mq-num" }, String(props.index));
}

export function OptionRow(props) {
	const t = useText();
	const on = props.on === true;
	const display = parseRecommendedLabel(stripLeadingIndex(props.label));
	return React.createElement("button", {
		type: "button",
		className: "mq-opt",
		"data-on": on || undefined,
		disabled: props.disabled,
		onClick: props.onChoose
	},
		React.createElement(Mark, { on, check: props.multi, radio: props.radio === true, index: props.index == null ? null : props.index + 1 }),
		React.createElement("span", { className: "mq-opt-copy" },
			React.createElement("span", { className: "mq-opt-line" },
				React.createElement("span", { className: "mq-opt-label" }, React.createElement(Md, { text: display.label })),
				display.recommended && React.createElement("span", { className: "mq-badge" }, t("badge.recommended")),
				props.description !== undefined && React.createElement("span", { className: "mq-opt-desc" }, React.createElement(Md, { text: props.description }))
			)
		)
	);
}

/** One question's answer controls: options / boolean / compare / open input. */
export function QuestionBody(props) {
	const t = useText();
	const q = props.q;
	const d = props.d;
	const disabled = props.disabled;
	const options = Array.isArray(q.options) ? q.options : [];
	const isBool = q.kind === "boolean";
	const isCompare = q.kind === "compare";
	const isOpen = !isBool && !isCompare && options.length === 0;

	if (isBool) {
		return React.createElement("div", { className: "mq-options" },
			BOOL_CHOICES.map((choice) => React.createElement(OptionRow, {
				key: choice.value,
				radio: true,
				label: t(choice.key),
				on: d.picked[0] === choice.value,
				multi: false,
				disabled,
				onChoose: () => props.onBool(choice.value)
			}))
		);
	}
	if (isCompare) {
		return React.createElement("div", { className: "mq-compare" },
			["left", "right"].map((side) => {
				const item = (q.compare && q.compare[side]) || {};
				const on = d.picked[0] === side;
				return React.createElement("button", {
					type: "button", key: side,
					className: "mq-compare-block", "data-on": on || undefined,
					disabled,
					onClick: () => props.onCompare(side)
				},
					React.createElement("span", { className: "mq-compare-title" },
						React.createElement(Mark, { index: side === "left" ? 1 : 2 }),
						React.createElement(Md, { text: item.title ? item.title : t(side === "left" ? "compare.left" : "compare.right") })
					),
					item.text !== undefined && React.createElement("span", { className: "mq-compare-text" }, React.createElement(Md, { text: item.text }))
				);
			})
		);
	}
	if (isOpen) {
		return React.createElement("textarea", {
			className: "mq-custom-textarea", placeholder: t("placeholder.open"), rows: 2,
			value: d.custom,
			disabled,
			onChange: (event) => props.onCustom(event.target.value)
		});
	}
	return React.createElement(React.Fragment, null,
		React.createElement("div", { className: "mq-options" },
			options.map((opt, oi) => React.createElement(OptionRow, {
				key: String(oi),
				index: oi,
				label: opt.label,
				description: opt.description,
				on: d.picked.includes(oi),
				multi: q.multi_select === true,
				disabled,
				onChoose: () => props.onChoose(oi)
			})),
			React.createElement("div", { className: "mq-custom-row" + (d.custom.trim() !== "" ? " mq-on" : "") },
				React.createElement("span", { className: "mq-mark mq-num" }, React.createElement(IconEditOutline16, { size: 12 })),
				React.createElement("input", {
					type: "text", className: "mq-custom-input", placeholder: t("placeholder.custom"),
					value: d.custom,
					disabled,
					onChange: (event) => props.onCustom(event.target.value)
				})
			)
		)
	);
}
