# @necto-react/popper

## 0.6.0

### Minor Changes

- f4f3a19: Fixed some style errors

## 0.5.2

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
  - @necto-react/hooks@2.14.17
  - @necto/popper@0.5.1

## 0.5.1

### Patch Changes

- @necto-react/state@0.2.1

## 0.5.0

### Minor Changes

- b53176e: Added leftover changes

### Patch Changes

- Updated dependencies [b53176e]
  - @necto-react/state@0.2.0
  - @necto/popper@0.5.0

## 0.4.0

### Minor Changes

- d003ea7: Updated minor api erros and added some small features

### Patch Changes

- Updated dependencies [d003ea7]
  - @necto-react/state@0.1.0
  - @necto/popper@0.4.0

## 0.3.11

### Patch Changes

- Updated dependencies
  - @necto-react/hooks@2.14.13

## 0.3.10

### Patch Changes

- Updated dependencies
  - @necto/dom@1.6.10
  - @necto-react/hooks@2.14.12
  - @necto/popper@0.3.9

## 0.3.9

### Patch Changes

- Updated dependencies
  - @necto/dom@1.6.9
  - @necto-react/hooks@2.14.11
  - @necto/popper@0.3.8

## 0.3.8

### Patch Changes

- Fix workspace dependency resolution - republish with proper workspace:\* replacement
- Updated dependencies
- Updated dependencies
  - @necto/dom@1.6.8
  - @necto/popper@0.3.7
  - @necto-react/hooks@2.14.10

## 0.3.7

### Patch Changes

- Updated dependencies
  - @necto/dom@1.6.7
  - @necto-react/hooks@2.14.9
  - @necto/popper@0.3.6

## 0.3.6

### Patch Changes

- Updated dependencies
  - @necto-react/hooks@2.14.8

## 0.3.5

### Patch Changes

- Updated dependencies
  - @necto/types@1.3.1
  - @necto-react/hooks@2.14.7
  - @necto/dom@1.6.6
  - @necto/popper@0.3.5

## 0.3.4

### Patch Changes

- Updated dependencies
  - @necto-react/types@2.4.1
  - @necto-react/hooks@2.14.6
  - @necto/dom@1.6.5
  - @necto/popper@0.3.4

## 0.3.3

### Patch Changes

- @necto/dom@1.6.4
- @necto/popper@0.3.3
- @necto-react/hooks@2.14.5

## 0.3.2

### Patch Changes

- Updated dependencies
  - @necto/dom@1.6.3
  - @necto-react/hooks@2.14.4
  - @necto/popper@0.3.2

## 0.3.1

### Patch Changes

- Updated dependencies
  - @necto/dom@1.6.2
  - @necto-react/hooks@2.14.3
  - @necto/popper@0.3.1

## 0.3.0

### Minor Changes

- Fix workspace dependency resolution in published packages

### Patch Changes

- Updated dependencies
  - @necto/popper@0.3.0

## 0.2.5

### Patch Changes

- Updated dependencies
  - @necto-react/hooks@2.14.2

## 0.2.4

### Patch Changes

- @necto-react/hooks@2.14.1
- @necto/dom@1.6.1
- @necto/popper@0.2.2

## 0.2.3

### Patch Changes

- Updated dependencies
  - @necto-react/hooks@2.14.0

## 0.2.2

### Patch Changes

- @necto-react/hooks@2.13.2

## 0.2.1

### Patch Changes

- Updated dependencies
  - @necto/dom@1.6.0
  - @necto-react/hooks@2.13.1
  - @necto/popper@0.2.1

## 0.2.0

### Minor Changes

- d6ea5b7: Added new changes

### Patch Changes

- Updated dependencies [d6ea5b7]
  - @necto-react/hooks@2.13.0
  - @necto-react/types@2.4.0
  - @necto/dom@1.5.0
  - @necto/popper@0.2.0

## 0.1.0

### Minor Changes

- 97a590e: Added new changes

### Patch Changes

- Updated dependencies [97a590e]
  - @necto/popper@0.1.0
  - @necto-react/hooks@2.12.7
