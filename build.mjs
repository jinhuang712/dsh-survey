/**
 * Bundle src/ into the single client artifact the host serves.
 *
 * `dsh-client-modules` resolves `exports["./client"]` to one file and serves it
 * at `/plugins/dsh-survey/client.js` alongside `client.js.map`, so the shipped
 * shape is one bundle plus its source map. React and the UI primitives are NOT
 * bundled — they arrive through the loader's `require` so the plugin shares the
 * host's React instance.
 */
import { build } from "esbuild";

const BANNER = `window.__ModuleLoader__.load({
	id: "dsh-survey",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });`;

const FOOTER = `		return module.exports;
	}
});`;

await build({
	entryPoints: ["src/index.js"],
	outfile: "lib/client.js",
	bundle: true,
	format: "cjs",
	target: "es2022",
	platform: "browser",
	sourcemap: true,
	sourcesContent: true,
	loader: { ".css": "text" },
	legalComments: "none",
	banner: { js: BANNER },
	footer: { js: FOOTER },
	logLevel: "info"
});
