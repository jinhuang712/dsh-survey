window.__ModuleLoader__.load({
	id: "dsh-survey",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.js
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject,
  name: () => name
});
module.exports = __toCommonJS(index_exports);

// src/runtime.js
var React;
var MarkdownText;
var Button;
var IconCloseOutline16;
var IconCheckOutline14;
var IconEditOutline16;
function bindRuntime(require2) {
  React = require2("react");
  const primitives = require2("@deepseek-ai/dsh-client-ui-primitives");
  MarkdownText = primitives.MarkdownText;
  Button = primitives.Button;
  IconCloseOutline16 = primitives.IconCloseOutlineRegular ?? primitives.IconCloseOutline16;
  IconCheckOutline14 = primitives.IconCheckOutlineMedium ?? primitives.IconCheckOutline14;
  IconEditOutline16 = primitives.IconEditOutlineRegular ?? primitives.IconEditOutline16;
}

// src/styles.css
var styles_default = '.mq-frame {\n  display: flex;\n  justify-content: center;\n  padding: 6px calc(var(--dsh-composer-side-clearance, 0px) + 16px) 10px;\n}\n.mq-frame.mq-wide {\n  position: fixed;\n  inset: 0;\n  z-index: 60;\n  background: color-mix(in srgb, var(--dsw-alias-bg-base) 55%, transparent);\n  backdrop-filter: blur(2px);\n  padding: 5vh 24px;\n  align-items: center;\n  overflow-y: auto;\n}\n.mq-card {\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  max-width: var(--dsh-chat-content-width, 748px);\n  padding: 0;\n  border: 1px solid var(--dsw-alias-border-l2-darkmode-thin, var(--dsw-alias-border-l1));\n  border-radius: 20px;\n  background: var(--dsw-specific-input-major, var(--dsw-alias-bg-layer-1));\n  box-shadow: var(--dsw-shadow-lv2, none);\n  color: var(--dsw-alias-label-primary);\n  overflow: hidden;\n  --dsh-scrollbar-thumb: var(--dsw-alias-scrollbar-bg-l2);\n  --dsh-scrollbar-thumb-hover: var(--dsw-alias-scrollbar-hover-l2);\n}\n.mq-card:focus {\n  outline: none;\n}\n.mq-card,\n.mq-card * {\n  box-sizing: border-box;\n}\n.mq-frame.mq-wide .mq-card {\n  max-width: 1180px;\n  max-height: min(85vh, 840px);\n}\n.mq-header {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 16px;\n  flex-shrink: 0;\n  padding: 20px 16px 0 24px;\n}\n.mq-heading {\n  min-width: 0;\n}\n.mq-eyebrow {\n  margin-bottom: 5px;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 11px;\n  line-height: 16px;\n  letter-spacing: 0.04em;\n  text-transform: uppercase;\n}\n.mq-title {\n  margin: 0;\n  font-size: 16px;\n  line-height: 22px;\n  font-weight: 500;\n}\n.mq-body {\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: column;\n  min-height: 0;\n  overflow-y: auto;\n  overscroll-behavior: contain;\n}\n.mq-question {\n  display: flex;\n  flex-direction: column;\n  padding: 18px 24px 4px;\n}\n.mq-question + .mq-question {\n  border-top: 1px solid var(--dsw-alias-border-l1);\n}\n.mq-question.mq-skipped {\n  opacity: 0.5;\n}\n.mq-qtop {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  gap: 10px;\n  margin-bottom: 6px;\n}\n.mq-qtop-left {\n  min-width: 0;\n  flex: 1;\n}\n.mq-qtop-right {\n  flex: none;\n  display: flex;\n  align-items: center;\n  gap: 6px;\n}\n.mq-qheader {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 12px;\n  font-weight: 600;\n  line-height: 20px;\n  letter-spacing: 0.02em;\n}\n.mq-qindex {\n  display: grid;\n  place-items: center;\n  flex: none;\n  min-width: 20px;\n  height: 20px;\n  padding: 0 6px;\n  border-radius: 999px;\n  background: var(--dsw-alias-bg-overlay);\n  color: var(--dsw-alias-label-secondary);\n  font-size: 11px;\n  font-weight: 600;\n}\n.mq-qtext {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: baseline;\n  gap: 2px 6px;\n  margin-bottom: 12px;\n  font-size: 15px;\n  line-height: 24px;\n  font-weight: 600;\n  letter-spacing: -0.005em;\n}\n.mq-qtext .mq-md {\n  flex: 0 1 auto;\n  min-width: 0;\n}\n.mq-qtext > div {\n  min-width: 0;\n}\n.mq-type {\n  flex: none;\n  padding: 0 8px;\n  border-radius: 999px;\n  border: 1px solid var(--dsw-alias-border-l1);\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 11px;\n  line-height: 18px;\n  font-weight: 500;\n  letter-spacing: 0.02em;\n}\n.mq-skip {\n  padding: 0 8px;\n  border: none;\n  border-radius: 999px;\n  background: transparent;\n  color: var(--dsw-alias-label-tertiary);\n  cursor: pointer;\n  font: inherit;\n  font-size: 12px;\n  line-height: 20px;\n}\n.mq-close {\n  display: grid;\n  place-items: center;\n  width: 24px;\n  height: 24px;\n  padding: 0;\n  border: none;\n  border-radius: 999px;\n  background: transparent;\n  color: var(--dsw-alias-label-tertiary);\n  cursor: pointer;\n  font-size: 14px;\n  line-height: 1;\n}\n.mq-skip:hover:not(:disabled),\n.mq-close:hover:not(:disabled) {\n  background: var(--dsw-alias-interactive-bg-hover);\n  color: var(--dsw-alias-label-primary);\n}\n.mq-skip:disabled,\n.mq-close:disabled {\n  color: var(--dsw-alias-label-dimmed);\n  cursor: default;\n}\n.mq-skip:focus-visible,\n.mq-close:focus-visible {\n  outline: 2px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 60%, transparent);\n  outline-offset: 2px;\n}\n.mq-skipped-tag {\n  display: inline-block;\n  padding: 0 4px;\n  border-radius: 6px;\n  background: var(--dsw-specific-sidebar-nav-item-active-accent, var(--dsw-alias-bg-layer-2));\n  color: var(--dsw-alias-button-info-fill, var(--dsw-alias-label-secondary));\n  font-size: 11px;\n  font-weight: 600;\n  line-height: 18px;\n  letter-spacing: 0.02em;\n}\n.mq-options {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  margin: 4px 0 0;\n  padding: 0;\n}\n.mq-mark.mq-radio {\n  background: transparent;\n}\n.mq-mark.mq-radio::before {\n  content: "";\n  grid-area: 1/1;\n  width: 14px;\n  height: 14px;\n  border: 1px solid var(--dsw-alias-border-l4);\n  border-radius: 50%;\n  transition:\n    background-color 120ms ease,\n    border-color 120ms ease;\n}\n.mq-radio-dot {\n  grid-area: 1/1;\n  width: 6px;\n  height: 6px;\n  border-radius: 50%;\n  background: var(--dsw-alias-label-primary-foreground);\n  opacity: 0;\n  transition: opacity 120ms ease;\n}\n.mq-opt[data-on] .mq-mark.mq-radio::before {\n  border-color: var(--dsw-alias-label-primary);\n  background: var(--dsw-alias-label-primary);\n}\n.mq-opt[data-on] .mq-radio-dot {\n  opacity: 1;\n}\n.mq-opt {\n  display: flex;\n  align-items: flex-start;\n  gap: 8px;\n  width: 100%;\n  min-height: 48px;\n  flex-shrink: 0;\n  padding: 12px 14px;\n  border: 1px solid var(--dsw-alias-border-l1);\n  border-radius: 12px;\n  background: transparent;\n  color: inherit;\n  text-align: left;\n  cursor: pointer;\n  transition:\n    background-color 120ms ease,\n    border-color 120ms ease;\n  font-family: inherit;\n}\n.mq-opt:hover:not(:disabled) {\n  border-color: var(--dsw-alias-border-l2);\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n.mq-opt[data-on] {\n  border-color: var(--dsw-alias-state-business-primary);\n  background: color-mix(in srgb, var(--dsw-alias-state-business-primary) 10%, transparent);\n}\n.mq-opt:active:not(:disabled) {\n  transform: scale(0.995);\n}\n.mq-opt:focus-visible {\n  outline: 2px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 70%, transparent);\n  outline-offset: 2px;\n}\n.mq-opt:disabled {\n  cursor: default;\n}\n.mq-mark {\n  display: grid;\n  place-items: center;\n  flex: 0 0 20px;\n  width: 20px;\n  height: 20px;\n  margin-top: 2px;\n  border-radius: 6px;\n  background: var(--dsw-alias-bg-overlay);\n  color: var(--dsw-alias-label-secondary);\n  font-size: 12px;\n  font-weight: 500;\n  line-height: 18px;\n}\n.mq-mark.mq-check {\n  background: transparent;\n}\n.mq-mark.mq-check::before {\n  content: "";\n  grid-area: 1/1;\n  width: 14px;\n  height: 14px;\n  border: 1px solid var(--dsw-alias-border-l4);\n  border-radius: 4px;\n  transition:\n    background-color 120ms ease,\n    border-color 120ms ease;\n}\n.mq-mark.mq-check > svg {\n  grid-area: 1/1;\n}\n.mq-opt[data-on] .mq-mark.mq-check {\n  color: var(--dsw-alias-label-primary-foreground);\n}\n.mq-opt[data-on] .mq-mark.mq-check::before {\n  border-color: var(--dsw-alias-label-primary);\n  background: var(--dsw-alias-label-primary);\n}\n.mq-opt-copy {\n  min-width: 0;\n  flex: 1;\n}\n.mq-opt-line {\n  display: flex;\n  align-items: baseline;\n  flex-wrap: wrap;\n  gap: 2px 6px;\n}\n.mq-opt-label {\n  font-size: 14px;\n  line-height: 24px;\n  font-weight: 500;\n}\n.mq-badge {\n  flex: none;\n  padding: 0 4px;\n  border-radius: 6px;\n  background: var(--dsw-specific-sidebar-nav-item-active-accent, var(--dsw-alias-bg-layer-2));\n  color: var(--dsw-alias-button-info-fill, var(--dsw-alias-label-secondary));\n  font-size: 11px;\n  line-height: 18px;\n  font-weight: 600;\n}\n.mq-opt-desc {\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 14px;\n  line-height: 24px;\n  font-weight: 400;\n}\n.mq-custom-row {\n  display: flex;\n  align-items: flex-start;\n  gap: 8px;\n  width: 100%;\n  min-height: 40px;\n  flex-shrink: 0;\n  padding: 8px 12px 8px 8px;\n  border: 1px solid transparent;\n  border-radius: 12px;\n  transition:\n    background-color 120ms ease,\n    border-color 120ms ease;\n}\n.mq-custom-row:hover,\n.mq-custom-row:focus-within,\n.mq-custom-row.mq-on {\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n.mq-custom-row:focus-within,\n.mq-custom-row.mq-on {\n  border-color: var(--dsw-alias-border-l2);\n}\n.mq-custom-input {\n  flex: 1;\n  min-width: 0;\n  padding: 0;\n  border: none;\n  outline: none;\n  background: transparent;\n  color: var(--dsw-alias-label-primary);\n  caret-color: var(--dsw-alias-state-business-primary);\n  font: inherit;\n  font-size: 14px;\n  line-height: 24px;\n}\n.mq-custom-input::placeholder {\n  color: var(--dsw-alias-label-caption);\n}\n.mq-custom-textarea {\n  display: block;\n  width: 100%;\n  min-height: 64px;\n  max-height: 140px;\n  flex-shrink: 0;\n  margin: 8px 0 0;\n  padding: 8px 12px;\n  resize: none;\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 10px;\n  outline: none;\n  background: var(--dsw-alias-bg-module-platform);\n  color: var(--dsw-alias-label-primary);\n  caret-color: var(--dsw-alias-state-business-primary);\n  font: inherit;\n  font-size: 14px;\n  line-height: 24px;\n}\n.mq-custom-textarea:focus {\n  border-color: var(--dsw-alias-state-business-primary);\n}\n.mq-custom-textarea::placeholder {\n  color: var(--dsw-alias-label-caption);\n}\n.mq-footer {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  flex-shrink: 0;\n  margin-top: 14px;\n  padding: 12px 16px 12px 24px;\n  border-top: 1px solid var(--dsw-alias-border-l1);\n}\n.mq-progress {\n  color: var(--dsw-alias-label-secondary);\n  font-size: 14px;\n  line-height: 24px;\n  font-weight: 500;\n  white-space: nowrap;\n}\n.mq-meter {\n  position: relative;\n  display: inline-block;\n  width: 72px;\n  height: 4px;\n  margin-left: 10px;\n  overflow: hidden;\n  vertical-align: middle;\n  border-radius: 999px;\n  background: var(--dsw-alias-border-l2);\n}\n.mq-meter > i {\n  position: absolute;\n  inset: 0 auto 0 0;\n  border-radius: inherit;\n  background: var(--dsw-alias-state-business-primary);\n  transition: width 160ms ease;\n}\n.mq-progress b {\n  color: var(--dsw-alias-label-primary);\n  font-weight: 500;\n}\n.mq-error {\n  flex: 1;\n  min-height: 24px;\n  color: var(--dsw-alias-state-error-primary);\n  font-size: 14px;\n  line-height: 24px;\n  font-weight: 500;\n  text-align: left;\n}\n.mq-md {\n  font-size: 13px;\n  line-height: 20px;\n  font-weight: 400;\n}\n/* Colour splits a string into one rendered block per fragment; flatten them\n   back onto a single line. Scoped to the split case so ordinary block Markdown\n   keeps its paragraphs, quotes and fences. */\n.mq-md-inline > div,\n.mq-md-inline > span > div {\n  display: contents;\n}\n.mq-md-inline p {\n  display: inline;\n  margin: 0;\n}\n.mq-md-inline blockquote {\n  display: inline;\n  margin: 0;\n  padding: 0;\n  border-left: none;\n}\n.mq-md > *:first-child {\n  margin-top: 0;\n}\n.mq-md > *:last-child {\n  margin-bottom: 0;\n}\n.mq-md p {\n  margin: 4px 0;\n}\n.mq-md pre {\n  background: var(--dsw-alias-bg-layer-2);\n  border: 1px solid var(--dsw-alias-border-l1);\n  border-radius: 8px;\n  padding: 8px 10px;\n  overflow-x: auto;\n  margin: 6px 0;\n  font-size: 12px;\n  line-height: 18px;\n}\n.mq-md code {\n  background: var(--dsw-alias-bg-layer-2);\n  border-radius: 4px;\n  padding: 1px 5px;\n  font-size: 12px;\n  font-family: var(--ds-font-family-code, monospace);\n}\n.mq-md blockquote {\n  border-left: 3px solid var(--dsw-alias-border-l2);\n  color: var(--dsw-alias-label-secondary);\n  margin: 6px 0;\n  padding: 2px 0 2px 12px;\n}\n.mq-compare {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 12px;\n  margin: 8px 0 0;\n}\n.mq-compare-block {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  text-align: left;\n  min-width: 0;\n  min-height: 148px;\n  flex-shrink: 0;\n  padding: 14px 16px;\n  border: 1px solid var(--dsw-alias-border-l2-darkmode-thin, var(--dsw-alias-border-l1));\n  border-radius: 12px;\n  background: var(--dsw-alias-interactive-bg-hover);\n  color: inherit;\n  cursor: pointer;\n  transition:\n    background-color 120ms ease,\n    border-color 120ms ease;\n  font-family: inherit;\n}\n.mq-compare-block:hover {\n  border-color: var(--dsw-alias-border-l2);\n}\n.mq-compare-block[data-on] {\n  background: var(--dsw-specific-input-major, var(--dsw-alias-bg-layer-1));\n  border-color: var(--dsw-alias-label-primary);\n}\n.mq-compare-block[data-on] .mq-mark {\n  background: var(--dsw-alias-label-primary);\n  color: var(--dsw-alias-label-primary-foreground);\n}\n.mq-compare-block:focus-visible {\n  outline: 2px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 70%, transparent);\n  outline-offset: 2px;\n}\n.mq-compare-title {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font: var(--dsw-font-s-strong-14, 500 14px/22px inherit);\n  font-family: inherit;\n}\n.mq-compare-title .mq-mark {\n  width: 20px;\n  height: 20px;\n  font-size: 11px;\n  margin-top: 0;\n}\n.mq-compare-text {\n  flex: 1;\n  color: var(--dsw-alias-label-tertiary);\n  font: var(--dsw-font-xs-13, 13px/20px inherit);\n  font-family: inherit;\n}\n.mq-settled {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  padding: 16px 24px 10px;\n  font-size: 13px;\n  line-height: 20px;\n}\n.mq-settled-title {\n  color: var(--dsw-alias-state-success-primary);\n  font-weight: 600;\n}\n.mq-recap {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  max-height: 200px;\n  overflow-y: auto;\n  padding-right: 4px;\n}\n.mq-recap-row {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 14px;\n  align-items: baseline;\n  padding: 4px 0;\n  border-bottom: 1px solid var(--dsw-alias-border-l1);\n}\n.mq-recap-row:last-child {\n  border-bottom: none;\n}\n.mq-recap-q {\n  color: var(--dsw-alias-label-secondary);\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-weight: 400;\n}\n.mq-recap-a {\n  color: var(--dsw-alias-label-primary);\n  font-weight: 600;\n  min-width: 0;\n  word-break: break-word;\n}\n.mq-recap-empty {\n  color: var(--dsw-alias-label-tertiary, var(--dsw-alias-label-secondary));\n  font-weight: 400;\n}\n.mq-compact {\n  padding: 12px 24px 0;\n}\n.mq-compact .mq-qtext {\n  margin-bottom: 8px;\n}\n.mq-compact .mq-footer {\n  justify-content: flex-end;\n  padding: 12px 14px 16px 18px;\n}\n.mq-grid-body {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(248px, 1fr));\n  grid-auto-rows: 1fr;\n  gap: 10px;\n  padding: 12px 24px 4px;\n  max-height: min(80vh, 780px);\n  overflow-y: auto;\n}\n.mq-grid-item {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  min-width: 0;\n  min-height: 96px;\n  padding: 12px;\n  border: 1px solid var(--dsw-alias-border-l2-darkmode-thin, var(--dsw-alias-border-l1));\n  border-radius: 12px;\n  background: var(--dsw-alias-interactive-bg-hover);\n  transition:\n    border-color 120ms ease,\n    opacity 120ms ease;\n}\n.mq-grid-item:hover {\n  border-color: var(--dsw-alias-border-l2);\n}\n.mq-grid-item.mq-skipped {\n  opacity: 0.45;\n}\n.mq-grid-qtext {\n  display: flex;\n  align-items: baseline;\n  gap: 6px;\n  padding-right: 20px;\n  font: var(--dsw-font-xs-strong-13, 500 13px/20px inherit);\n}\n.mq-grid-qtext .mq-md {\n  flex: 1;\n  min-width: 0;\n  font: inherit;\n}\n.mq-grid-qtext > div {\n  flex: 1;\n  min-width: 0;\n}\n.mq-grid-qindex {\n  flex: none;\n  color: var(--dsw-alias-label-tertiary);\n  font-variant-numeric: tabular-nums;\n}\n.mq-grid-skip {\n  position: absolute;\n  top: 4px;\n  right: 4px;\n  display: grid;\n  place-items: center;\n  width: 24px;\n  height: 24px;\n  padding: 0;\n  border: none;\n  border-radius: 50%;\n  background: transparent;\n  color: var(--dsw-alias-label-tertiary);\n  cursor: pointer;\n  font-size: 11px;\n  line-height: 1;\n  transition:\n    background 120ms ease,\n    color 120ms ease;\n}\n.mq-grid-skip:hover {\n  background: var(--dsw-specific-input-major, var(--dsw-alias-bg-layer-1));\n  color: var(--dsw-alias-label-primary);\n}\n.mq-grid-skip:focus-visible {\n  outline: 2px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 60%, transparent);\n  outline-offset: 2px;\n}\n.mq-grid-item .mq-grid-bool {\n  margin-top: 2px;\n}\n.mq-grid-options {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n.mq-grid-opt {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  text-align: left;\n  width: 100%;\n  min-height: 36px;\n  padding: 6px 10px;\n  border: 1px solid transparent;\n  border-radius: 10px;\n  background: transparent;\n  color: inherit;\n  cursor: pointer;\n  font: var(--dsw-font-xs-13, 13px/20px inherit);\n  font-family: inherit;\n  transition:\n    background-color 120ms ease,\n    border-color 120ms ease;\n}\n.mq-grid-opt:hover,\n.mq-grid-opt[data-on] {\n  background: var(--dsw-specific-input-major, var(--dsw-alias-bg-layer-1));\n}\n.mq-grid-opt[data-on] {\n  border-color: var(--dsw-alias-border-l2);\n}\n.mq-grid-opt:focus-visible {\n  outline: 2px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 70%, transparent);\n  outline-offset: 2px;\n}\n.mq-grid-opt .mq-mark {\n  width: 18px;\n  height: 18px;\n  font-size: 11px;\n  margin-top: 0;\n}\n.mq-grid-opt-label {\n  display: flex;\n  align-items: baseline;\n  flex-wrap: wrap;\n  gap: 2px 6px;\n  font-weight: 500;\n}\n.mq-grid-custom {\n  width: 100%;\n  box-sizing: border-box;\n  padding: 7px 10px;\n  border: 1px solid var(--dsw-alias-border-l2-darkmode-thin, var(--dsw-alias-border-l2));\n  border-radius: 10px;\n  outline: none;\n  background: var(--dsw-specific-input-major, var(--dsw-alias-bg-layer-1));\n  color: var(--dsw-alias-label-primary);\n  font: var(--dsw-font-xs-13, 13px/20px inherit);\n  font-family: inherit;\n  transition: border-color 120ms ease;\n}\n.mq-grid-custom::placeholder {\n  color: var(--dsw-alias-label-caption);\n  opacity: 0.75;\n}\n.mq-grid-custom:focus {\n  border-color: var(--dsw-alias-state-business-primary);\n}\n.mq-grid-custom.mq-open {\n  min-height: 44px;\n  resize: vertical;\n}\n.mq-grid-bool {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n}\n.mq-grid-bool-switch {\n  display: inline-flex;\n  align-items: center;\n  gap: 0;\n  padding: 3px;\n  border: 1px solid var(--dsw-alias-border-l2-darkmode-thin, var(--dsw-alias-border-l2));\n  border-radius: 999px;\n  background: var(--dsw-specific-input-major, var(--dsw-alias-bg-layer-1));\n  cursor: pointer;\n  transition: border-color 120ms ease;\n}\n.mq-grid-bool-switch:hover {\n  border-color: var(--dsw-alias-border-l2);\n}\n.mq-grid-bool-switch:focus-visible {\n  outline: 2px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 60%, transparent);\n  outline-offset: 2px;\n}\n.mq-grid-bool-side {\n  min-width: 46px;\n  padding: 5px 14px;\n  border: none;\n  border-radius: 999px;\n  background: none;\n  color: var(--dsw-alias-label-secondary);\n  font: var(--dsw-font-xxs-strong-12, 500 12px/18px inherit);\n  font-family: inherit;\n  cursor: pointer;\n  transition:\n    background 120ms ease,\n    color 120ms ease;\n}\n.mq-grid-bool-side:hover:not([data-on]) {\n  color: var(--dsw-alias-label-primary);\n}\n.mq-grid-bool-side[data-on] {\n  background: var(--dsw-alias-label-primary);\n  color: var(--dsw-alias-label-primary-foreground);\n}\n.mq-grid-footer {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 12px;\n  flex-shrink: 0;\n  margin-top: 18px;\n  padding: 12px 14px 14px 18px;\n}\n.mq-grid-progress {\n  color: var(--dsw-alias-label-secondary);\n  font-size: 14px;\n  line-height: 24px;\n  font-weight: 500;\n}\n.mq-grid-progress b {\n  color: var(--dsw-alias-label-primary);\n  font-weight: 500;\n}\n@media (max-width: 720px) {\n  .mq-card {\n    border-radius: 16px;\n  }\n  .mq-header {\n    padding: 10px 12px 0 18px;\n  }\n  .mq-question {\n    padding: 10px 18px 0;\n  }\n  .mq-footer {\n    align-items: flex-end;\n    padding: 0 10px;\n  }\n  .mq-opt,\n  .mq-custom-row {\n    padding: 8px 6px;\n  }\n}\n/* Sidebar-foot reminder while any survey waits for the user. Rendered in the\n   root-scoped sidebar.footer.action list, so it stays visible from every\n   session \u2014 the same amber "waiting" language the session list uses. */\n.mq-pending-dot {\n  flex: none;\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  background: var(--dsw-alias-state-warn-primary);\n  box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-warn-primary) 22%, transparent);\n}\n';

