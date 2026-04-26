# @necto/strings

## 1.9.2

### Patch Changes

- ad6a4aa: Fix TypeScript imports broken in previous releases due to hashed `.d.ts` filenames.

  Previous releases shipped `dist/index-{hash}.d.ts` and `dist/index-{hash}.d.cts` while
  `package.json` `types` and `exports.types` pointed at `dist/index.d.ts` — causing
  `TS2306` / `TS2307` errors in any consumer importing types. Root cause was a bug in
  `rolldown-plugin-dts@0.13.x` (transitive of `tsdown@0.12.x`) where entry chunks fell
  through to the hashed-filename template instead of the flat one.

  Resolved by bumping `tsdown` to `^0.21.10` (which pulls `rolldown-plugin-dts@^0.23.x`
  containing the fix from sxzz/rolldown-plugin-dts#132). Build now produces flat
  `dist/index.d.ts` and `dist/index.d.cts`, restoring type resolution for all consumers.

- Updated dependencies [ad6a4aa]
  - @necto/constants@2.0.1

## 1.9.1

### Patch Changes

- Updated dependencies [023e73e]
  - @necto/constants@2.0.0

## 1.9.0

### Minor Changes

- 36723b4: **Breaking:** Remove Emotion `css` prop from `ButtonProps` and `Primitive`. The `css` prop and `@emotion/react` dependency have been removed entirely; styling now uses `@emotion/styled` exclusively.

  **Breaking:** Remove `jsxImportSource: "@emotion/react"` from tsconfig — the global `css` prop on JSX elements is no longer available.

  Internally, `Box` and `ShadowBevel` have been migrated from SCSS modules to `@emotion/styled`, allowing the entire SCSS/PostCSS build pipeline (`sass`, `sass-embedded`, `postcss`, `postcss-modules`, `esbuild-sass-plugin`) to be removed.

  **New:** `capitalize` added to `@necto/strings` — uppercases the first character of a string, empty-string safe.

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
