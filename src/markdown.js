/** Markdown and {color:...} rendering, plus option-label parsing. */
import { MarkdownText, React } from "./runtime.js";

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

/** Render a Markdown string with {color:...} spans through the official safe
 * renderer.
 *
 * That renderer only speaks documents: even a bare word comes back as
 * `<div><p>word</p></div>`. Splitting a string at colour markers therefore
 * produces one block per fragment, which stacks them on separate lines, and a
 * fragment that is only a block marker — the `> ` left behind when a colour run
 * sits inside a blockquote — comes back as an empty quote. Two things keep the
 * colour inline: `.mq-md-inline` flattens the fragments back onto one line, and
 * the whitespace at each split boundary is emitted outside the renderer, since
 * Markdown trims it and would otherwise fuse the words either side of the run.
 *
 * Text with no colour marker is handed over whole, so block Markdown — fences,
 * quotes, lists — keeps its structure. */
export function Md(props) {
	if (props.text === undefined || props.text === null) return null;
	const text = padEmphasisPunct(String(props.text));
	const parts = [];
	let last = 0;
	let match;
	let key = 0;
	// Global regex held at module scope: reset so one call cannot inherit the
	// offset left by another.
	COLOR_RE.lastIndex = 0;
	const pushText = (raw) => {
		if (raw === "") return;
		const edges = /^(\s*)([\s\S]*?)(\s*)$/.exec(raw);
		if (edges[2] === "") {
			parts.push(raw);
			return;
		}
		if (edges[1] !== "") parts.push(edges[1]);
		parts.push(React.createElement(MarkdownText, { key: "t" + key++, text: edges[2] }));
		if (edges[3] !== "") parts.push(edges[3]);
	};
	while ((match = COLOR_RE.exec(text)) !== null) {
		if (match.index > last) pushText(text.slice(last, match.index));
		parts.push(React.createElement("span", {
			key: "c" + key++,
			style: { color: match[1] }
		}, React.createElement(MarkdownText, { text: match[2] })));
		last = match.index + match[0].length;
	}
	if (parts.length === 0) {
		return text === "" ? null : React.createElement(MarkdownText, { text });
	}
	if (last < text.length) pushText(text.slice(last));
	return React.createElement("span", { className: "mq-md mq-md-inline" }, ...parts);
}

/** Flatten a string to inline Markdown for the grid: its cards are small and
 * all one size, so a fenced block or a hard wrap in one question would blow
 * open every card in the matrix. Fences collapse to inline code and newlines
 * to spaces; bold and inline code still render, and the text still wraps
 * naturally inside the card. */
export function toInlineMarkdown(text) {
	return String(text)
		.replace(/```[A-Za-z0-9]*\r?\n?([\s\S]*?)```/g, (whole, code) => "`" + code.trim().replace(/\s+/g, " ") + "`")
		.replace(/^[ \t]*>[ \t]?/gm, "")
		.replace(/\s*\r?\n+\s*/g, " ")
		.trim();
}

/** Split a trailing (推荐)/(recommended) suffix off an option label, mirroring
 * the host ask_user_question badge; tolerant of markdown `**` around it. */
const REC_SUFFIX = /(?:\((?:recommended|推荐)\)|（(?:recommended|推荐)）)/i;
export function parseRecommendedLabel(label) {
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
export function stripLeadingIndex(label) {
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
		// The trailing lookahead keeps a decimal label such as "3.5 Sonnet"
		// intact — only a number that actually numbers something is a prefix.
		m = /^[0-9]{1,3}\s*(?:[.、．:：·)）])\s*(?![0-9])/.exec(rest);
	} else if (/^[一二三四五六七八九十百]+/.test(rest)) {
		m = /^[一二三四五六七八九十百]+\s*(?:[.、．:：·)）])\s*/.exec(rest);
	} else if (/^[A-Za-z]/.test(rest)) {
		m = /^[A-Za-z]\s*(?:[.、．:：·)）])\s*/.exec(rest);
	}
	if (m === null) return label;
	return prefix + rest.slice(m[0].length);
}
