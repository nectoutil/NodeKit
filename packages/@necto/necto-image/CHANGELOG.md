# @necto/image

## 1.0.22

### Patch Changes

- @necto/dom@1.11.2

## 1.0.21

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
  - @necto/dom@1.11.1
  - @necto/url@1.0.1

## 1.0.20

### Patch Changes

- Updated dependencies [8dd30b3]
  - @necto/dom@1.11.0

## 1.0.19

### Patch Changes

- @necto/dom@1.10.1

## 1.0.18

### Patch Changes

- Updated dependencies [70f03f1]
  - @necto/dom@1.10.0

## 1.0.17

### Patch Changes

- Updated dependencies [f9ea3f5]
  - @necto/dom@1.9.2

## 1.0.16

### Patch Changes

- Updated dependencies [18140db]
  - @necto/dom@1.9.1

## 1.0.15

### Patch Changes

- Updated dependencies [595c9b6]
  - @necto/dom@1.9.0

## 1.0.14

### Patch Changes

- Updated dependencies [b3ee3bc]
  - @necto/dom@1.8.0

## 1.0.13

### Patch Changes

- 40c54dc: Fix SSR compatibility: guard all `document` and `window` references with `typeof` checks to prevent `ReferenceError: document is not defined` during server-side rendering.

  - `getOwnerDocument` returns `null` instead of crashing when `document` is undefined
  - `getOwnerWindow` returns `null` instead of crashing when `window` is undefined
  - `getActiveElement` returns `null` in SSR environments
  - `supportsPreventScroll` returns `false` in SSR without accessing `document`
  - `focusWithoutScrolling` guards `document.scrollingElement` access
  - `getContainmentRect` returns zero rect in SSR
  - `createStyleElement` returns early in SSR
  - Merged `focusWithoutScrolling` and `getScrollableElements` into a single function
  - Changed barrel exports to use `export *` for all modules

- Updated dependencies [40c54dc]
  - @necto/dom@1.7.3

## 1.0.12

### Patch Changes

- Updated dependencies
  - @necto/dom@1.6.10

## 1.0.11

### Patch Changes

- Updated dependencies
  - @necto/dom@1.6.9

## 1.0.10

### Patch Changes

- Fix workspace dependency resolution - republish with proper workspace:\* replacement
- Updated dependencies
- Updated dependencies
  - @necto/dom@1.6.8

## 1.0.9

### Patch Changes

- Updated dependencies
  - @necto/dom@1.6.7

## 1.0.8

### Patch Changes

- @necto/dom@1.6.6

## 1.0.7

### Patch Changes

- @necto/dom@1.6.5

## 1.0.6

### Patch Changes

- @necto/dom@1.6.4

## 1.0.5

### Patch Changes

- Updated dependencies
  - @necto/dom@1.6.3

## 1.0.4

### Patch Changes

- Updated dependencies
  - @necto/dom@1.6.2

## 1.0.3

### Patch Changes

- @necto/dom@1.6.1

## 1.0.2

### Patch Changes

- Updated dependencies
  - @necto/dom@1.6.0

## 1.0.1

### Patch Changes

- Updated dependencies [d6ea5b7]
  - @necto/dom@1.5.0