// src/css.js
var STYLE_ID = "dsh-survey-css";
function injectCss() {
  if (typeof document === "undefined") return;
  if (document.querySelector("style[data-plugin-css=" + JSON.stringify(STYLE_ID) + "]") !== null)
    return;
  const tag = document.createElement("style");
  tag.dataset.plugin = "dsh-survey";
  tag.dataset.pluginCss = STYLE_ID;
  tag.textContent = styles_default;
  document.head.appendChild(tag);
}

// src/i18n.js
var TEXT = {
  zh: {
    "eyebrow.survey": "\u95EE\u5377 \xB7 \u5171 {count} \u9898",
    "eyebrow.grid": "\u95EE\u5377\u77E9\u9635 \xB7 \u5171 {count} \u9898",
    "title.survey": "\u8BF7\u56DE\u7B54\u4EE5\u4E0B\u95EE\u9898\uFF0C\u586B\u5B8C\u7EDF\u4E00\u63D0\u4EA4",
    "title.grid": "\u9010\u9879\u5FEB\u901F\u4F5C\u7B54\uFF0C\u586B\u5B8C\u7EDF\u4E00\u63D0\u4EA4",
    "type.single": "\u5355\u9009",
    "type.multi": "\u591A\u9009",
    "type.boolean": "\u662F\u5426",
    "type.compare": "\u5BF9\u6BD4",
    "type.open": "\u5F00\u653E",
    "bool.yes": "\u662F\u7684",
    "bool.no": "\u4E0D\u662F",
    "compare.left": "\u65B9\u6848 A",
    "compare.right": "\u65B9\u6848 B",
    "badge.recommended": "\u63A8\u8350",
    "tag.skipped": "\u5DF2\u8DF3\u8FC7",
    "action.skip": "\u8DF3\u8FC7\u6B64\u9898",
    "action.restore": "\u6062\u590D\u6B64\u9898",
    "action.close": "\u5173\u95ED\u95EE\u5377",
    "progress.prefix": "\u5DF2\u7B54 ",
    "progress.suffix": " / {count} \u9898",
    "submit.all": "\u63D0\u4EA4\u5168\u90E8\u56DE\u7B54",
    "submit.one": "\u63D0\u4EA4\u56DE\u7B54",
    "submit.pending": "\u63D0\u4EA4\u4E2D\u2026",
    "submit.done": "\u5DF2\u63D0\u4EA4 \u2713",
    "placeholder.open": "\u8BF7\u8F93\u5165\u56DE\u7B54",
    "placeholder.custom": "\u81EA\u5B9A\u4E49\u56DE\u7B54\uFF08\u53EF\u9009\uFF09",
    "placeholder.gridOpen": "\u8BF7\u8F93\u5165",
    "placeholder.gridCustom": "\u8865\u5145\uFF08\u53EF\u9009\uFF09",
    "recap.title": "\u2705 \u95EE\u5377\u5DF2\u56DE\u7B54",
    "recap.summary": "\u5171 {count} \u9898\u5DF2\u56DE\u7B54\uFF0C\u7ED3\u679C\u5DF2\u8FD4\u56DE\u7ED9\u6A21\u578B",
    "recap.unanswered": "\u672A\u56DE\u7B54",
    "recap.join": "\u3001",
    "recap.note": "\uFF1B",
    "settled.closed": "\u95EE\u5377\u5DF2\u5173\u95ED",
    "settled.closedShort": "\u5DF2\u5173\u95ED",
    "error.submit": "\u63D0\u4EA4\u5931\u8D25",
    "error.close": "\u5173\u95ED\u5931\u8D25"
  },
  en: {
    "eyebrow.survey": "Survey \xB7 {count} questions",
    "eyebrow.survey.one": "Survey \xB7 1 question",
    "eyebrow.grid": "Survey matrix \xB7 {count} questions",
    "eyebrow.grid.one": "Survey matrix \xB7 1 question",
    "title.survey": "Answer these, then submit together",
    "title.grid": "Answer each, then submit together",
    "type.single": "Single",
    "type.multi": "Multi",
    "type.boolean": "Yes/No",
    "type.compare": "Compare",
    "type.open": "Open",
    "bool.yes": "Yes",
    "bool.no": "No",
    "compare.left": "Option A",
    "compare.right": "Option B",
    "badge.recommended": "Recommended",
    "tag.skipped": "Skipped",
    "action.skip": "Skip this question",
    "action.restore": "Restore this question",
    "action.close": "Close survey",
    "progress.prefix": "Answered ",
    "progress.suffix": " / {count}",
    "submit.all": "Submit all answers",
    "submit.one": "Submit answer",
    "submit.pending": "Submitting\u2026",
    "submit.done": "Submitted \u2713",
    "placeholder.open": "Type your answer",
    "placeholder.custom": "Custom answer (optional)",
    "placeholder.gridOpen": "Type an answer",
    "placeholder.gridCustom": "Add a note (optional)",
    "recap.title": "\u2705 Survey answered",
    "recap.summary": "{count} questions answered; the results went back to the model",
    "recap.summary.one": "1 question answered; the result went back to the model",
    "recap.unanswered": "Not answered",
    "recap.join": ", ",
    "recap.note": "; ",
    "settled.closed": "Survey closed",
    "settled.closedShort": "Closed",
    "error.submit": "Submit failed",
    "error.close": "Close failed"
  }
};
var localeFace = null;
var NO_LOCALE = { subscribe: () => () => {
}, getSnapshot: () => null };
function setLocaleFace(face) {
  localeFace = face;
}
function readStore(face) {
  const useStore = typeof React.useSyncExternalStore === "function" ? React.useSyncExternalStore : (subscribe, getSnapshot) => getSnapshot();
  return useStore(face.subscribe, face.getSnapshot, face.getSnapshot);
}
function browserLocale() {
  const tag = typeof navigator === "object" && navigator !== null ? String(navigator.language || "") : "";
  return tag.toLowerCase().startsWith("zh") ? "zh" : "en";
}
function translator(locale) {
  const dict = TEXT[locale] || TEXT.en;
  return (key, vars) => {
    const plural = vars !== void 0 && vars.count === 1 ? dict[key + ".one"] : void 0;
    const base = plural !== void 0 ? plural : dict[key];
    const template = base !== void 0 ? base : TEXT.en[key] !== void 0 ? TEXT.en[key] : key;
    if (vars === void 0) return template;
    return template.replace(
      /\{(\w+)\}/g,
      (whole, token) => vars[token] === void 0 ? whole : String(vars[token])
    );
  };
}
function useText() {
  const face = localeFace === null ? NO_LOCALE : localeFace;
  const snapshot = readStore(face);
  const active = snapshot === null || snapshot === void 0 ? null : snapshot.active;
  const locale = active === "zh" || active === "en" ? active : browserLocale();
  return React.useMemo(() => translator(locale), [locale]);
}

