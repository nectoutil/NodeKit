# @necto-react/hooks

## 2.20.0

### Minor Changes

- d435091: Add `useEventListener` and `useOnClickOutside` hooks.

  ## `useEventListener`

  Subscribe to a DOM event for the lifetime of a component. Single signature
  with conditional types — narrows event payload from the target ref:

  ```tsx
  // Window event (default target)
  useEventListener("resize", handleResize);

  // Element event — `event` typed as MouseEvent automatically
  const buttonRef = useRef<HTMLButtonElement>(null);
  useEventListener("click", (event) => console.log(event.button), buttonRef);

  // MediaQueryList — `event` typed as MediaQueryListEvent automatically
  const mql = useRef(window.matchMedia("(prefers-color-scheme: dark)"));
  useEventListener("change", (event) => setDark(event.matches), mql);
  ```

  Supports targets: `Window`, `Document`, `HTMLElement`, `SVGElement`,
  `MediaQueryList`. Includes an `enabled` option for toggling the
  subscription without unmounting the host component.

  ## `useOnClickOutside`

  Fire a handler when an interaction happens outside one or more refs.
  Composes on top of `useEventListener`:

  ```tsx
  const menuRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(menuRef, () => setOpen(false));

  // Multiple refs — handler only fires when target is outside all of them
  useOnClickOutside([menuRef, triggerRef], close, { eventType: "mouseup" });
  ```

  Defaults: `eventType: 'mousedown'` (fastest dismiss), listener attached
  with `{ passive: true }` since the hook never calls `preventDefault`.
  Skips if the click target is detached from the document.

  ## `InteractionEventName` type added to `@necto/types`

  Shared string-literal union covering pointer-down/up, touch-start/end, and
  focus-in/out events. Used by `useOnClickOutside` and intended for any
  hook that exposes a configurable interaction-trigger event name.

### Patch Changes

- Updated dependencies [d435091]
  - @necto/types@1.4.0
  - @necto/dom@1.11.2

## 2.19.2

### Patch Changes

- ac257f6: Fix Overflow flicker, "vanishing item" bug, and infinite-loop pitfall when
  parent re-renders without memoizing the items array.

  `useOverflow` now stores partition state as a single COUNT (number of
  visible items) instead of arrays of item references. `visibleItems` and
  `hiddenItems` are derived from the `items` prop + count at render time via
  `useMemo`. This decouples internal state from items prop identity:

  - Items reference churn (parent passing a freshly-built array on every
    render) no longer triggers any state update — partition state only
    changes when the layout demands it.
  - No flicker on parent re-renders.
  - Length changes still reset and re-measure, so adding/removing items
    works correctly.
  - The rendered `visibleItems` always reflect the latest items prop, never
    stale references from a previous reset.

  Symptom that motivated this: a tab list built on top of Overflow would
  visually jitter on every tab switch, and a tab near the visible/hidden
  boundary would appear to "vanish and come back" as the previous reset-
  based implementation re-ran the shrink loop on every parent re-render.

  Same architecture as `react-overflow-list` (BluePrint OverflowList) and
  similar proven libraries.

  Also adds a regression test for the no-flicker behavior and several new
  component-level tests covering empty items, omitted `renderOverflow`, and
  ref forwarding (function + object refs).

## 2.19.1

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
  - @necto-react/types@2.4.2
  - @necto/dom@1.11.1
  - @necto/id@1.6.8
  - @necto/mergers@1.5.2
  - @necto/platform@1.5.2
  - @necto/strings@1.9.2
  - @necto/types@1.3.2

## 2.19.0

### Minor Changes

- 1633aec: Released to backfill changes

## 2.18.0

### Minor Changes

- 8dd30b3: Add a shared `ResizeObserver` primitive plus the `Overflow` component and `useOverflow` hook for laying out items that don't fit their container.

  **Added to `@necto/dom`:**

  - `createResizeObserver()` — framework-agnostic factory that wraps a single platform `ResizeObserver` and fans out batched, RAF-deduped entries to multiple subscribers per target. Exposes `subscribe` / `unsubscribe` / `disconnect`.
  - `ResizeObserverHandler` and `ResizeObserverController` types.

  **Added to `@necto-react/hooks`:**

  - `useResizeObserver(target, callback, options?)` — React adapter over `@necto/dom`'s factory. Maintains a single shared observer at the module level, subscribes on mount, and unsubscribes on unmount. Supports a `polyfill` option for SSR environments without a native `ResizeObserver`.
  - `useOverflow({ items, collapseFrom?, minVisible? })` — partitions items into visible/hidden based on whether they fit the container. Returns `containerRef`, `spacerRef`, `visibleItems`, `hiddenItems`, `hiddenCount`, and `isReady` (false until the first measurement completes, used to suppress FOUC).

  **Added to `@necto-react/components`:**

  - `Overflow` — polymorphic component that uses `useOverflow` to render items that fit and a "+N more" indicator (consumer-rendered) for items that don't. Forwards Primitive props (`as`, `className`, `style`, plus arbitrary HTML attributes) and exposes `renderItem` / `renderMore` props.

  **Resize observer fixes** during the move from a previous inline implementation in `@necto-react/hooks`:

  - Unsubscribing a handler that was never registered is now a no-op (previously unobserved the target whenever the handler list had length 1, regardless of membership).
  - When multiple resize entries for the same target arrive in a single frame, the latest entry now wins (previously the first entry won, causing stale dimensions for fast resizes).
  - Added a `disconnect()` method to the controller for full teardown.
  - The factory now only calls `observer.observe(target)` once per unique target instead of on every subscription.

### Patch Changes

- Updated dependencies [8dd30b3]
  - @necto/dom@1.11.0

## 2.17.2

### Patch Changes

- @necto/dom@1.10.1
- @necto/id@1.6.7
- @necto/strings@1.9.1

## 2.17.1

### Patch Changes

- 9eb1854: Fix `TypeError: Attempted to assign to readonly property` in `useFocusVisibleListener` on WebKit (Safari, Playwright's `webkit` browser) when the package is loaded as native ESM under strict mode.

  The focus-tracking setup was monkey-patching `HTMLElement.prototype.focus` with direct assignment (`prototype.focus = fn`). That method is defined as `writable: false` in the DOM spec, so assignment throws in strict mode. V8 (Chrome) and SpiderMonkey (Firefox) silently ignored the violation, but JSC (WebKit) enforces it — the bug was latent until a toolchain change surfaced it (e.g. Vite 8 / Rolldown preserving strict-mode boundaries more faithfully than Vite 6 / esbuild).

  Replaced with `Object.defineProperty(..., { value, writable: true, configurable: true })`, which is the spec-sanctioned way to override a non-writable-but-configurable native method and works identically on all engines. Runtime behavior of the hook is unchanged.

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
