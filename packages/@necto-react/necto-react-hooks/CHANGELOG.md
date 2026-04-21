# @necto-react/hooks

## 2.17.0

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

### Patch Changes

- Updated dependencies [70f03f1]
  - @necto/dom@1.10.0

## 2.16.4

### Patch Changes

- Updated dependencies [36723b4]
  - @necto/strings@1.9.0

## 2.16.3

### Patch Changes

- Updated dependencies [0284395]
  - @necto/strings@1.8.0

## 2.16.2

### Patch Changes

- Updated dependencies [f9ea3f5]
  - @necto/dom@1.9.2
  - @necto-react/helpers@2.6.16

## 2.16.1

### Patch Changes

- 18140db: fix: rename internal style tracking attribute to data-style-id, fix usePress CSS formatting

  - **@necto/dom**: Renamed internal style tracking attribute from `necto-style-id` to `data-style-id`. The `id` option on `injectStyle` now sets the user-facing HTML `id` attribute. Internal tracking ID auto-generated as `necto-<:hash:>`.
  - **@necto-react/hooks**: Fixed `usePress` CSS template to output clean indentation in the injected `<style>` tag.

- Updated dependencies [18140db]
  - @necto/dom@1.9.1
  - @necto-react/helpers@2.6.15

## 2.16.0

### Minor Changes

- 595c9b6: feat: refactor style injection ID system and add global press styles

  - **@necto/dom**: `injectStyle` now uses `id` as the user-facing HTML `id` attribute on the `<style>` element. Internal tracking uses auto-generated `necto-style-id` with `ncto-<:hash:>` format. Removed `elementId` option.
  - **@necto-react/hooks**: `useStyleInjection` updated to match new `injectStyle` API. `usePress` defaults to `styleInjection: 'global'` which injects a shared `<style id="necto-pressable">` tag for `touch-action`. Added `useIsomorphicLayoutEffect` hook.
  - **@necto-react/popper**: Refactored hooks to use consistent `{hookName}.types.ts` naming. Replaced local utilities with shared necto packages. Fixed `PopperArrow` centering and transform merging. Fixed `useTransitionStyles` to derive `transitionProperty` from style keys. Moved `PopperPortal` to components directory. Added `useTransitionStyles` tests.

### Patch Changes

- Updated dependencies [595c9b6]
  - @necto/dom@1.9.0
  - @necto-react/helpers@2.6.14

## 2.15.0

### Minor Changes

- b3ee3bc: feat: improve popper hooks, add global style injection to usePress, fix arrow positioning

  - **@necto-react/popper**: Refactored all hooks to use consistent file naming (`{hookName}.types.ts`), replaced local utilities with shared necto packages (`useLatestRef`, `useMounted`, `useLocalState`, `useIsomorphicLayoutEffect`, `mergeProps`, `mergeRefs`), moved `PopperPortal` component to components directory, fixed `useTransitionStyles` to derive `transitionProperty` from style keys instead of hardcoding `"opacity, transform"`, fixed `PopperArrow` centering with `left: 50%`/`top: 50%` and transform merging, added `useTransitionStyles` tests
  - **@necto-react/hooks**: Added `useIsomorphicLayoutEffect` hook for SSR-safe layout effects, added `styleInjection` option to `usePress` (defaults to `'global'`) for injecting `touch-action` via a shared `<style>` tag instead of inline styles, added `elementId` option to `useStyleInjection`
  - **@necto/dom**: Added `elementId` option to `injectStyle` for setting a user-facing HTML `id` attribute separate from the internal `necto-style-id` tracking attribute

### Patch Changes

- Updated dependencies [b3ee3bc]
  - @necto/dom@1.8.0
  - @necto-react/helpers@2.6.13

## 2.14.17

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
  - @necto-react/helpers@2.6.12

## 2.14.13

### Patch Changes

- Fix useId hydration mismatch by removing random prefix that differed between server and client

## 2.14.12

### Patch Changes

- Updated dependencies
  - @necto/dom@1.6.10
  - @necto-react/helpers@2.6.10

## 2.14.11

### Patch Changes

- Updated dependencies
  - @necto/dom@1.6.9
  - @necto-react/helpers@2.6.9

## 2.14.10

### Patch Changes

- Fix workspace dependency resolution - republish with proper workspace:\* replacement
- Republish with proper workspace:\* replacement via pnpm pack
- Updated dependencies
- Updated dependencies
  - @necto/dom@1.6.8
  - @necto-react/helpers@2.6.8

## 2.14.9

### Patch Changes

- Updated dependencies
  - @necto/dom@1.6.7
  - @necto-react/helpers@2.6.7

