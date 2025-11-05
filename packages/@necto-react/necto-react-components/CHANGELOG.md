# @necto-react/components

## 1.2.14

### Patch Changes

- e5ea15f: Fixed minor errors
- Updated dependencies [e5ea15f]
  - @necto/constants@1.4.3
  - @necto/dom@1.4.5

## 1.2.13

### Patch Changes

- 73fdf60: Fixed GitLab button color and added minor fixes to dom package
- Updated dependencies [73fdf60]
  - @necto/dom@1.4.4

## 1.2.12

### Patch Changes

- 66afd61: Minor css fixes

## 1.2.11

### Patch Changes

- a269f81: Fixed errors nad migrated to React Emotions instead of Styled Components for login buttons

## 1.2.10

### Patch Changes

- 6820f8a: Added new fixes

## 1.2.9

### Patch Changes

- 5c315e2: Fixed minor errors

## 1.2.8

### Patch Changes

- de3cc23: Fixed external errors

## 1.2.7

### Patch Changes

- 232695d: Attempted to resolve commonjs errors
- Updated dependencies [232695d]
  - @necto/dom@1.4.3

## 1.2.6

### Patch Changes

- Updated dependencies [f39c992]
  - @necto/constants@1.4.2
  - @necto/dom@1.4.2

## 1.2.5

### Patch Changes

- Updated dependencies [faedceb]
  - @necto/constants@1.4.1
  - @necto/dom@1.4.1

## 1.2.4

### Patch Changes

- bb7d30a: Fix multiple TypeScript and bundler compatibility issues:

  - Remove FC type from If/Else conditional components to prevent TypeScript conflicts
  - Fix package.json exports configuration with correct entry points for ESM (index.js) and CommonJS (index.cjs)
  - Add proper exports field for Vite and modern bundler compatibility
  - Add sideEffects field for CSS handling
  - Export style.css for manual stylesheet imports

  These changes resolve "cannot be used as a JSX component" errors and Vite import resolution failures.

## 1.2.3

### Patch Changes

- ec4f3e0: Remove FC type from If and Else conditional components to prevent TypeScript conflicts with ForwardRefExoticComponent types used in social buttons.

## 1.2.2

### Patch Changes

- d855b4a: Fix social button component type annotations to resolve "cannot be used as a JSX component" errors. All button components now use explicit ForwardRefExoticComponent types instead of FC, ensuring proper TypeScript compatibility when consuming the package.

## 1.2.1

### Patch Changes

- 48ee6db: Fix TypeScript type conflicts by moving @types/react to peerDependencies. This resolves "cannot be used as a JSX component" errors when consuming the package.

## 1.2.0

### Minor Changes

- f1d344b: Added new login buttons for popular SSO providers

## 1.1.0

### Minor Changes

- 6cd6291: Added new componetns
