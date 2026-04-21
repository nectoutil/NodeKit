# @necto/dom

## 1.10.0

### Minor Changes

- 70f03f1: Dissolve the `@necto-react/helpers` package and distribute its utilities to more appropriate homes.

  **Moved to `@necto/dom`:**

  - `filterDOMProps`
  - `isVirtualClick`
  - `isKeyboardFocusEvent`

  **Moved to `@necto-react/hooks` (under a new `utils/` subfolder):**

  - `createSyntheticEvent`
  - `createEventHandler`

  Consumers using the `@necto/react` umbrella package are unaffected — all utilities remain exported via that re-export barrel. Consumers who imported directly from `@necto-react/helpers` must update their imports to the new package homes.

  Also removes the unused `terser` devDependency from `@necto/file`.

## 1.9.2

### Patch Changes

- f9ea3f5: feat: PopperArrow renders default SVG triangle with placement-based rotation

  - **@necto-react/popper**: `PopperArrow` now renders a default SVG triangle that rotates based on placement (top/bottom/left/right). Accepts `width` and `height` props. Custom `children` override the default SVG. Inlined all arrow rendering logic into the component.
  - **@necto/dom**: Cleaned up `injectStyle` — merged helper functions inline, added JSDoc, renamed constants to uppercase convention.

## 1.9.1

### Patch Changes

- 18140db: fix: rename internal style tracking attribute to data-style-id, fix usePress CSS formatting

  - **@necto/dom**: Renamed internal style tracking attribute from `necto-style-id` to `data-style-id`. The `id` option on `injectStyle` now sets the user-facing HTML `id` attribute. Internal tracking ID auto-generated as `necto-<:hash:>`.
  - **@necto-react/hooks**: Fixed `usePress` CSS template to output clean indentation in the injected `<style>` tag.

## 1.9.0

### Minor Changes

- 595c9b6: feat: refactor style injection ID system and add global press styles

  - **@necto/dom**: `injectStyle` now uses `id` as the user-facing HTML `id` attribute on the `<style>` element. Internal tracking uses auto-generated `necto-style-id` with `ncto-<:hash:>` format. Removed `elementId` option.
  - **@necto-react/hooks**: `useStyleInjection` updated to match new `injectStyle` API. `usePress` defaults to `styleInjection: 'global'` which injects a shared `<style id="necto-pressable">` tag for `touch-action`. Added `useIsomorphicLayoutEffect` hook.
  - **@necto-react/popper**: Refactored hooks to use consistent `{hookName}.types.ts` naming. Replaced local utilities with shared necto packages. Fixed `PopperArrow` centering and transform merging. Fixed `useTransitionStyles` to derive `transitionProperty` from style keys. Moved `PopperPortal` to components directory. Added `useTransitionStyles` tests.

## 1.8.0

### Minor Changes

- b3ee3bc: feat: improve popper hooks, add global style injection to usePress, fix arrow positioning

  - **@necto-react/popper**: Refactored all hooks to use consistent file naming (`{hookName}.types.ts`), replaced local utilities with shared necto packages (`useLatestRef`, `useMounted`, `useLocalState`, `useIsomorphicLayoutEffect`, `mergeProps`, `mergeRefs`), moved `PopperPortal` component to components directory, fixed `useTransitionStyles` to derive `transitionProperty` from style keys instead of hardcoding `"opacity, transform"`, fixed `PopperArrow` centering with `left: 50%`/`top: 50%` and transform merging, added `useTransitionStyles` tests
  - **@necto-react/hooks**: Added `useIsomorphicLayoutEffect` hook for SSR-safe layout effects, added `styleInjection` option to `usePress` (defaults to `'global'`) for injecting `touch-action` via a shared `<style>` tag instead of inline styles, added `elementId` option to `useStyleInjection`
  - **@necto/dom**: Added `elementId` option to `injectStyle` for setting a user-facing HTML `id` attribute separate from the internal `necto-style-id` tracking attribute

## 1.7.3

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
