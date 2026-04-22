---
'@necto-react/hooks': patch
---

Fix `TypeError: Attempted to assign to readonly property` in `useFocusVisibleListener` on WebKit (Safari, Playwright's `webkit` browser) when the package is loaded as native ESM under strict mode.

The focus-tracking setup was monkey-patching `HTMLElement.prototype.focus` with direct assignment (`prototype.focus = fn`). That method is defined as `writable: false` in the DOM spec, so assignment throws in strict mode. V8 (Chrome) and SpiderMonkey (Firefox) silently ignored the violation, but JSC (WebKit) enforces it — the bug was latent until a toolchain change surfaced it (e.g. Vite 8 / Rolldown preserving strict-mode boundaries more faithfully than Vite 6 / esbuild).

Replaced with `Object.defineProperty(..., { value, writable: true, configurable: true })`, which is the spec-sanctioned way to override a non-writable-but-configurable native method and works identically on all engines. Runtime behavior of the hook is unchanged.