// src/call.js
function parseCall(block) {
  try {
    const parsed = JSON.parse(block.argsRaw || "{}");
    return {
      mode: parsed.mode,
      questions: Array.isArray(parsed.questions) ? parsed.questions : []
    };
  } catch (error) {
    return { mode: void 0, questions: [] };
  }
}

// src/markdown.js
var COLOR_RE = /\{color:([a-zA-Z]+|[#][0-9a-fA-F]{3,8}|rgb\([^)]*\))\}([\s\S]*?)\{\/color\}/g;
var ZWSP = "\u200B";
var PUNCT = new Set(
  Array.from("!\"#$%&'()+,./:;<=>?@[\\]^_`{|}~\u201C\u201D\u2018\u2019\u300C\u300D\u300E\u300F\u3008\u3009\u300A\u300B\uFF08\uFF09\u2014\u2026\xB7\u3001\u3002\uFF0C\uFF01\uFF1F\uFF1A\uFF1B")
);
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
    if (after !== void 0 && PUNCT.has(after)) seg += ZWSP;
    if (before !== void 0 && PUNCT.has(before)) seg = ZWSP + seg;
    out.push(text.slice(last, match.index), seg);
    last = match.index + 2;
  }
  out.push(text.slice(last));
  return out.join("");
}
function Md(props) {
  if (props.text === void 0 || props.text === null) return null;
  const text = padEmphasisPunct(String(props.text));
  const parts = [];
  let last = 0;
  let match;
  let key = 0;
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
    parts.push(
      React.createElement(
        "span",
        {
          key: "c" + key++,
          style: { color: match[1] }
        },
        React.createElement(MarkdownText, { text: match[2] })
      )
    );
    last = match.index + match[0].length;
  }
  if (parts.length === 0) {
    return text === "" ? null : React.createElement(MarkdownText, { text });
  }
  if (last < text.length) pushText(text.slice(last));
  return React.createElement("span", { className: "mq-md mq-md-inline" }, ...parts);
}
function toInlineMarkdown(text) {
  return String(text).replace(
    /```[A-Za-z0-9]*\r?\n?([\s\S]*?)```/g,
    (whole, code) => "`" + code.trim().replace(/\s+/g, " ") + "`"
  ).replace(/^[ \t]*>[ \t]?/gm, "").replace(/\s*\r?\n+\s*/g, " ").trim();
}
var REC_SUFFIX = /(?:\((?:recommended|推荐)\)|（(?:recommended|推荐)）)/i;
function parseRecommendedLabel(label) {
  const m = REC_SUFFIX.exec(label);
  if (m === null) return { label, recommended: false };
  return {
    label: (label.slice(0, m.index) + label.slice(m.index + m[0].length)).replace(/\s+$/, ""),
    recommended: true
  };
}
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
    m = /^[0-9]{1,3}\s*(?:[.、．:：·)）])\s*(?![0-9])/.exec(rest);
  } else if (/^[一二三四五六七八九十百]+/.test(rest)) {
    m = /^[一二三四五六七八九十百]+\s*(?:[.、．:：·)）])\s*/.exec(rest);
  } else if (/^[A-Za-z]/.test(rest)) {
    m = /^[A-Za-z]\s*(?:[.、．:：·)）])\s*/.exec(rest);
  }
  if (m === null) return label;
  return prefix + rest.slice(m[0].length);
}

