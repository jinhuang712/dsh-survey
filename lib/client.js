window.__ModuleLoader__.load({
	id: "dsh-survey",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let React = require("react");
		let _primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let MarkdownText = _primitives.MarkdownText;
		let Button = _primitives.Button;
		let IconCloseOutline16 = _primitives.IconCloseOutline16;
		let IconCheckOutline14 = _primitives.IconCheckOutline14;
		let IconEditOutline16 = _primitives.IconEditOutline16;

		const CSS = '.mq-frame{display:flex;justify-content:center;padding:6px calc(var(--dsh-composer-side-clearance, 0px) + 16px) 10px}.mq-frame.mq-wide{position:fixed;inset:0;z-index:60;background:color-mix(in srgb, var(--dsw-alias-bg-base) 55%, transparent);backdrop-filter:blur(2px);padding:5vh 24px;align-items:center;overflow-y:auto}.mq-card{display:flex;flex-direction:column;width:100%;max-width:var(--dsh-chat-content-width, 748px);max-height:min(60vh, 520px);padding:0 0 10px;border:1px solid var(--dsw-alias-border-l2-darkmode-thin, var(--dsw-alias-border-l1));border-radius:20px;background:var(--dsw-specific-input-major, var(--dsw-alias-bg-layer-1));box-shadow:var(--dsw-shadow-lv2, none);color:var(--dsw-alias-label-primary);overflow:hidden;--dsh-scrollbar-thumb:var(--dsw-alias-scrollbar-bg-l2);--dsh-scrollbar-thumb-hover:var(--dsw-alias-scrollbar-hover-l2)}.mq-card,.mq-card *{box-sizing:border-box}.mq-frame.mq-wide .mq-card{max-width:1180px;max-height:min(82vh, 720px)}.mq-header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-shrink:0;padding:20px 16px 0 24px}.mq-heading{min-width:0}.mq-eyebrow{margin-bottom:5px;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px;letter-spacing:.04em;text-transform:uppercase}.mq-title{margin:0;font-size:16px;line-height:22px;font-weight:500}.mq-body{display:flex;flex:1 1 auto;flex-direction:column;min-height:0;overflow-y:auto;overscroll-behavior:contain}.mq-question{display:flex;flex-direction:column;padding:12px 24px 0}.mq-question.mq-skipped{opacity:.5}.mq-qtop{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:6px}.mq-qtop-left{min-width:0;flex:1}.mq-qtop-right{flex:none;display:flex;align-items:center;gap:6px}.mq-qheader{display:flex;align-items:center;gap:8px;color:var(--dsw-alias-label-secondary);font-size:13px;font-weight:700;line-height:18px;letter-spacing:.02em}.mq-qheader::after{content:"";flex:1;height:1px;background:var(--dsw-alias-border-l1)}.mq-qtext{display:flex;flex-wrap:wrap;align-items:baseline;gap:2px 6px;margin-bottom:8px;font-size:14px;line-height:24px;font-weight:500;letter-spacing:-.005em}.mq-qtext .mq-md{flex:0 1 auto;min-width:0}.mq-qtext > div{min-width:0}.mq-type{flex:none;padding:0 4px;border-radius:6px;background:var(--dsw-specific-sidebar-nav-item-active-accent, var(--dsw-alias-bg-layer-2));color:var(--dsw-alias-button-info-fill, var(--dsw-alias-label-secondary));font-size:11px;line-height:18px;font-weight:600;letter-spacing:.02em}.mq-skip,.mq-close{display:grid;place-items:center;width:24px;height:24px;padding:0;border:none;border-radius:999px;background:transparent;color:var(--dsw-alias-label-tertiary);cursor:pointer;font-size:14px;line-height:1}.mq-skip:hover:not(:disabled),.mq-close:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.mq-skip:disabled,.mq-close:disabled{color:var(--dsw-alias-label-dimmed);cursor:default}.mq-skip:focus-visible,.mq-close:focus-visible{outline:2px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 60%, transparent);outline-offset:2px}.mq-skipped-tag{display:inline-block;padding:0 4px;border-radius:6px;background:var(--dsw-specific-sidebar-nav-item-active-accent, var(--dsw-alias-bg-layer-2));color:var(--dsw-alias-button-info-fill, var(--dsw-alias-label-secondary));font-size:11px;font-weight:600;line-height:18px;letter-spacing:.02em}.mq-options{display:flex;flex-direction:column;gap:1px;margin:4px 0 0;padding:0}.mq-bool{display:flex;gap:8px;margin:4px 0 0}.mq-bool .mq-opt{flex:1;justify-content:center;padding-left:8px}.mq-bool .mq-opt-copy{text-align:center}.mq-bool .mq-opt-line{justify-content:center}.mq-opt{display:flex;align-items:flex-start;gap:8px;width:100%;min-height:40px;flex-shrink:0;padding:8px 12px 8px 8px;border:1px solid transparent;border-radius:12px;background:transparent;color:inherit;text-align:left;cursor:pointer;transition:background-color 120ms ease, border-color 120ms ease;font-family:inherit}.mq-opt:hover:not(:disabled),.mq-opt[data-on]{background:var(--dsw-alias-interactive-bg-hover)}.mq-opt[data-on]{border-color:var(--dsw-alias-border-l2)}.mq-opt:active:not(:disabled){transform:scale(.995)}.mq-opt:focus-visible{outline:2px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 70%, transparent);outline-offset:2px}.mq-opt:disabled{cursor:default}.mq-mark{display:grid;place-items:center;flex:0 0 20px;width:20px;height:20px;margin-top:2px;border-radius:6px;background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-secondary);font-size:12px;font-weight:500;line-height:18px}.mq-mark.mq-check{background:transparent}.mq-mark.mq-check::before{content:"";grid-area:1/1;width:14px;height:14px;border:1px solid var(--dsw-alias-border-l4);border-radius:4px;transition:background-color 120ms ease, border-color 120ms ease}.mq-mark.mq-check > svg{grid-area:1/1}.mq-opt[data-on] .mq-mark.mq-check{color:var(--dsw-alias-label-primary-foreground)}.mq-opt[data-on] .mq-mark.mq-check::before{border-color:var(--dsw-alias-label-primary);background:var(--dsw-alias-label-primary)}.mq-opt-copy{min-width:0;flex:1}.mq-opt-line{display:flex;align-items:baseline;flex-wrap:wrap;gap:2px 6px}.mq-opt-label{font-size:14px;line-height:24px;font-weight:500}.mq-badge{flex:none;padding:0 4px;border-radius:6px;background:var(--dsw-specific-sidebar-nav-item-active-accent, var(--dsw-alias-bg-layer-2));color:var(--dsw-alias-button-info-fill, var(--dsw-alias-label-secondary));font-size:11px;line-height:18px;font-weight:600}.mq-opt-desc{color:var(--dsw-alias-label-tertiary);font-size:14px;line-height:24px;font-weight:400}.mq-custom-row{display:flex;align-items:flex-start;gap:8px;width:100%;min-height:40px;flex-shrink:0;padding:8px 12px 8px 8px;border:1px solid transparent;border-radius:12px;transition:background-color 120ms ease, border-color 120ms ease}.mq-custom-row:hover,.mq-custom-row:focus-within,.mq-custom-row.mq-on{background:var(--dsw-alias-interactive-bg-hover)}.mq-custom-row:focus-within,.mq-custom-row.mq-on{border-color:var(--dsw-alias-border-l2)}.mq-custom-input{flex:1;min-width:0;padding:0;border:none;outline:none;background:transparent;color:var(--dsw-alias-label-primary);caret-color:var(--dsw-alias-state-business-primary);font:inherit;font-size:14px;line-height:24px}.mq-custom-input::placeholder{color:var(--dsw-alias-label-caption)}.mq-custom-textarea{display:block;width:100%;min-height:64px;max-height:140px;flex-shrink:0;margin:8px 0 0;padding:8px 12px;resize:none;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;outline:none;background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-primary);caret-color:var(--dsw-alias-state-business-primary);font:inherit;font-size:14px;line-height:24px}.mq-custom-textarea:focus{border-color:var(--dsw-alias-state-business-primary)}.mq-custom-textarea::placeholder{color:var(--dsw-alias-label-caption)}.mq-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-shrink:0;margin-top:8px;padding:0 10px 0 18px}.mq-progress{color:var(--dsw-alias-label-secondary);font-size:14px;line-height:24px;font-weight:500;white-space:nowrap}.mq-progress b{color:var(--dsw-alias-label-primary);font-weight:500}.mq-error{flex:1;min-height:16px;color:var(--dsw-alias-state-error-primary);font-size:11px;line-height:16px;text-align:right}.mq-md{font-size:13px;line-height:20px;font-weight:400}.mq-md > *:first-child{margin-top:0}.mq-md > *:last-child{margin-bottom:0}.mq-md p{margin:4px 0}.mq-md pre{background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);border-radius:8px;padding:8px 10px;overflow-x:auto;margin:6px 0;font-size:12px;line-height:18px}.mq-md code{background:var(--dsw-alias-bg-layer-2);border-radius:4px;padding:1px 5px;font-size:12px;font-family:var(--ds-font-family-code, monospace)}.mq-md blockquote{border-left:3px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);margin:6px 0;padding:2px 0 2px 12px}.mq-compare{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:4px 0 0}.mq-compare-block{display:flex;flex-direction:column;gap:8px;text-align:left;min-width:0;min-height:40px;flex-shrink:0;padding:8px 12px;border:1px solid transparent;border-radius:12px;background:transparent;color:inherit;cursor:pointer;transition:background-color 120ms ease, border-color 120ms ease;font-family:inherit}.mq-compare-block:hover,.mq-compare-block[data-on]{background:var(--dsw-alias-interactive-bg-hover)}.mq-compare-block[data-on]{border-color:var(--dsw-alias-border-l2)}.mq-compare-block:focus-visible{outline:2px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 70%, transparent);outline-offset:2px}.mq-compare-title{display:flex;align-items:center;gap:8px;font-weight:500;font-size:14px;line-height:24px}.mq-compare-title .mq-mark{width:18px;height:18px;font-size:11px;margin-top:0}.mq-compare-text{color:var(--dsw-alias-label-tertiary);font-size:13.5px;line-height:22px}.mq-settled{display:flex;flex-direction:column;gap:10px;padding:16px 24px 10px;font-size:13px;line-height:20px}.mq-settled-title{color:var(--dsw-alias-state-success-primary);font-weight:600}.mq-recap{display:flex;flex-direction:column;gap:6px;max-height:200px;overflow-y:auto;padding-right:4px}.mq-recap-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:baseline;padding:4px 0;border-bottom:1px solid var(--dsw-alias-border-l1)}.mq-recap-row:last-child{border-bottom:none}.mq-recap-q{color:var(--dsw-alias-label-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:400}.mq-recap-a{color:var(--dsw-alias-label-primary);font-weight:600;min-width:0;word-break:break-word}.mq-recap-empty{color:var(--dsw-alias-label-tertiary, var(--dsw-alias-label-secondary));font-weight:400}.mq-compact{padding:12px 24px 0}.mq-compact .mq-qtext{margin-bottom:8px}.mq-compact .mq-footer{justify-content:flex-end;padding:0 10px}.mq-grid-body{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));grid-auto-rows:1fr;gap:10px;padding:12px 24px 4px;max-height:min(70vh, 640px);overflow-y:auto}.mq-grid-item{border:1px solid var(--dsw-alias-border-l1);border-radius:12px;padding:10px 12px;background:var(--dsw-alias-bg-layer-1);display:flex;flex-direction:column;gap:8px;min-width:0;transition:border-color 120ms ease, opacity 120ms ease}.mq-grid-item:hover{border-color:var(--dsw-alias-border-l2)}.mq-grid-item.mq-skipped{opacity:.45}.mq-grid-qtext{font-size:13px;line-height:19px;font-weight:500;display:flex;justify-content:flex-start;align-items:flex-start;gap:8px}.mq-grid-qtext .mq-md{font-size:13px;line-height:19px;flex:1;min-width:0}.mq-grid-qtext > div{flex:1;min-width:0}.mq-grid-skip{display:grid;place-items:center;flex:none;width:22px;height:22px;padding:0;border:none;border-radius:999px;background:transparent;color:var(--dsw-alias-label-tertiary);cursor:pointer;font-size:12px;line-height:1;margin-left:auto}.mq-grid-skip:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.mq-grid-item .mq-grid-bool,.mq-grid-item .mq-grid-options,.mq-grid-item .mq-grid-custom{margin-top:auto}.mq-grid-options{display:flex;flex-direction:column;gap:2px}.mq-grid-opt{display:flex;align-items:center;gap:8px;text-align:left;width:100%;min-height:32px;background:transparent;border:1px solid transparent;border-radius:8px;color:inherit;cursor:pointer;padding:5px 8px;font-size:12px;line-height:16px;transition:background-color 120ms ease, border-color 120ms ease;font-family:inherit}.mq-grid-opt:hover,.mq-grid-opt[data-on]{background:var(--dsw-alias-interactive-bg-hover)}.mq-grid-opt[data-on]{border-color:var(--dsw-alias-border-l2)}.mq-grid-opt:focus-visible{outline:2px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 70%, transparent);outline-offset:2px}.mq-grid-opt .mq-mark{width:16px;height:16px;font-size:10px;margin-top:0}.mq-grid-opt .mq-mark.mq-check::before{width:12px;height:12px}.mq-grid-opt-label{display:flex;align-items:baseline;flex-wrap:wrap;gap:2px 6px;font-weight:500}.mq-grid-custom{width:100%;box-sizing:border-box;background:var(--dsw-alias-bg-module-platform);border:1px solid var(--dsw-alias-border-l2);border-radius:8px;color:var(--dsw-alias-label-primary);padding:6px 10px;font-size:12px;line-height:16px;outline:none;transition:border-color 120ms ease;font-family:inherit}.mq-grid-custom::placeholder{color:var(--dsw-alias-label-caption);opacity:.75}.mq-grid-custom:focus{border-color:var(--dsw-alias-state-business-primary)}.mq-grid-custom.mq-open{min-height:44px;resize:vertical}.mq-grid-bool{display:flex;align-items:center;gap:6px}.mq-grid-bool-switch{display:inline-flex;align-items:center;gap:0;border:1px solid var(--dsw-alias-border-l2);border-radius:999px;background:transparent;padding:2px;cursor:pointer;transition:border-color 120ms ease}.mq-grid-bool-switch:hover{border-color:var(--dsw-alias-border-l2)}.mq-grid-bool-switch:focus-visible{outline:2px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 60%, transparent);outline-offset:2px}.mq-grid-bool-side{border:none;background:none;color:var(--dsw-alias-label-secondary);font-size:11px;font-weight:600;line-height:1;padding:4px 10px;border-radius:999px;cursor:pointer;transition:background 120ms ease, color 120ms ease;font-family:inherit;min-width:32px}.mq-grid-bool-side[data-on]{background:var(--dsw-alias-label-primary);color:var(--dsw-alias-label-primary-foreground)}.mq-grid-footer{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-shrink:0;margin-top:8px;padding:0 10px 0 18px}.mq-grid-progress{color:var(--dsw-alias-label-secondary);font-size:14px;line-height:24px;font-weight:500}.mq-grid-progress b{color:var(--dsw-alias-label-primary);font-weight:500}@media (max-width: 720px){.mq-card{border-radius:16px}.mq-header{padding:10px 12px 0 18px}.mq-question{padding:10px 18px 0}.mq-footer{align-items:flex-end;padding:0 10px}.mq-opt,.mq-custom-row{padding:8px 6px}}';

		const STYLE_ID = "dsh-survey-css";
		function injectCss() {
			if (typeof document === "undefined") return;
			if (document.querySelector("style[data-plugin-css=" + JSON.stringify(STYLE_ID) + "]") !== null) return;
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-survey";
			tag.dataset.pluginCss = STYLE_ID;
			tag.textContent = CSS;
			document.head.appendChild(tag);
		}

		const name = "dsh-survey";
		const inject = ["slots"];

		async function postRoute(path, body) {
			const res = await fetch(path, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify(body)
			});
			let data = {};
			try {
				data = await res.json();
			} catch (error) {
				data = {};
			}
			return data;
		}

		/** Color marker: {color:red}text{/color} renders a colored span. */
		const COLOR_RE = /\{color:([a-zA-Z]+|[#][0-9a-fA-F]{3,8}|rgb\([^)]*\))\}([\s\S]*?)\{\/color\}/g;

		/** Zero-width space: inserted between exactly-two `**` runs and adjacent
		 * punctuation so CommonMark flanking rules still open/close emphasis in
		 * CJK text such as **"家庭信任第一次松动"** — without it micromark treats the
		 * delimiter as non-flanking and renders the asterisks literally. */
		const ZWSP = "\u200B";
		const PUNCT = new Set(Array.from("!\"#$%&'()+,./:;<=>?@[\\]^_`{|}~“”‘’「」『』〈〉《》（）—…·、。，！？：；"));

		/** Pad exactly-two `**` runs that touch punctuation with a zero-width space. */
		function padEmphasisPunct(text) {
			const out = [];
			let last = 0;
			const re = /\*{2,}/g;
			let match;
			while ((match = re.exec(text)) !== null) {
				if (match[0].length !== 2) continue;
				const before = text[match.index - 1];
				const after = text[match.index + 2];
				let seg = match[0];
				if (after !== undefined && PUNCT.has(after)) seg += ZWSP;
				if (before !== undefined && PUNCT.has(before)) seg = ZWSP + seg;
				out.push(text.slice(last, match.index), seg);
				last = match.index + 2;
			}
			out.push(text.slice(last));
			return out.join("");
		}

		/** Render a Markdown string with {color:...} spans through the official safe renderer. */
		function Md(props) {
			if (props.text === undefined || props.text === null) return null;
			const text = padEmphasisPunct(String(props.text));
			const parts = [];
			let last = 0;
			let match;
			let key = 0;
			while ((match = COLOR_RE.exec(text)) !== null) {
				if (match.index > last) parts.push(text.slice(last, match.index));
				parts.push(React.createElement("span", {
					key: String(key++),
					style: { color: match[1] }
				}, React.createElement(MarkdownText, { text: match[2] })));
				last = match.index + match[0].length;
			}
			if (last < text.length) parts.push(text.slice(last));
			if (parts.length === 0) return null;
			if (parts.length === 1 && typeof parts[0] === "string") {
				return React.createElement(MarkdownText, { text: parts[0] });
			}
			return React.createElement("span", { className: "mq-md" }, ...parts.map((p, i) =>
				typeof p === "string" ? React.createElement(MarkdownText, { key: String(key + i), text: p }) : p
			));
		}

		/** Split a trailing (推荐)/(recommended) suffix off an option label, mirroring
		 * the host ask_user_question badge; tolerant of markdown `**` around it. */
		const REC_SUFFIX = /(?:\((?:recommended|推荐)\)|（(?:recommended|推荐)）)/i;
		function parseRecommendedLabel(label) {
			const m = REC_SUFFIX.exec(label);
			if (m === null) return { label, recommended: false };
			return {
				label: (label.slice(0, m.index) + label.slice(m.index + m[0].length)).replace(/\s+$/, ""),
				recommended: true
			};
		}

		/** Strip a leading A/B/①/1. numbering prefix off an option label: the number
		 * seat provides the index, so an author-supplied prefix would duplicate it.
		 * Markdown `**` around the prefix is preserved so bold stays balanced. */
		function stripLeadingIndex(label) {
			let rest = label;
			let prefix = "";
			if (rest.startsWith("**")) {
				prefix = "**";
				rest = rest.slice(2);
			}
			let m = null;
			if (/^[①-⑳❶-❿]/.test(rest)) {
				m = /^[①-⑳❶-❿]\s*/.exec(rest);
			} else if (/^[0-9]{1,3}/.test(rest)) {
				m = /^[0-9]{1,3}\s*(?:[.、．:：·)）])\s*/.exec(rest);
			} else if (/^[一二三四五六七八九十百]+/.test(rest)) {
				m = /^[一二三四五六七八九十百]+\s*(?:[.、．:：·)）])\s*/.exec(rest);
			} else if (/^[A-Za-z]/.test(rest)) {
				m = /^[A-Za-z]\s*(?:[.、．:：·)）])\s*/.exec(rest);
			}
			if (m === null) return label;
			return prefix + rest.slice(m[0].length);
		}

		/** Leading indicator, matching the composer look: multi-select shows a
		 * 14px checkbox; single-select shows the option number seat (1/2/3). */
		function Mark(props) {
			if (props.check) {
				return React.createElement("span", { className: "mq-mark mq-check", "aria-hidden": true },
					props.on ? React.createElement(IconCheckOutline14, { size: 12 }) : null
				);
			}
			return React.createElement("span", { className: "mq-mark mq-num" }, String(props.index));
		}

		function OptionRow(props) {
			const on = props.selected.includes(props.label);
			const display = parseRecommendedLabel(stripLeadingIndex(props.label));
			return React.createElement("button", {
				type: "button",
				className: "mq-opt",
				"data-on": on || undefined,
				disabled: props.disabled,
				onClick: () => props.onChoose(props.label)
			},
				React.createElement(Mark, { on, check: props.multi, index: props.index + 1 }),
				React.createElement("span", { className: "mq-opt-copy" },
					React.createElement("span", { className: "mq-opt-line" },
						React.createElement("span", { className: "mq-opt-label" }, React.createElement(Md, { text: display.label })),
						display.recommended && React.createElement("span", { className: "mq-badge" }, "推荐"),
						props.description !== undefined && React.createElement("span", { className: "mq-opt-desc" }, React.createElement(Md, { text: props.description }))
					)
				)
			);
		}

		/** One question's answer controls: options / boolean / compare / open input. */
		function QuestionBody(props) {
			const q = props.q;
			const d = props.d;
			const disabled = props.disabled;
			const options = Array.isArray(q.options) ? q.options : [];
			const isBool = q.kind === "boolean";
			const isCompare = q.kind === "compare";
			const isOpen = !isBool && !isCompare && options.length === 0;

			if (isBool) {
				return React.createElement("div", { className: "mq-bool" },
					React.createElement(OptionRow, { index: 0, label: "是", selected: d.selected, multi: false, disabled, onChoose: props.onBool }),
					React.createElement(OptionRow, { index: 1, label: "否", selected: d.selected, multi: false, disabled, onChoose: props.onBool })
				);
			}
			if (isCompare) {
				return React.createElement("div", { className: "mq-compare" },
					["left", "right"].map((side) => {
						const item = (q.compare && q.compare[side]) || {};
						const on = d.selected[0] === side;
						return React.createElement("button", {
							type: "button", key: side,
							className: "mq-compare-block", "data-on": on || undefined,
							disabled,
							onClick: () => props.onCompare(side)
						},
							React.createElement("span", { className: "mq-compare-title" },
								React.createElement(Mark, { index: side === "left" ? 1 : 2 }),
								React.createElement(Md, { text: item.title ? item.title : (side === "left" ? "方案 A" : "方案 B") })
							),
							item.text !== undefined && React.createElement("span", { className: "mq-compare-text" }, React.createElement(Md, { text: item.text }))
						);
					})
				);
			}
			if (isOpen) {
				return React.createElement("textarea", {
					className: "mq-custom-textarea", placeholder: "请输入回答", rows: 2,
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
						selected: d.selected,
						multi: q.multi_select === true,
						disabled,
						onChoose: (label) => props.onChoose(label)
					})),
					React.createElement("div", { className: "mq-custom-row" + (d.custom.trim() !== "" ? " mq-on" : "") },
						React.createElement("span", { className: "mq-mark mq-num" }, React.createElement(IconEditOutline16, { size: 12 })),
						React.createElement("input", {
							type: "text", className: "mq-custom-input", placeholder: "自定义回答（可选）",
							value: d.custom,
							disabled,
							onChange: (event) => props.onCustom(event.target.value)
						})
					)
				)
			);
		}

		/** Shared submit/cancel helpers given the block + drafts. */
		function useQuestionnaire(block, questions, initialDrafts) {
			const [drafts, setDrafts] = React.useState(initialDrafts);
			const [submitting, setSubmitting] = React.useState(false);
			const [submitted, setSubmitted] = React.useState(false);
			const [error, setError] = React.useState(null);
			const [closed, setClosed] = React.useState(false);
			React.useEffect(() => {
				setDrafts(initialDrafts);
				setSubmitting(false);
				setSubmitted(false);
				setError(null);
			}, [block.callId]);
			const answeredCount = drafts.filter((d) => !d.skipped && (d.selected.length > 0 || d.custom.trim() !== "")).length;
			const choose = (index, label) => {
				if (submitting || submitted) return;
				setDrafts((current) => current.map((d, i) => {
					if (i !== index) return d;
					const q = questions[index];
					if (q.multi_select === true) {
						const selected = d.selected.includes(label)
							? d.selected.filter((item) => item !== label)
							: [...d.selected, label];
						return { ...d, selected, skipped: false };
					}
					return { ...d, selected: [label], skipped: false };
				}));
			};
			const setBool = (index, value) => {
				if (submitting || submitted) return;
				setDrafts((current) => current.map((d, i) => i === index ? { ...d, selected: [value], skipped: false } : d));
			};
			const setCompare = (index, side) => {
				if (submitting || submitted) return;
				setDrafts((current) => current.map((d, i) => i === index ? { ...d, selected: [side], skipped: false } : d));
			};
			const setCustom = (index, value) => {
				if (submitting || submitted) return;
				setDrafts((current) => current.map((d, i) => i === index ? { ...d, custom: value, skipped: false } : d));
			};
			const toggleSkip = (index) => {
				if (submitting || submitted) return;
				setDrafts((current) => current.map((d, i) => i === index ? { ...d, skipped: !d.skipped, selected: [], custom: "" } : d));
			};
			const submit = async () => {
				if (submitting || submitted) return;
				setSubmitting(true);
				setError(null);
				try {
					const answers = questions.map((q, i) => {
						const d = drafts[i] || { selected: [], custom: "" };
						if (d.skipped) return { id: q.id, selected: [], skipped: true };
						const custom = (d.custom || "").trim();
						return {
							id: q.id,
							selected: custom === "" || q.multi_select === true ? d.selected : [],
							...(custom === "" ? {} : { custom })
						};
					});
					const res = await postRoute("/api/dsh-survey/submit", { callId: block.callId, answers });
					if (res && res.ok === true) {
						setSubmitted(true);
					} else {
						setError((res && res.error) || "提交失败");
						setSubmitting(false);
					}
				} catch (cause) {
					setError(cause instanceof Error ? cause.message : String(cause));
					setSubmitting(false);
				}
			};
			const cancel = async () => {
				if (closed) return;
				setClosed(true);
				try {
					await postRoute("/api/dsh-survey/cancel", { callId: block.callId });
				} catch (cause) {
					setClosed(false);
				}
			};
			return { drafts, setDrafts, submitting, submitted, error, closed, answeredCount, choose, setBool, setCompare, setCustom, toggleSkip, submit, cancel };
		}

		function RecapCard({ block }) {
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
				if (!a) return "未回答";
				if (a.skipped) return "已跳过";
				const custom = a.custom && String(a.custom).trim() !== "" ? String(a.custom).trim() : "";
				if (custom) return custom;
				const picked = a.selected && a.selected.length > 0 ? a.selected[0] : "";
				if (!picked) return "未回答";
				if (q.kind === "compare" && q.compare) {
					const side = q.compare[picked];
					return side && side.title ? String(side.title) : picked;
				}
				return picked;
			};
			return React.createElement("div", { className: "mq-frame" },
				React.createElement("div", { className: "mq-card" },
					React.createElement("div", { className: "mq-settled" },
						React.createElement("span", { className: "mq-settled-title" }, "✅ 问卷已回答"),
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
							: React.createElement("div", { className: "mq-recap-empty" }, "共 " + answers.length + " 题已回答，结果已返回给模型")
					)
				)
			);
		}

		/** Multi-question card: inline (748px) or fullscreen overlay (wide). */
		function SurveyCard({ block, mode }) {
			let questions = [];
			try {
				const parsed = JSON.parse(block.argsRaw || "{}");
				if (Array.isArray(parsed.questions)) questions = parsed.questions;
			} catch (error) {
				questions = [];
			}
			const isWide = mode === "overlay";
			const model = useQuestionnaire(block, questions, () => questions.map(() => ({ selected: [], custom: "", skipped: false })));

			if (model.closed) {
				return React.createElement("div", { className: "mq-frame" },
					React.createElement("div", { className: "mq-card" },
						React.createElement("div", { className: "mq-settled" }, React.createElement("span", { className: "mq-settled-title" }, "问卷已关闭"))
					)
				);
			}

			return React.createElement("div", { className: "mq-frame" + (isWide ? " mq-wide" : "") },
				React.createElement("section", { className: "mq-card" },
					React.createElement("header", { className: "mq-header" },
						React.createElement("div", { className: "mq-heading" },
							React.createElement("div", { className: "mq-eyebrow" }, "问卷 · 共 " + questions.length + " 题"),
							React.createElement("h2", { className: "mq-title" }, "请回答以下问题，填完统一提交")
						),
						React.createElement("button", {
							type: "button", className: "mq-close", title: "关闭问卷", "aria-label": "关闭问卷",
							disabled: model.submitting || model.submitted,
							onClick: model.cancel
						}, React.createElement(IconCloseOutline16, null))
					),
					React.createElement("div", { className: "mq-body" },
						questions.map((q, index) => {
							const d = model.drafts[index] || { selected: [], custom: "", skipped: false };
							const options = Array.isArray(q.options) ? q.options : [];
							const isBool = q.kind === "boolean";
							const isCompare = q.kind === "compare";
							const isOpen = !isBool && !isCompare && options.length === 0;
							const typeLabel = isBool ? "是否" : isCompare ? "对比" : q.multi_select === true ? "多选" : isOpen ? "开放" : "单选";
							const bodyDisabled = model.submitting || model.submitted || d.skipped;
							return React.createElement("div", { className: "mq-question" + (d.skipped ? " mq-skipped" : ""), key: q.id || String(index) },
								React.createElement("div", { className: "mq-qtop" },
									React.createElement("div", { className: "mq-qtop-left" },
										q.header !== undefined && React.createElement("div", { className: "mq-qheader" }, React.createElement(Md, { text: q.header }))
									),
									React.createElement("div", { className: "mq-qtop-right" },
										React.createElement("span", { className: "mq-type" }, typeLabel),
										d.skipped && React.createElement("span", { className: "mq-skipped-tag" }, "已跳过"),
										React.createElement("button", {
											type: "button", className: "mq-skip",
											title: d.skipped ? "恢复此题" : "跳过此题",
											"aria-label": d.skipped ? "恢复此题" : "跳过此题",
											disabled: model.submitting || model.submitted,
											onClick: () => model.toggleSkip(index)
										}, d.skipped ? "↺" : "✕")
									)
								),
								React.createElement("div", { className: "mq-qtext" },
									React.createElement(Md, { text: String(index + 1) + "\\. " + String(q.question) })
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
								: React.createElement("span", null, "已答 ", React.createElement("b", null, String(model.answeredCount)), " / " + questions.length + " 题")
						),
						React.createElement(Button, {
							variant: "primary",
							disabled: model.submitting || model.submitted || questions.length === 0,
							onClick: model.submit
						}, model.submitted ? "已提交 ✓" : model.submitting ? "提交中…" : "提交全部回答")
					)
				)
			);
		}

		/** Compact single-question card: like a rich ask_user_question. */
		function CompactCard({ block }) {
			let questions = [];
			try {
				const parsed = JSON.parse(block.argsRaw || "{}");
				if (Array.isArray(parsed.questions)) questions = parsed.questions;
			} catch (error) {
				questions = [];
			}
			const q = questions[0] || { id: "q", question: "" };
			const model = useQuestionnaire(block, questions, () => [{ selected: [], custom: "", skipped: false }]);
			const d = model.drafts[0] || { selected: [], custom: "", skipped: false };

			if (model.closed) {
				return React.createElement("div", { className: "mq-frame" },
					React.createElement("div", { className: "mq-card" },
						React.createElement("div", { className: "mq-settled" }, React.createElement("span", { className: "mq-settled-title" }, "已关闭"))
					)
				);
			}

			const typeLabel = q.kind === "boolean" ? "是否" : q.kind === "compare" ? "对比" : q.multi_select === true ? "多选" : (Array.isArray(q.options) ? q.options.length : 0) === 0 ? "开放" : "单选";
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
						}, model.submitted ? "已提交 ✓" : model.submitting ? "提交中…" : "提交回答")
					)
				)
			);
		}

		/** Compact question body for grid cells: bool toggle / options / open. */
		function GridQuestionBody(props) {
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
						React.createElement("button", {
							type: "button", role: "radio",
							"aria-checked": d.selected[0] === "是" || undefined,
							className: "mq-grid-bool-side", "data-on": d.selected[0] === "是" || undefined,
							disabled,
							onClick: () => props.onBool("是")
						}, "是"),
						React.createElement("button", {
							type: "button", role: "radio",
							"aria-checked": d.selected[0] === "否" || undefined,
							className: "mq-grid-bool-side", "data-on": d.selected[0] === "否" || undefined,
							disabled,
							onClick: () => props.onBool("否")
						}, "否")
					)
				);
			}
			if (isCompare) {
				return React.createElement("div", { className: "mq-grid-options" },
					["left", "right"].map((side) => {
						const item = (q.compare && q.compare[side]) || {};
						const on = d.selected[0] === side;
						return React.createElement("button", {
							type: "button", key: side,
							className: "mq-grid-opt", "data-on": on || undefined,
							disabled,
							onClick: () => props.onCompare(side)
						},
							React.createElement(Mark, { index: side === "left" ? 1 : 2 }),
							React.createElement("span", { className: "mq-grid-opt-label" }, React.createElement(Md, { text: item.title ? item.title : (side === "left" ? "方案 A" : "方案 B") }))
						);
					})
				);
			}
			return React.createElement(React.Fragment, null,
				!isOpen && React.createElement("div", { className: "mq-grid-options" },
					options.map((opt, oi) => {
						const on = d.selected.includes(opt.label);
						const display = parseRecommendedLabel(stripLeadingIndex(opt.label));
						return React.createElement("button", {
							type: "button", key: String(oi),
							className: "mq-grid-opt", "data-on": on || undefined,
							disabled,
							onClick: () => props.onChoose(opt.label)
						},
							React.createElement(Mark, { on, check: q.multi_select === true, index: oi + 1 }),
							React.createElement("span", { className: "mq-grid-opt-label" },
								React.createElement(Md, { text: display.label }),
								display.recommended && React.createElement("span", { className: "mq-badge" }, "推荐")
							)
						);
					})
				),
				React.createElement(isOpen ? "textarea" : "input", {
					className: isOpen ? "mq-grid-custom mq-open" : "mq-grid-custom",
					placeholder: isOpen ? "请输入" : "补充（可选）",
					rows: isOpen ? 2 : undefined,
					value: d.custom,
					disabled,
					onChange: (event) => props.onCustom(event.target.value)
				})
			);
		}

		/** Grid matrix mode: fullscreen overlay, many simple questions, one card each. */
		function GridCard({ block }) {
			let questions = [];
			try {
				const parsed = JSON.parse(block.argsRaw || "{}");
				if (Array.isArray(parsed.questions)) questions = parsed.questions;
			} catch (error) {
				questions = [];
			}
			const model = useQuestionnaire(block, questions, () => questions.map(() => ({ selected: [], custom: "", skipped: false })));

			if (model.closed) {
				return React.createElement("div", { className: "mq-frame" },
					React.createElement("div", { className: "mq-card" },
						React.createElement("div", { className: "mq-settled" }, React.createElement("span", { className: "mq-settled-title" }, "问卷已关闭"))
					)
				);
			}

			return React.createElement("div", { className: "mq-frame mq-wide" },
				React.createElement("section", { className: "mq-card" },
					React.createElement("header", { className: "mq-header" },
						React.createElement("div", { className: "mq-heading" },
							React.createElement("div", { className: "mq-eyebrow" }, "问卷矩阵 · 共 " + questions.length + " 题"),
							React.createElement("h2", { className: "mq-title" }, "逐项快速作答，填完统一提交")
						),
						React.createElement("button", {
							type: "button", className: "mq-close", title: "关闭问卷", "aria-label": "关闭问卷",
							disabled: model.submitting || model.submitted,
							onClick: model.cancel
						}, React.createElement(IconCloseOutline16, null))
					),
					React.createElement("div", { className: "mq-grid-body" },
						questions.map((q, index) => {
							const d = model.drafts[index] || { selected: [], custom: "", skipped: false };
							const bodyDisabled = model.submitting || model.submitted || d.skipped;
							return React.createElement("div", { className: "mq-grid-item" + (d.skipped ? " mq-skipped" : ""), key: q.id || String(index) },
								React.createElement("div", { className: "mq-grid-qtext" },
									React.createElement(Md, { text: String(index + 1) + "\\. " + String(q.question) }),
									React.createElement("button", {
										type: "button", className: "mq-grid-skip",
										title: d.skipped ? "恢复此题" : "跳过此题",
										"aria-label": d.skipped ? "恢复此题" : "跳过此题",
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
								: React.createElement("span", null, "已答 ", React.createElement("b", null, String(model.answeredCount)), " / " + questions.length + " 题")
						),
						React.createElement(Button, {
							variant: "primary",
							disabled: model.submitting || model.submitted || questions.length === 0,
							onClick: model.submit
						}, model.submitted ? "已提交 ✓" : model.submitting ? "提交中…" : "提交全部回答")
					)
				)
			);
		}

		function SurveyRoot(props) {
			const block = props.block;
			if (block.kind === "tool-result") {
				return React.createElement(RecapCard, { block });
			}
			let mode = "inline";
			try {
				const parsed = JSON.parse(block.argsRaw || "{}");
				if (parsed.mode === "compact" || parsed.mode === "inline" || parsed.mode === "overlay" || parsed.mode === "grid") mode = parsed.mode;
			} catch (error) {
				mode = "inline";
			}
			if (mode === "compact") return React.createElement(CompactCard, { block });
			if (mode === "grid") return React.createElement(GridCard, { block });
			return React.createElement(SurveyCard, { block, mode });
		}

		function apply(ctx) {
			injectCss();
			const slots = ctx.get("slots");
			if (slots === undefined) return;
			return ctx.slots.inject("tool.call.toolview", () => ctx.slots.register(
				{ name: "tool.call.toolview", key: "do_a_survey" },
				SurveyRoot
			));
		}

		exports.name = name;
		exports.inject = inject;
		exports.apply = apply;
		return exports;
	}
});
