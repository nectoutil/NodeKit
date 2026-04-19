---
"@necto-react/components": major
"@necto/strings": minor
---

**Breaking:** Remove Emotion `css` prop from `ButtonProps` and `Primitive`. The `css` prop and `@emotion/react` dependency have been removed entirely; styling now uses `@emotion/styled` exclusively.

**Breaking:** Remove `jsxImportSource: "@emotion/react"` from tsconfig — the global `css` prop on JSX elements is no longer available.

Internally, `Box` and `ShadowBevel` have been migrated from SCSS modules to `@emotion/styled`, allowing the entire SCSS/PostCSS build pipeline to be removed. `Primitive` now uses `createElement` directly and lazily builds its tag-component map via a plain `for...of` loop.

**New:** `capitalize` added to `@necto/strings` — uppercases the first character of a string, empty-string safe.