// src/answers.js
var BOOL_CHOICES = [
  { value: "yes", key: "bool.yes" },
  { value: "no", key: "bool.no" }
];
function pickedToSelected(q, picked) {
  if (q.kind === "boolean" || q.kind === "compare") return picked.slice();
  const options = Array.isArray(q.options) ? q.options : [];
  const labels = [];
  for (const index of picked) {
    const opt = options[index];
    if (opt !== void 0 && opt !== null) labels.push(String(opt.label));
  }
  return labels;
}
function describeChoice(q, value, t) {
  const text = String(value);
  if (q.kind === "boolean") {
    const choice = BOOL_CHOICES.find((item) => item.value === text);
    return choice === void 0 ? text : t(choice.key);
  }
  if (q.kind === "compare" && q.compare) {
    const side = q.compare[text];
    if (side && side.title) return String(side.title);
    return text;
  }
  return parseRecommendedLabel(stripLeadingIndex(text)).label;
}

// src/modes/recap.js
function RecapCard({ block }) {
  const t = useText();
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
      const text = block.content.map((c) => c && typeof c.text === "string" ? c.text : "").join("");
      if (text) {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed.answers)) answers = parsed.answers;
      }
    }
  } catch (error) {
    answers = [];
  }
  const renderAnswer = (q, a) => {
    if (!a) return t("recap.unanswered");
    if (a.skipped) return t("tag.skipped");
    const custom = a.custom && String(a.custom).trim() !== "" ? String(a.custom).trim() : "";
    const chosen = Array.isArray(a.selected) ? a.selected.map((value) => describeChoice(q, value, t)) : [];
    if (chosen.length > 0 && custom !== "")
      return chosen.join(t("recap.join")) + t("recap.note") + custom;
    if (chosen.length > 0) return chosen.join(t("recap.join"));
    if (custom !== "") return custom;
    return t("recap.unanswered");
  };
  return React.createElement(
    "div",
    { className: "mq-frame" },
    React.createElement(
      "div",
      { className: "mq-card" },
      React.createElement(
        "div",
        { className: "mq-settled" },
        React.createElement("span", { className: "mq-settled-title" }, t("recap.title")),
        questions.length > 0 ? React.createElement(
          "div",
          { className: "mq-recap" },
          questions.map((q, index) => {
            const a = answers.find((item) => item.id === q.id);
            return React.createElement(
              "div",
              { className: "mq-recap-row", key: q.id || String(index) },
              React.createElement(
                "span",
                { className: "mq-recap-q" },
                React.createElement(Md, {
                  text: String(index + 1) + "\\. " + String(q.question)
                })
              ),
              React.createElement(
                "span",
                {
                  className: a && (a.custom || (a.selected || []).length > 0) ? "mq-recap-a" : "mq-recap-empty"
                },
                React.createElement(Md, { text: renderAnswer(q, a) })
              )
            );
          })
        ) : React.createElement(
          "div",
          { className: "mq-recap-empty" },
          t("recap.summary", { count: answers.length })
        )
      )
    )
  );
}

