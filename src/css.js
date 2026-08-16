/** The stylesheet is injected once per page, keyed by a data attribute so a
 * reload or a second survey cannot stack duplicate <style> tags. */
import CSS from "./styles.css";

const STYLE_ID = "dsh-survey-css";
export function injectCss() {
	if (typeof document === "undefined") return;
	if (document.querySelector("style[data-plugin-css=" + JSON.stringify(STYLE_ID) + "]") !== null) return;
	const tag = document.createElement("style");
	tag.dataset.plugin = "dsh-survey";
	tag.dataset.pluginCss = STYLE_ID;
	tag.textContent = CSS;
	document.head.appendChild(tag);
}
