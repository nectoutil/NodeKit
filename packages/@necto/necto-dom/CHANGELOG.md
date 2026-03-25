# @necto/dom

## 1.6.10

### Patch Changes

- Return undefined instead of throwing in SSR environments for getOwnerDocument/getOwnerWindow

## 1.6.9

### Patch Changes

- Guard all bare document references with typeof checks for SSR safety

## 1.6.8

### Patch Changes

- Fix workspace dependency resolution - republish with proper workspace:\* replacement
- Republish with proper workspace:\* replacement via pnpm pack

## 1.6.7

### Patch Changes

- Make getActiveElement SSR-safe by guarding against missing document

## 1.6.6

### Patch Changes

- Updated dependencies
  - @necto/types@1.3.1

## 1.6.5

### Patch Changes

- Updated dependencies
  - @necto/platform@1.5.1

## 1.6.4

### Patch Changes

- Updated dependencies
  - @necto/constants@1.4.4

## 1.6.3

### Patch Changes

- Lazy-initialize ARIA props map to fix circular chunk initialization

## 1.6.2

### Patch Changes

- Lazy-initialize HTML tag maps to fix circular chunk initialization in bundlers

## 1.6.1

### Patch Changes

- Updated dependencies
  - @necto/platform@1.5.0

## 1.6.0

### Minor Changes

- Fix workspace dependency resolution in published package

## 1.5.0

### Minor Changes

- d6ea5b7: Added new changes

## 1.4.5

### Patch Changes

- Updated dependencies [e5ea15f]
  - @necto/constants@1.4.3

## 1.4.4

### Patch Changes

- 73fdf60: Fixed GitLab button color and added minor fixes to dom package

## 1.4.3

### Patch Changes

- 232695d: Attempted to resolve commonjs errors

## 1.4.2

### Patch Changes

- f39c992: Added minor fixes
- Updated dependencies [f39c992]
  - @necto/constants@1.4.2

## 1.4.1

### Patch Changes

- faedceb: Added minor fixes
- Updated dependencies [faedceb]
  - @necto/constants@1.4.1

## 1.4.0

### Minor Changes

- 3bd0ef2: Update backlog

### Patch Changes

- Updated dependencies [3bd0ef2]
  - @necto/platform@1.4.0
  - @necto/types@1.3.0

## 1.3.0

### Minor Changes

- 3f3a40e: Update backlog

### Patch Changes

- Updated dependencies [3f3a40e]
  - @necto/platform@1.3.0
  - @necto/types@1.2.0

## 1.2.0

### Minor Changes

- 343fcae: Added new release as default

### Patch Changes

- Updated dependencies [343fcae]
  - @necto/platform@1.2.0
  - @necto/types@1.1.0

## 1.1.0

### Minor Changes

- Added new packages
