# @necto/popper

## 0.5.11

### Patch Changes

- Updated dependencies [d435091]
  - @necto/types@1.4.0
  - @necto/dom@1.11.2

## 0.5.10

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
  - @necto/dom@1.11.1
  - @necto/types@1.3.2

## 0.5.9

### Patch Changes

- Updated dependencies [8dd30b3]
  - @necto/dom@1.11.0

## 0.5.8

### Patch Changes

- Updated dependencies [023e73e]
  - @necto/constants@2.0.0
  - @necto/dom@1.10.1

## 0.5.7

### Patch Changes

- Updated dependencies [70f03f1]
  - @necto/dom@1.10.0

## 0.5.6

### Patch Changes

- 7133d0e: feat: pixel-perfect arrow positioning using arrow middleware

  - **@necto-react/popper**: Rewrote PopperArrow to match Radix's approach — outer span handles positioning and rotation via transforms, inner element renders the SVG. Single polygon with CSS rotation per side. Arrow middleware ref on the span for correct measurement.
  - **@necto/popper**: Fixed arrow middleware to use `offsetWidth` for cross-axis measurement. Fixed flip middleware to use actual positioned coordinates for overflow detection.

## 0.5.5

### Patch Changes

- Updated dependencies [f9ea3f5]
  - @necto/dom@1.9.2

## 0.5.4

### Patch Changes

- Updated dependencies [18140db]
  - @necto/dom@1.9.1

## 0.5.3

### Patch Changes

- Updated dependencies [595c9b6]
  - @necto/dom@1.9.0

## 0.5.2

### Patch Changes

- Updated dependencies [b3ee3bc]
  - @necto/dom@1.8.0

## 0.5.1

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

## 0.5.0

### Minor Changes

- b53176e: Added leftover changes

## 0.4.0

### Minor Changes

- d003ea7: Updated minor api erros and added some small features

## 0.3.9

### Patch Changes

- Updated dependencies
  - @necto/dom@1.6.10

## 0.3.8

### Patch Changes

- Updated dependencies
  - @necto/dom@1.6.9

## 0.3.7

### Patch Changes

- Fix workspace dependency resolution - republish with proper workspace:\* replacement
- Updated dependencies
- Updated dependencies
  - @necto/dom@1.6.8

## 0.3.6

### Patch Changes

- Updated dependencies
  - @necto/dom@1.6.7

## 0.3.5

### Patch Changes

- Updated dependencies
  - @necto/types@1.3.1
  - @necto/dom@1.6.6

## 0.3.4

### Patch Changes

- @necto/dom@1.6.5

## 0.3.3

### Patch Changes

- Updated dependencies
  - @necto/constants@1.4.4
  - @necto/dom@1.6.4

## 0.3.2

### Patch Changes

- Updated dependencies
  - @necto/dom@1.6.3

## 0.3.1

### Patch Changes

- Updated dependencies
  - @necto/dom@1.6.2

## 0.3.0

### Minor Changes

- Fix workspace dependency resolution in published packages

## 0.2.2

### Patch Changes

- @necto/dom@1.6.1

## 0.2.1

### Patch Changes

- Updated dependencies
  - @necto/dom@1.6.0

## 0.2.0

### Minor Changes

- d6ea5b7: Added new changes

### Patch Changes

- Updated dependencies [d6ea5b7]
  - @necto/dom@1.5.0

## 0.1.0

### Minor Changes

- 97a590e: Added new changes