// src/question.js
var BLANK_DRAFT = { picked: [], custom: "", skipped: false };
function describeQuestion(q) {
  const options = Array.isArray(q.options) ? q.options : [];
  const isBool = q.kind === "boolean";
  const isCompare = q.kind === "compare";
  const isOpen = !isBool && !isCompare && options.length === 0;
  const type = isBool ? "boolean" : isCompare ? "compare" : q.multi_select === true ? "multi" : isOpen ? "open" : "single";
  return { options, isBool, isCompare, isOpen, typeKey: "type." + type };
}

// src/controls.js
function SettledCard({ textKey }) {
  const t = useText();
  return React.createElement(
    "div",
    { className: "mq-frame" },
    React.createElement(
      "div",
      { className: "mq-card" },
      React.createElement(
        "div",
        { className: "mq-settled" },
        React.createElement("span", { className: "mq-settled-title" }, t(textKey))
      )
    )
  );
}
function Mark(props) {
  if (props.check) {
    return React.createElement(
      "span",
      { className: "mq-mark mq-check", "aria-hidden": true },
      props.on ? React.createElement(IconCheckOutline14, { size: 12 }) : null
    );
  }
  if (props.radio) {
    return React.createElement(
      "span",
      { className: "mq-mark mq-radio", "aria-hidden": true },
      props.on ? React.createElement("span", { className: "mq-radio-dot" }) : null
    );
  }
  if (props.index == null) return null;
  return React.createElement("span", { className: "mq-mark mq-num" }, String(props.index));
}
function OptionRow(props) {
  const t = useText();
  const on = props.on === true;
  const display = parseRecommendedLabel(stripLeadingIndex(props.label));
  return React.createElement(
    "button",
    {
      type: "button",
      className: "mq-opt",
      "data-on": on || void 0,
      disabled: props.disabled,
      onClick: props.onChoose
    },
    React.createElement(Mark, {
      on,
      check: props.multi,
      radio: props.radio === true,
      index: props.index == null ? null : props.index + 1
    }),
    React.createElement(
      "span",
      { className: "mq-opt-copy" },
      React.createElement(
        "span",
        { className: "mq-opt-line" },
        React.createElement(
          "span",
          { className: "mq-opt-label" },
          React.createElement(Md, { text: display.label })
        ),
        display.recommended && React.createElement("span", { className: "mq-badge" }, t("badge.recommended")),
        props.description !== void 0 && React.createElement(
          "span",
          { className: "mq-opt-desc" },
          React.createElement(Md, { text: props.description })
        )
      )
    )
  );
}
function QuestionBody(props) {
  const t = useText();
  const q = props.q;
  const d = props.d;
  const disabled = props.disabled;
  const { options, isBool, isCompare, isOpen } = describeQuestion(q);
  if (isBool) {
    return React.createElement(
      "div",
      { className: "mq-options" },
      BOOL_CHOICES.map(
        (choice) => React.createElement(OptionRow, {
          key: choice.value,
          radio: true,
          label: t(choice.key),
          on: d.picked[0] === choice.value,
          multi: false,
          disabled,
          onChoose: () => props.onBool(choice.value)
        })
      )
    );
  }
  if (isCompare) {
    return React.createElement(
      "div",
      { className: "mq-compare" },
      ["left", "right"].map((side) => {
        const item = q.compare && q.compare[side] || {};
        const on = d.picked[0] === side;
        return React.createElement(
          "button",
          {
            type: "button",
            key: side,
            className: "mq-compare-block",
            "data-on": on || void 0,
            disabled,
            onClick: () => props.onCompare(side)
          },
          React.createElement(
            "span",
            { className: "mq-compare-title" },
            React.createElement(Mark, { index: side === "left" ? 1 : 2 }),
            React.createElement(Md, {
              text: item.title ? item.title : t(side === "left" ? "compare.left" : "compare.right")
            })
          ),
          item.text !== void 0 && React.createElement(
            "span",
            { className: "mq-compare-text" },
            React.createElement(Md, { text: item.text })
          )
        );
      })
    );
  }
  if (isOpen) {
    return React.createElement("textarea", {
      className: "mq-custom-textarea",
      placeholder: t("placeholder.open"),
      rows: 2,
      value: d.custom,
      disabled,
      onChange: (event) => props.onCustom(event.target.value)
    });
  }
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "div",
      { className: "mq-options" },
      options.map(
        (opt, oi) => React.createElement(OptionRow, {
          key: String(oi),
          index: oi,
          label: opt.label,
          description: opt.description,
          on: d.picked.includes(oi),
          multi: q.multi_select === true,
          disabled,
          onChoose: () => props.onChoose(oi)
        })
      ),
      React.createElement(
        "div",
        { className: "mq-custom-row" + (d.custom.trim() !== "" ? " mq-on" : "") },
        React.createElement(
          "span",
          { className: "mq-mark mq-num" },
          React.createElement(IconEditOutline16, { size: 12 })
        ),
        React.createElement("input", {
          type: "text",
          className: "mq-custom-input",
          placeholder: t("placeholder.custom"),
          value: d.custom,
          disabled,
          onChange: (event) => props.onCustom(event.target.value)
        })
      )
    )
  );
}

