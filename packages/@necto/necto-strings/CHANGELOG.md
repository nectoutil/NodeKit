# @necto/strings

## 1.8.0

### Minor Changes

- 0284395: **Breaking:** Remove Emotion `css` prop from `ButtonProps` and `Primitive`. The `css` prop and `@emotion/react` dependency have been removed entirely; styling now uses `@emotion/styled` exclusively.

  **Breaking:** Remove `jsxImportSource: "@emotion/react"` from tsconfig — the global `css` prop on JSX elements is no longer available.

  Internally, `Box` and `ShadowBevel` have been migrated from SCSS modules to `@emotion/styled`, allowing the entire SCSS/PostCSS build pipeline to be removed. `Primitive` now uses `createElement` directly and lazily builds its tag-component map via a plain `for...of` loop.

  **New:** `capitalize` added to `@necto/strings` — uppercases the first character of a string, empty-string safe.

## 1.6.1

### Patch Changes

- Add type: module and exports field for proper ESM resolution in Vite

## 1.6.0

### Minor Changes

- d6ea5b7: Added new changes

## 1.5.0

### Minor Changes

- 97a590e: Added new changes

## 1.4.0

### Minor Changes

- 3bd0ef2: Update backlog

## 1.3.0

### Minor Changes

- 3f3a40e: Update backlog

## 1.2.0

### Minor Changes

- 343fcae: Added new release as default

## 1.1.0

### Minor Changes

- Added new pkg