## 2.14.8

### Patch Changes

- Fix react-dom being bundled into ESM output by adding proper externals to tsup config

## 2.14.7

### Patch Changes

- Updated dependencies
  - @necto/types@1.3.1
  - @necto/dom@1.6.6
  - @necto-react/helpers@2.6.6

## 2.14.6

### Patch Changes

- Updated dependencies
  - @necto-react/types@2.4.1
  - @necto/mergers@1.5.1
  - @necto/strings@1.6.1
  - @necto/platform@1.5.1
  - @necto-react/helpers@2.6.5
  - @necto/id@1.6.5
  - @necto/dom@1.6.5

## 2.14.5

### Patch Changes

- @necto/dom@1.6.4
- @necto/id@1.6.4
- @necto-react/helpers@2.6.4

## 2.14.4

### Patch Changes

- Updated dependencies
  - @necto/dom@1.6.3
  - @necto-react/helpers@2.6.3

## 2.14.3

### Patch Changes

- Updated dependencies
  - @necto/dom@1.6.2
  - @necto-react/helpers@2.6.2

## 2.14.2

### Patch Changes

- Update @necto/platform dependency

## 2.14.1

### Patch Changes

- Updated dependencies
  - @necto/platform@1.5.0
  - @necto-react/helpers@2.6.1
  - @necto/dom@1.6.1

## 2.14.0

### Minor Changes

- Fix workspace dependency resolution in published package

## 2.13.2

### Patch Changes

- Updated dependencies
  - @necto-react/helpers@2.6.0

## 2.13.1

### Patch Changes

- Updated dependencies
  - @necto/dom@1.6.0
  - @necto-react/helpers@2.5.1

## 2.13.0

### Minor Changes

- d6ea5b7: Added new changes

### Patch Changes

- Updated dependencies [d6ea5b7]
  - @necto-react/helpers@2.5.0
  - @necto-react/types@2.4.0
  - @necto/dom@1.5.0
  - @necto/mergers@1.5.0
  - @necto/strings@1.6.0

## 2.12.7

### Patch Changes

- Updated dependencies [97a590e]
  - @necto/strings@1.5.0

## 2.12.6

### Patch Changes

- 8c5019d: Fixed Vite issues with imports and exports

## 2.12.5

### Patch Changes

- @necto/dom@1.4.5
- @necto/id@1.6.3
- @necto-react/helpers@2.4.5

## 2.12.4

### Patch Changes

- Updated dependencies [73fdf60]
  - @necto/dom@1.4.4
  - @necto-react/helpers@2.4.4

## 2.12.3

### Patch Changes

- Updated dependencies [232695d]
  - @necto/dom@1.4.3
  - @necto-react/helpers@2.4.3

## 2.12.2

### Patch Changes

- Updated dependencies [f39c992]
  - @necto/dom@1.4.2
  - @necto/id@1.6.2
  - @necto-react/helpers@2.4.2

## 2.12.1

### Patch Changes

- Updated dependencies [faedceb]
  - @necto/dom@1.4.1
  - @necto/id@1.6.1
  - @necto-react/helpers@2.4.1

## 2.12.0

### Minor Changes

- f49ec63: Added new hook

## 2.11.0

### Minor Changes

- 9d936c5: Fixed some errosr

## 2.10.0

### Minor Changes

- 3bd0ef2: Update backlog

### Patch Changes

- Updated dependencies [3bd0ef2]
  - @necto-react/contexts@1.3.0
  - @necto-react/helpers@2.4.0
  - @necto-react/types@2.3.0
  - @necto/dom@1.4.0
  - @necto/id@1.6.0
  - @necto/mergers@1.4.0
  - @necto/platform@1.4.0
  - @necto/types@1.3.0

## 2.9.0

### Minor Changes

- 3f3a40e: Update backlog

### Patch Changes

- Updated dependencies [3f3a40e]
  - @necto-react/contexts@1.2.0
  - @necto-react/helpers@2.3.0
  - @necto-react/types@2.2.0
  - @necto/dom@1.3.0
  - @necto/id@1.5.0
  - @necto/mergers@1.3.0
  - @necto/platform@1.3.0
  - @necto/types@1.2.0

## 2.8.0

### Minor Changes

- 343fcae: Added new release as default

### Patch Changes

- Updated dependencies [343fcae]
  - @necto-react/contexts@1.1.0
  - @necto-react/helpers@2.2.0
  - @necto-react/types@2.1.0
  - @necto/dom@1.2.0
  - @necto/id@1.4.0
  - @necto/mergers@1.2.0
  - @necto/platform@1.2.0
  - @necto/types@1.1.0