// src/net.js
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

// src/model.js
function useQuestionnaire(block, questions) {
  const t = useText();
  const blankDrafts = () => questions.map(() => BLANK_DRAFT);
  const [drafts, setDrafts] = React.useState(blankDrafts);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [closed, setClosed] = React.useState(false);
  React.useEffect(() => {
    setDrafts(blankDrafts());
    setSubmitting(false);
    setSubmitted(false);
    setError(null);
    setClosed(false);
  }, [block.callId]);
  const draftsFor = (current) => questions.map((_, i) => current[i] ?? BLANK_DRAFT);
  const updateDraft = (index, change) => {
    if (submitting || submitted) return;
    setDrafts((current) => {
      const next = draftsFor(current);
      next[index] = change(next[index], questions[index]);
      return next;
    });
  };
  const answeredCount = draftsFor(drafts).filter(
    (d) => !d.skipped && (d.picked.length > 0 || d.custom.trim() !== "")
  ).length;
  const choose = (index, optionIndex) => updateDraft(index, (d, q) => {
    if (q.multi_select !== true) return { ...d, picked: [optionIndex], skipped: false };
    const picked = d.picked.includes(optionIndex) ? d.picked.filter((item) => item !== optionIndex) : [...d.picked, optionIndex].sort((a, b) => a - b);
    return { ...d, picked, skipped: false };
  });
  const pickValue = (index, value) => updateDraft(index, (d) => ({ ...d, picked: [value], skipped: false }));
  const setCustom = (index, value) => updateDraft(index, (d) => ({ ...d, custom: value, skipped: false }));
  const toggleSkip = (index) => updateDraft(index, (d) => ({ ...d, skipped: !d.skipped, picked: [], custom: "" }));
  const submit = async () => {
    if (submitting || submitted) return;
    setSubmitting(true);
    setError(null);
    try {
      const answers = questions.map((q, i) => {
        const d = drafts[i] || BLANK_DRAFT;
        if (d.skipped) return { id: q.id, selected: [], skipped: true };
        const custom = (d.custom || "").trim();
        const selected = pickedToSelected(q, d.picked);
        return {
          id: q.id,
          selected: custom === "" || q.multi_select === true ? selected : [],
          ...custom === "" ? {} : { custom }
        };
      });
      const res = await postRoute("/api/dsh-survey/submit", { callId: block.callId, answers });
      if (res && res.ok === true) {
        setSubmitted(true);
      } else {
        setError(res && res.error || t("error.submit"));
        setSubmitting(false);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
      setSubmitting(false);
    }
  };
  const cancel = async () => {
    if (closed || submitting || submitted) return;
    setClosed(true);
    setError(null);
    try {
      const res = await postRoute("/api/dsh-survey/cancel", { callId: block.callId });
      if (!res || res.ok !== true) {
        setClosed(false);
        setError(res && res.error || t("error.close"));
      }
    } catch (cause) {
      setClosed(false);
      setError(cause instanceof Error ? cause.message : String(cause));
    }
  };
  return {
    drafts,
    setDrafts,
    submitting,
    submitted,
    error,
    closed,
    answeredCount,
    choose,
    setBool: pickValue,
    setCompare: pickValue,
    setCustom,
    toggleSkip,
    submit,
    cancel
  };
}
function useOverlayDismiss(active, cardRef, onDismiss) {
  const dismiss = React.useRef(onDismiss);
  dismiss.current = onDismiss;
  React.useEffect(() => {
    if (!active) return void 0;
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      dismiss.current();
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [active]);
  React.useEffect(() => {
    if (!active) return;
    const node = cardRef.current;
    if (node !== null && node !== void 0 && typeof node.focus === "function") {
      node.focus({ preventScroll: true });
    }
  }, [active]);
  const onCardKeyDown = (event) => {
    if (!active || event.key !== "Tab") return;
    const node = cardRef.current;
    if (node === null || node === void 0) return;
    const focusable = node.querySelectorAll(
      'button:not(:disabled), textarea:not(:disabled), input:not(:disabled), [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };
  const onBackdropClick = (event) => {
    if (!active || event.target !== event.currentTarget) return;
    dismiss.current();
  };
  return { onCardKeyDown, onBackdropClick };
}

// src/modes/survey.js
function SurveyCard({ block, questions, mode }) {
  const t = useText();
  const isWide = mode === "overlay";
  const cardRef = React.useRef(null);
  const model = useQuestionnaire(block, questions);
  const overlay = useOverlayDismiss(isWide && !model.closed, cardRef, model.cancel);
  if (model.closed) {
    return React.createElement(SettledCard, { textKey: "settled.closed" });
  }
  return React.createElement(
    "div",
    {
      className: "mq-frame" + (isWide ? " mq-wide" : ""),
      onClick: isWide ? overlay.onBackdropClick : void 0
    },
    React.createElement(
      "section",
      {
        className: "mq-card",
        ref: cardRef,
        tabIndex: isWide ? -1 : void 0,
        role: isWide ? "dialog" : void 0,
        "aria-modal": isWide ? true : void 0,
        onKeyDown: isWide ? overlay.onCardKeyDown : void 0
      },
      React.createElement(
        "header",
        { className: "mq-header" },
        React.createElement(
          "div",
          { className: "mq-heading" },
          React.createElement(
            "div",
            { className: "mq-eyebrow" },
            t("eyebrow.survey", { count: questions.length })
          ),
          React.createElement("h2", { className: "mq-title" }, t("title.survey"))
        ),
        React.createElement(
          "button",
          {
            type: "button",
            className: "mq-close",
            title: t("action.close"),
            "aria-label": t("action.close"),
            disabled: model.submitting || model.submitted,
            onClick: model.cancel
          },
          React.createElement(IconCloseOutline16, null)
        )
      ),
      React.createElement(
        "div",
        { className: "mq-body" },
        questions.map((q, index) => {
          const d = model.drafts[index] || BLANK_DRAFT;
          const typeLabel = t(describeQuestion(q).typeKey);
          const bodyDisabled = model.submitting || model.submitted || d.skipped;
          return React.createElement(
            "div",
            {
              className: "mq-question" + (d.skipped ? " mq-skipped" : ""),
              key: q.id || String(index)
            },
            React.createElement(
              "div",
              { className: "mq-qtop" },
              React.createElement(
                "div",
                { className: "mq-qtop-left" },
                React.createElement(
                  "div",
                  { className: "mq-qheader" },
                  React.createElement("span", { className: "mq-qindex" }, String(index + 1)),
                  q.header !== void 0 && React.createElement(Md, { text: q.header })
                )
              ),
              React.createElement(
                "div",
                { className: "mq-qtop-right" },
                React.createElement("span", { className: "mq-type" }, typeLabel),
                d.skipped && React.createElement("span", { className: "mq-skipped-tag" }, t("tag.skipped")),
                React.createElement(
                  "button",
                  {
                    type: "button",
                    className: "mq-skip",
                    title: t(d.skipped ? "action.restore" : "action.skip"),
                    "aria-label": t(d.skipped ? "action.restore" : "action.skip"),
                    disabled: model.submitting || model.submitted,
                    onClick: () => model.toggleSkip(index)
                  },
                  t(d.skipped ? "action.restore" : "action.skip")
                )
              )
            ),
            React.createElement(
              "div",
              { className: "mq-qtext" },
              React.createElement(Md, { text: String(q.question) })
            ),
            React.createElement(QuestionBody, {
              q,
              d,
              disabled: bodyDisabled,
              onChoose: (label) => model.choose(index, label),
              onBool: (value) => model.setBool(index, value),
              onCompare: (side) => model.setCompare(index, side),
              onCustom: (value) => model.setCustom(index, value)
            })
          );
        })
      ),
      React.createElement(
        "footer",
        { className: "mq-footer" },
        React.createElement(
          "div",
          { className: "mq-progress" },
          model.error ? React.createElement("span", { className: "mq-error" }, String(model.error)) : React.createElement(
            "span",
            null,
            t("progress.prefix"),
            React.createElement("b", null, String(model.answeredCount)),
            t("progress.suffix", { count: questions.length }),
            React.createElement(
              "span",
              { className: "mq-meter", "aria-hidden": true },
              React.createElement("i", {
                style: {
                  width: Math.round(model.answeredCount / Math.max(questions.length, 1) * 100) + "%"
                }
              })
            )
          )
        ),
        React.createElement(
          Button,
          {
            variant: "primary",
            disabled: model.submitting || model.submitted || questions.length === 0,
            onClick: model.submit
          },
          t(model.submitted ? "submit.done" : model.submitting ? "submit.pending" : "submit.all")
        )
      )
    )
  );
}

// src/modes/compact.js
function CompactCard({ block, questions }) {
  const t = useText();
  const q = questions[0] || { id: "q", question: "" };
  const model = useQuestionnaire(block, questions);
  const d = model.drafts[0] || BLANK_DRAFT;
  if (model.closed) {
    return React.createElement(SettledCard, { textKey: "settled.closedShort" });
  }
  const typeLabel = t(describeQuestion(q).typeKey);
  return React.createElement(
    "div",
    { className: "mq-frame" },
    React.createElement(
      "section",
      { className: "mq-card mq-compact" },
      React.createElement(
        "div",
        { className: "mq-qtop" },
        React.createElement("div", { className: "mq-qtop-left" }),
        React.createElement(
          "div",
          { className: "mq-qtop-right" },
          React.createElement("span", { className: "mq-type" }, typeLabel)
        )
      ),
      React.createElement(
        "div",
        { className: "mq-qtext" },
        React.createElement(Md, { text: String(q.question) })
      ),
      React.createElement(QuestionBody, {
        q,
        d,
        disabled: model.submitting || model.submitted,
        onChoose: (label) => model.choose(0, label),
        onBool: (value) => model.setBool(0, value),
        onCompare: (side) => model.setCompare(0, side),
        onCustom: (value) => model.setCustom(0, value)
      }),
      React.createElement(
        "footer",
        { className: "mq-footer" },
        model.error ? React.createElement(
          "div",
          { className: "mq-progress" },
          React.createElement("span", { className: "mq-error" }, String(model.error))
        ) : null,
        React.createElement(
          Button,
          {
            variant: "primary",
            disabled: model.submitting || model.submitted,
            onClick: model.submit
          },
          t(model.submitted ? "submit.done" : model.submitting ? "submit.pending" : "submit.one")
        )
      )
    )
  );
}

// src/modes/grid.js
function GridQuestionBody(props) {
  const t = useText();
  const q = props.q;
  const d = props.d;
  const disabled = props.disabled;
  const { options, isBool, isCompare, isOpen } = describeQuestion(q);
  if (isBool) {
    return React.createElement(
      "div",
      { className: "mq-grid-bool" },
      React.createElement(
        "span",
        { className: "mq-grid-bool-switch", role: "radiogroup", "aria-label": String(q.question) },
        BOOL_CHOICES.map(
          (choice) => React.createElement(
            "button",
            {
              type: "button",
              role: "radio",
              key: choice.value,
              "aria-checked": d.picked[0] === choice.value || void 0,
              className: "mq-grid-bool-side",
              "data-on": d.picked[0] === choice.value || void 0,
              disabled,
              onClick: () => props.onBool(choice.value)
            },
            t(choice.key)
          )
        )
      )
    );
  }
  if (isCompare) {
    return React.createElement(
      "div",
      { className: "mq-grid-options" },
      ["left", "right"].map((side) => {
        const item = q.compare && q.compare[side] || {};
        const on = d.picked[0] === side;
        return React.createElement(
          "button",
          {
            type: "button",
            key: side,
            className: "mq-grid-opt",
            "data-on": on || void 0,
            disabled,
            onClick: () => props.onCompare(side)
          },
          React.createElement(Mark, { index: side === "left" ? 1 : 2 }),
          React.createElement(
            "span",
            { className: "mq-grid-opt-label" },
            React.createElement(Md, {
              text: toInlineMarkdown(
                item.title ? item.title : t(side === "left" ? "compare.left" : "compare.right")
              )
            })
          )
        );
      })
    );
  }
  return React.createElement(
    React.Fragment,
    null,
    !isOpen && React.createElement(
      "div",
      { className: "mq-grid-options" },
      options.map((opt, oi) => {
        const on = d.picked.includes(oi);
        const display = parseRecommendedLabel(stripLeadingIndex(opt.label));
        return React.createElement(
          "button",
          {
            type: "button",
            key: String(oi),
            className: "mq-grid-opt",
            "data-on": on || void 0,
            disabled,
            onClick: () => props.onChoose(oi)
          },
          React.createElement(Mark, { on, check: q.multi_select === true, index: oi + 1 }),
          React.createElement(
            "span",
            { className: "mq-grid-opt-label" },
            React.createElement(Md, { text: toInlineMarkdown(display.label) }),
            display.recommended && React.createElement("span", { className: "mq-badge" }, t("badge.recommended"))
          )
        );
      })
    ),
    React.createElement(isOpen ? "textarea" : "input", {
      className: isOpen ? "mq-grid-custom mq-open" : "mq-grid-custom",
      placeholder: t(isOpen ? "placeholder.gridOpen" : "placeholder.gridCustom"),
      rows: isOpen ? 2 : void 0,
      value: d.custom,
      disabled,
      onChange: (event) => props.onCustom(event.target.value)
    })
  );
}
function GridCard({ block, questions }) {
  const t = useText();
  const cardRef = React.useRef(null);
  const model = useQuestionnaire(block, questions);
  const overlay = useOverlayDismiss(!model.closed, cardRef, model.cancel);
  if (model.closed) {
    return React.createElement(SettledCard, { textKey: "settled.closed" });
  }
  return React.createElement(
    "div",
    {
      className: "mq-frame mq-wide",
      onClick: overlay.onBackdropClick
    },
    React.createElement(
      "section",
      {
        className: "mq-card",
        ref: cardRef,
        tabIndex: -1,
        role: "dialog",
        "aria-modal": true,
        onKeyDown: overlay.onCardKeyDown
      },
      React.createElement(
        "header",
        { className: "mq-header" },
        React.createElement(
          "div",
          { className: "mq-heading" },
          React.createElement(
            "div",
            { className: "mq-eyebrow" },
            t("eyebrow.grid", { count: questions.length })
          ),
          React.createElement("h2", { className: "mq-title" }, t("title.grid"))
        ),
        React.createElement(
          "button",
          {
            type: "button",
            className: "mq-close",
            title: t("action.close"),
            "aria-label": t("action.close"),
            disabled: model.submitting || model.submitted,
            onClick: model.cancel
          },
          React.createElement(IconCloseOutline16, null)
        )
      ),
      React.createElement(
        "div",
        { className: "mq-grid-body" },
        questions.map((q, index) => {
          const d = model.drafts[index] || BLANK_DRAFT;
          const bodyDisabled = model.submitting || model.submitted || d.skipped;
          return React.createElement(
            "div",
            {
              className: "mq-grid-item" + (d.skipped ? " mq-skipped" : ""),
              key: q.id || String(index)
            },
            React.createElement(
              "div",
              { className: "mq-grid-qtext" },
              React.createElement("span", { className: "mq-grid-qindex" }, String(index + 1) + "."),
              React.createElement(Md, { text: toInlineMarkdown(q.question) }),
              React.createElement(
                "button",
                {
                  type: "button",
                  className: "mq-grid-skip",
                  title: t(d.skipped ? "action.restore" : "action.skip"),
                  "aria-label": t(d.skipped ? "action.restore" : "action.skip"),
                  disabled: model.submitting || model.submitted,
                  onClick: () => model.toggleSkip(index)
                },
                d.skipped ? "\u21BA" : "\u2715"
              )
            ),
            React.createElement(GridQuestionBody, {
              q,
              d,
              disabled: bodyDisabled,
              onChoose: (label) => model.choose(index, label),
              onBool: (value) => model.setBool(index, value),
              onCompare: (side) => model.setCompare(index, side),
              onCustom: (value) => model.setCustom(index, value)
            })
          );
        })
      ),
      React.createElement(
        "footer",
        { className: "mq-grid-footer" },
        React.createElement(
          "div",
          { className: "mq-grid-progress" },
          model.error ? React.createElement("span", { className: "mq-error" }, String(model.error)) : React.createElement(
            "span",
            null,
            t("progress.prefix"),
            React.createElement("b", null, String(model.answeredCount)),
            t("progress.suffix", { count: questions.length })
          )
        ),
        React.createElement(
          Button,
          {
            variant: "primary",
            disabled: model.submitting || model.submitted || questions.length === 0,
            onClick: model.submit
          },
          t(model.submitted ? "submit.done" : model.submitting ? "submit.pending" : "submit.all")
        )
      )
    )
  );
}

// src/pending.js
var POLL_MS = 5e3;
var sessionsFace = null;
function setSessionsFace(sessions) {
  sessionsFace = sessions;
}
async function fetchPending() {
  try {
    const res = await fetch("/api/dsh-survey/pending", { method: "GET" });
    const data = await res.json();
    if (data === null || typeof data !== "object" || data.ok !== true) return [];
    return Array.isArray(data.surveys) ? data.surveys : [];
  } catch (error) {
    return null;
  }
}
function asWaiting(surveys) {
  return surveys.filter((s) => s !== null && typeof s === "object");
}
function canFeed(sessions) {
  return sessions !== null && sessions !== void 0 && typeof sessions.handleMuxEnvelope === "function";
}
function frameIdOf(callId) {
  return `dsh-survey:${callId}`;
}
function currentSessionId(sessions) {
  try {
    const list = sessions && sessions.list;
    if (list === void 0 || list === null || typeof list.getSnapshot !== "function")
      return void 0;
    const snapshot = list.getSnapshot();
    return snapshot && typeof snapshot.current === "string" ? snapshot.current : void 0;
  } catch (error) {
    return void 0;
  }
}
function feedRequested(sessions, survey) {
  const callId = survey.callId;
  const sessionId = survey.sessionId;
  if (typeof callId !== "string" || typeof sessionId !== "string") return;
  try {
    sessions.handleMuxEnvelope({
      rpcId: frameIdOf(callId),
      payload: {
        type: "question/requested",
        sessionId,
        questions: [{ id: callId, question: "" }]
      }
    });
  } catch (error) {
  }
}
function feedResolved(sessions, survey) {
  const callId = survey.callId;
  const sessionId = survey.sessionId;
  if (typeof callId !== "string" || typeof sessionId !== "string") return;
  try {
    sessions.handleMuxEnvelope({
      rpcId: frameIdOf(callId),
      payload: {
        type: "question/resolved",
        sessionId,
        questionRpcId: frameIdOf(callId),
        outcome: "answered"
      }
    });
  } catch (error) {
  }
}
function startPendingSync() {
  let prev = /* @__PURE__ */ new Map();
  const refresh = async () => {
    if (!canFeed(sessionsFace)) return;
    const list = await fetchPending();
    if (list === null) return;
    const waiting = asWaiting(list);
    const current = new Map(waiting.map((s) => [s.callId, s]));
    const open = currentSessionId(sessionsFace);
    for (const [callId, survey] of prev) {
      if (!current.has(callId) || survey.sessionId === open) feedResolved(sessionsFace, survey);
    }
    for (const survey of current.values()) {
      if (survey.sessionId === open) continue;
      feedRequested(sessionsFace, survey);
    }
    prev = current;
  };
  refresh();
  const timer = setInterval(refresh, POLL_MS);
  const onVisible = () => {
    if (document.visibilityState === "visible") refresh();
  };
  document.addEventListener("visibilitychange", onVisible);
  let unsubscribe = null;
  try {
    const list = sessionsFace && sessionsFace.list;
    if (list !== void 0 && list !== null && typeof list.subscribe === "function") {
      unsubscribe = list.subscribe(() => refresh());
    }
  } catch (error) {
    unsubscribe = null;
  }
  return () => {
    clearInterval(timer);
    document.removeEventListener("visibilitychange", onVisible);
    if (unsubscribe !== null) unsubscribe();
  };
}

// src/index.js
bindRuntime(require);
var name = "dsh-survey";
var inject = ["slots"];
function SurveyRoot(props) {
  const block = props.block;
  if (block.kind === "tool-result") {
    return React.createElement(RecapCard, { block });
  }
  const call = parseCall(block);
  const questions = call.questions;
  let mode = "inline";
  if (call.mode === "compact" || call.mode === "inline" || call.mode === "overlay" || call.mode === "grid")
    mode = call.mode;
  if (mode === "compact" && questions.length > 1) mode = "inline";
  if (mode === "compact") return React.createElement(CompactCard, { block, questions });
  if (mode === "grid") return React.createElement(GridCard, { block, questions });
  return React.createElement(SurveyCard, { block, questions, mode });
}
function apply(ctx) {
  injectCss();
  const locale = ctx.get("locale");
  if (locale !== void 0 && locale !== null && typeof locale.subscribe === "function") {
    setLocaleFace({
      subscribe: (listener) => locale.subscribe(listener),
      getSnapshot: () => locale.getSnapshot()
    });
  }
  const sessions = ctx.get("sessions");
  if (sessions !== void 0 && sessions !== null && typeof sessions.handleMuxEnvelope === "function") {
    setSessionsFace(sessions);
  }
  const slots = ctx.get("slots");
  if (slots === void 0) return;
  const disposers = [];
  disposers.push(
    ctx.slots.inject(
      "tool.call.toolview",
      () => ctx.slots.register({ name: "tool.call.toolview", key: "do_a_survey" }, SurveyRoot)
    )
  );
  if (typeof sessions !== "undefined" && sessions !== null && typeof sessions.handleMuxEnvelope === "function") {
    disposers.push(startPendingSync());
  }
  return () => {
    for (const dispose of disposers) dispose();
  };
}
		return module.exports;
	}
});
//# sourceMappingURL=client.js.map
