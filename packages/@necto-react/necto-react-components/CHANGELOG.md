# @necto-react/components

## 2.0.0

### Major Changes

- 0284395: **Breaking:** Remove Emotion `css` prop from `ButtonProps` and `Primitive`. The `css` prop and `@emotion/react` dependency have been removed entirely; styling now uses `@emotion/styled` exclusively.

  **Breaking:** Remove `jsxImportSource: "@emotion/react"` from tsconfig — the global `css` prop on JSX elements is no longer available.

  Internally, `Box` and `ShadowBevel` have been migrated from SCSS modules to `@emotion/styled`, allowing the entire SCSS/PostCSS build pipeline to be removed. `Primitive` now uses `createElement` directly and lazily builds its tag-component map via a plain `for...of` loop.

  **New:** `capitalize` added to `@necto/strings` — uppercases the first character of a string, empty-string safe.

### Patch Changes

- Updated dependencies [0284395]
  - @necto/strings@1.8.0
  - @necto-react/hooks@2.16.3

## 1.4.25

### Patch Changes

- Updated dependencies [f9ea3f5]
  - @necto/dom@1.9.2
  - @necto-react/hooks@2.16.2

## 1.4.24

### Patch Changes

- Updated dependencies [18140db]
  - @necto/dom@1.9.1
  - @necto-react/hooks@2.16.1

## 1.4.23

### Patch Changes

- Updated dependencies [595c9b6]
  - @necto/dom@1.9.0
  - @necto-react/hooks@2.16.0

## 1.4.22

### Patch Changes

- Updated dependencies [b3ee3bc]
  - @necto-react/hooks@2.15.0
  - @necto/dom@1.8.0

## 1.4.21

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

## 1.4.16

### Patch Changes

- Updated dependencies
  - @necto-react/hooks@2.14.13

## 1.4.15

### Patch Changes

- Updated dependencies
  - @necto/dom@1.6.10
  - @necto-react/hooks@2.14.12

## 1.4.14

### Patch Changes

- Updated dependencies
  - @necto/dom@1.6.9
  - @necto-react/hooks@2.14.11

## 1.4.13

### Patch Changes

- Fix workspace dependency resolution - republish with proper workspace:\* replacement
- Updated dependencies
- Updated dependencies
  - @necto/dom@1.6.8
  - @necto-react/hooks@2.14.10

## 1.4.12

### Patch Changes

- Republish with proper workspace:\* replacement via pnpm pack

## 1.4.11

### Patch Changes

- Updated dependencies
  - @necto/dom@1.6.7
  - @necto-react/hooks@2.14.9

## 1.4.10

### Patch Changes

- Fix workspace:\* leaking into published package

## 1.4.9

### Patch Changes

- Fix SSR safety: defer SCSS module style injection behind a Proxy so styles only inject when a component renders in the browser, not on module import

## 1.4.8

### Patch Changes

- Updated dependencies
  - @necto-react/hooks@2.14.8

## 1.4.7

### Patch Changes

- @necto-react/hooks@2.14.7
- @necto/dom@1.6.6

## 1.4.6

### Patch Changes

- @necto-react/hooks@2.14.6
- @necto/dom@1.6.5

## 1.4.5

### Patch Changes

- Updated dependencies
  - @necto/constants@1.4.4
  - @necto/dom@1.6.4
  - @necto-react/hooks@2.14.5

## 1.4.4

### Patch Changes

- Updated dependencies
  - @necto/dom@1.6.3
  - @necto-react/hooks@2.14.4

## 1.4.3

### Patch Changes

- Lazy-initialize HTML tag maps to fix circular chunk initialization in bundlers
- Updated dependencies
  - @necto/dom@1.6.2
  - @necto-react/hooks@2.14.3

## 1.4.2

### Patch Changes

- Updated dependencies
  - @necto-react/hooks@2.14.2

## 1.4.1

### Patch Changes

- @necto-react/hooks@2.14.1
- @necto/dom@1.6.1

## 1.4.0

### Minor Changes

- Fix workspace dependency resolution in published package

## 1.3.3

### Patch Changes

- Updated dependencies
  - @necto-react/hooks@2.14.0

## 1.3.2

### Patch Changes

- @necto-react/hooks@2.13.2

## 1.3.1

### Patch Changes

- Updated dependencies
  - @necto/dom@1.6.0
  - @necto-react/hooks@2.13.1

## 1.3.0

### Minor Changes

- d6ea5b7: Added new changes

### Patch Changes

- Updated dependencies [d6ea5b7]
  - @necto-react/hooks@2.13.0
  - @necto/dom@1.5.0

## 1.2.16

### Patch Changes

- @necto-react/hooks@2.12.7

## 1.2.15

### Patch Changes

- 8c5019d: Fixed Vite issues with imports and exports

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
