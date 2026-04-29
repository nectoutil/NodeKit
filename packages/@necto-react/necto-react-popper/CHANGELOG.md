# @necto-react/popper

## 0.10.12

### Patch Changes

- 4fef4dd: Two performance improvements in `usePopper`:

  - **Skip the extra render on middleware change.** The `latestMiddleware` derived state was implemented via `useState` + setState-during-render, which forced an extra render whenever middleware contents changed. Replaced with a ref-based pattern since `latestMiddleware` is only consumed inside `update()` and never appears in render output. Saves one render per middleware-content change.

  - **rAF-coalesce position updates.** Each `update()` call previously fired its own `flushSync(setData(...))`, meaning `autoUpdate` bursts during scroll/resize produced N synchronous render commits. Updates are now batched per animation frame: only the latest pending position is committed, at most once per frame. `flushSync` is preserved so positioning still happens before paint — we just don't pay for it more than once per frame. Significantly reduces render pressure when many floating elements are open during scroll.

## 0.10.11

### Patch Changes

- Updated dependencies [ac257f6]
  - @necto-react/hooks@2.19.2
  - @necto-react/components@3.3.1

## 0.10.10

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
- Updated dependencies [ad6a4aa]
  - @necto-react/components@3.3.0
  - @necto-react/hooks@2.19.1
  - @necto-react/state@0.2.2
  - @necto-react/types@2.4.2
  - @necto/dom@1.11.1
  - @necto/mergers@1.5.2
  - @necto/popper@0.5.10
  - @necto/types@1.3.2

## 0.10.9

### Patch Changes

- Updated dependencies [1633aec]
  - @necto-react/components@3.2.0
  - @necto-react/hooks@2.19.0

## 0.10.8

### Patch Changes

- Updated dependencies [8dd30b3]
  - @necto/dom@1.11.0
  - @necto-react/hooks@2.18.0
  - @necto-react/components@3.1.0
  - @necto/popper@0.5.9

## 0.10.7

### Patch Changes

- @necto-react/components@3.0.4
- @necto/dom@1.10.1
- @necto/popper@0.5.8
- @necto-react/hooks@2.17.2

## 0.10.6

### Patch Changes

- Updated dependencies [9eb1854]
  - @necto-react/hooks@2.17.1
  - @necto-react/components@3.0.3

## 0.10.5

### Patch Changes

- Updated dependencies [70f03f1]
  - @necto-react/hooks@2.17.0
  - @necto/dom@1.10.0
  - @necto-react/components@3.0.2
  - @necto/popper@0.5.7

## 0.10.4

### Patch Changes

- 4106019: Fix a `TypeError: Cannot read properties of null (reading 'removeEventListener')` thrown on unmount when `useDismiss` was configured with `ancestorScroll: true`. The ancestor-traversal loop captured its `current` variable by reference in each cleanup closure, so by the time React invoked them the binding had already been reassigned to `null`. Each cleanup closure now captures its element in a per-iteration `const`, so scroll listeners are correctly removed from the exact element they were attached to.

## 0.10.3

### Patch Changes

- Updated dependencies [fbc449f]
  - @necto-react/components@3.0.1

## 0.10.2

### Patch Changes

- Updated dependencies [36723b4]
  - @necto-react/components@3.0.0
  - @necto-react/hooks@2.16.4

## 0.10.1

### Patch Changes

- Updated dependencies [0284395]
  - @necto-react/components@2.0.0
  - @necto-react/hooks@2.16.3

## 0.10.0

### Minor Changes

- 7133d0e: feat: pixel-perfect arrow positioning using arrow middleware

  - **@necto-react/popper**: Rewrote PopperArrow to match Radix's approach — outer span handles positioning and rotation via transforms, inner element renders the SVG. Single polygon with CSS rotation per side. Arrow middleware ref on the span for correct measurement.
  - **@necto/popper**: Fixed arrow middleware to use `offsetWidth` for cross-axis measurement. Fixed flip middleware to use actual positioned coordinates for overflow detection.

### Patch Changes

