---
"@necto/dom": patch
"@necto-react/hooks": patch
"@necto-react/components": patch
"@necto-react/helpers": patch
"@necto-react/popper": patch
"@necto/image": patch
"@necto/popper": patch
---

Fix SSR compatibility: guard all `document` and `window` references with `typeof` checks to prevent `ReferenceError: document is not defined` during server-side rendering.

- `getOwnerDocument` returns `null` instead of crashing when `document` is undefined
- `getOwnerWindow` returns `null` instead of crashing when `window` is undefined
- `getActiveElement` returns `null` in SSR environments
- `supportsPreventScroll` returns `false` in SSR without accessing `document`
- `focusWithoutScrolling` guards `document.scrollingElement` access
- `getContainmentRect` returns zero rect in SSR
- `createStyleElement` returns early in SSR
- Merged `focusWithoutScrolling` and `getScrollableElements` into a single function
- Changed barrel exports to use `export *` for all modules
