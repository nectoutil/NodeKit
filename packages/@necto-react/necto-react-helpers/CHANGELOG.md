# @necto-react/helpers

## 2.6.16

### Patch Changes

- Updated dependencies [f9ea3f5]
  - @necto/dom@1.9.2

## 2.6.15

### Patch Changes

- Updated dependencies [18140db]
  - @necto/dom@1.9.1

## 2.6.14

### Patch Changes

- Updated dependencies [595c9b6]
  - @necto/dom@1.9.0

## 2.6.13

### Patch Changes

- Updated dependencies [b3ee3bc]
  - @necto/dom@1.8.0

## 2.6.12

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

## 2.6.10

### Patch Changes

- Updated dependencies
  - @necto/dom@1.6.10

## 2.6.9

### Patch Changes

- Updated dependencies
  - @necto/dom@1.6.9

## 2.6.8

### Patch Changes

- Fix workspace dependency resolution - republish with proper workspace:\* replacement
- Republish with proper workspace:\* replacement via pnpm pack
- Updated dependencies
- Updated dependencies
  - @necto/dom@1.6.8

## 2.6.7

### Patch Changes

- Updated dependencies
  - @necto/dom@1.6.7

## 2.6.6

### Patch Changes

- @necto/dom@1.6.6

## 2.6.5

### Patch Changes

- Add type: module and exports field for proper ESM resolution in Vite
- Updated dependencies
  - @necto-react/types@2.4.1
  - @necto/platform@1.5.1
  - @necto/dom@1.6.5

## 2.6.4

### Patch Changes

- @necto/dom@1.6.4

## 2.6.3

### Patch Changes

- Updated dependencies
  - @necto/dom@1.6.3

## 2.6.2

### Patch Changes

- Updated dependencies
  - @necto/dom@1.6.2

## 2.6.1

### Patch Changes

- Updated dependencies
  - @necto/platform@1.5.0
  - @necto/dom@1.6.1

## 2.6.0

### Minor Changes

- Fix workspace dependency resolution in published package

## 2.5.1

### Patch Changes

- Updated dependencies
  - @necto/dom@1.6.0

## 2.5.0

### Minor Changes

- d6ea5b7: Added new changes

### Patch Changes

- Updated dependencies [d6ea5b7]
  - @necto-react/types@2.4.0
  - @necto/dom@1.5.0

## 2.4.5

### Patch Changes

- @necto/dom@1.4.5

## 2.4.4

### Patch Changes

- Updated dependencies [73fdf60]
  - @necto/dom@1.4.4

## 2.4.3

### Patch Changes

- Updated dependencies [232695d]
  - @necto/dom@1.4.3

## 2.4.2

### Patch Changes

- Updated dependencies [f39c992]
  - @necto/dom@1.4.2

## 2.4.1

### Patch Changes

- Updated dependencies [faedceb]
  - @necto/dom@1.4.1

## 2.4.0

### Minor Changes

- 3bd0ef2: Update backlog

### Patch Changes

- Updated dependencies [3bd0ef2]
  - @necto-react/types@2.3.0
  - @necto/dom@1.4.0
  - @necto/platform@1.4.0

## 2.3.0

### Minor Changes

- 3f3a40e: Update backlog

### Patch Changes

- Updated dependencies [3f3a40e]
  - @necto-react/types@2.2.0
  - @necto/dom@1.3.0
  - @necto/platform@1.3.0

## 2.2.0

### Minor Changes

- 343fcae: Added new release as default

### Patch Changes

- Updated dependencies [343fcae]
  - @necto-react/types@2.1.0
  - @necto/dom@1.2.0
  - @necto/platform@1.2.0

## 2.1.0

### Minor Changes

- Added new hooks and a new platforms package

### Patch Changes

- Updated dependencies
  - @necto/platform@1.1.0