- Updated dependencies [7133d0e]
  - @necto/popper@0.5.6

## 0.9.1

### Patch Changes

- aeb0d05: fix: arrow positioning for all placement variants

  - Extract side from compound placements (e.g., `top-start` → `top`)
  - Handle alignment (`start`/`end`) for arrow offset positioning
  - Fix SVG transform to correctly push arrow outside tooltip for all sides
  - Use switch statement for cleaner placement handling

## 0.9.0

### Minor Changes

- f9ea3f5: feat: PopperArrow renders default SVG triangle with placement-based rotation

  - **@necto-react/popper**: `PopperArrow` now renders a default SVG triangle that rotates based on placement (top/bottom/left/right). Accepts `width` and `height` props. Custom `children` override the default SVG. Inlined all arrow rendering logic into the component.
  - **@necto/dom**: Cleaned up `injectStyle` — merged helper functions inline, added JSDoc, renamed constants to uppercase convention.

### Patch Changes

- Updated dependencies [f9ea3f5]
  - @necto/dom@1.9.2
  - @necto-react/components@1.4.25
  - @necto-react/hooks@2.16.2
  - @necto/popper@0.5.5

## 0.8.1

### Patch Changes

- Updated dependencies [18140db]
  - @necto/dom@1.9.1
  - @necto-react/hooks@2.16.1
  - @necto-react/components@1.4.24
  - @necto/popper@0.5.4

## 0.8.0

### Minor Changes

- 595c9b6: feat: refactor style injection ID system and add global press styles

  - **@necto/dom**: `injectStyle` now uses `id` as the user-facing HTML `id` attribute on the `<style>` element. Internal tracking uses auto-generated `necto-style-id` with `ncto-<:hash:>` format. Removed `elementId` option.
  - **@necto-react/hooks**: `useStyleInjection` updated to match new `injectStyle` API. `usePress` defaults to `styleInjection: 'global'` which injects a shared `<style id="necto-pressable">` tag for `touch-action`. Added `useIsomorphicLayoutEffect` hook.
  - **@necto-react/popper**: Refactored hooks to use consistent `{hookName}.types.ts` naming. Replaced local utilities with shared necto packages. Fixed `PopperArrow` centering and transform merging. Fixed `useTransitionStyles` to derive `transitionProperty` from style keys. Moved `PopperPortal` to components directory. Added `useTransitionStyles` tests.

### Patch Changes

- Updated dependencies [595c9b6]
  - @necto/dom@1.9.0
  - @necto-react/hooks@2.16.0
  - @necto-react/components@1.4.23
  - @necto/popper@0.5.3

## 0.7.0

### Minor Changes

- b3ee3bc: feat: improve popper hooks, add global style injection to usePress, fix arrow positioning

  - **@necto-react/popper**: Refactored all hooks to use consistent file naming (`{hookName}.types.ts`), replaced local utilities with shared necto packages (`useLatestRef`, `useMounted`, `useLocalState`, `useIsomorphicLayoutEffect`, `mergeProps`, `mergeRefs`), moved `PopperPortal` component to components directory, fixed `useTransitionStyles` to derive `transitionProperty` from style keys instead of hardcoding `"opacity, transform"`, fixed `PopperArrow` centering with `left: 50%`/`top: 50%` and transform merging, added `useTransitionStyles` tests
  - **@necto-react/hooks**: Added `useIsomorphicLayoutEffect` hook for SSR-safe layout effects, added `styleInjection` option to `usePress` (defaults to `'global'`) for injecting `touch-action` via a shared `<style>` tag instead of inline styles, added `elementId` option to `useStyleInjection`
  - **@necto/dom**: Added `elementId` option to `injectStyle` for setting a user-facing HTML `id` attribute separate from the internal `necto-style-id` tracking attribute

### Patch Changes

- Updated dependencies [b3ee3bc]
  - @necto-react/hooks@2.15.0
  - @necto/dom@1.8.0
  - @necto-react/components@1.4.22
  - @necto/popper@0.5.2

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
