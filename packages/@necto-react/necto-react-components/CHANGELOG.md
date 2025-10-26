# @necto-react/components

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
