/** React and the host UI primitives are supplied by the client module loader at
 * load time, not resolved at build time — the browser must share the host's
 * single React instance, so bundling our own copy would break hooks.
 *
 * These are live bindings: read them at call time, never destructure them at
 * module scope, because module bodies evaluate before bindRuntime runs. */
export let React;
export let MarkdownText;
export let Button;
export let IconCloseOutline16;
export let IconCheckOutline14;
export let IconEditOutline16;

/**
 * Bind the loader-supplied modules.
 * @param require - the module loader's resolver, passed into the factory.
 */
export function bindRuntime(require) {
	React = require("react");
	const primitives = require("@deepseek-ai/dsh-client-ui-primitives");
	MarkdownText = primitives.MarkdownText;
	Button = primitives.Button;
	IconCloseOutline16 = primitives.IconCloseOutline16;
	IconCheckOutline14 = primitives.IconCheckOutline14;
	IconEditOutline16 = primitives.IconEditOutline16;
}
