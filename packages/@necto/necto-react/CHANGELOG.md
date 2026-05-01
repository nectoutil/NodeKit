# @necto/react

## 1.3.5

### Patch Changes

- Updated dependencies [d435091]
- Updated dependencies [d435091]
  - @necto-react/hooks@2.20.0
  - @necto-react/state@0.3.0
  - @necto-react/components@3.3.2
  - @necto-react/popper@0.10.13

## 1.3.4

### Patch Changes

- Updated dependencies [4fef4dd]
  - @necto-react/popper@0.10.12

## 1.3.3

### Patch Changes

- Updated dependencies [ac257f6]
  - @necto-react/hooks@2.19.2
  - @necto-react/components@3.3.1
  - @necto-react/popper@0.10.11

## 1.3.2

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
  - @necto-react/popper@0.10.10
  - @necto-react/state@0.2.2

## 1.3.1

### Patch Changes

- Updated dependencies [1633aec]
  - @necto-react/components@3.2.0
  - @necto-react/hooks@2.19.0
  - @necto-react/popper@0.10.9

## 1.3.0

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
  - @necto-react/hooks@2.18.0
  - @necto-react/components@3.1.0
  - @necto-react/popper@0.10.8

## 1.2.2

### Patch Changes

- @necto-react/components@3.0.4
- @necto-react/popper@0.10.7
- @necto-react/hooks@2.17.2

## 1.2.1

### Patch Changes

- Updated dependencies [9eb1854]
  - @necto-react/hooks@2.17.1
  - @necto-react/components@3.0.3
  - @necto-react/popper@0.10.6

## 1.2.0

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
  - @necto-react/hooks@2.17.0
  - @necto-react/components@3.0.2
  - @necto-react/popper@0.10.5

## 1.1.37

### Patch Changes

- Updated dependencies [4106019]
  - @necto-react/popper@0.10.4

## 1.1.36

### Patch Changes

- Updated dependencies [fbc449f]
  - @necto-react/components@3.0.1
  - @necto-react/popper@0.10.3

## 1.1.35

### Patch Changes

- Updated dependencies [36723b4]
  - @necto-react/components@3.0.0
  - @necto-react/popper@0.10.2
  - @necto-react/hooks@2.16.4

## 1.1.34

### Patch Changes

- Updated dependencies [0284395]
  - @necto-react/components@2.0.0
  - @necto-react/popper@0.10.1
  - @necto-react/hooks@2.16.3

## 1.1.33

### Patch Changes

- Updated dependencies [7133d0e]
  - @necto-react/popper@0.10.0

## 1.1.32

### Patch Changes

- Updated dependencies [aeb0d05]
  - @necto-react/popper@0.9.1

## 1.1.31

### Patch Changes

- Updated dependencies [f9ea3f5]
  - @necto-react/popper@0.9.0
  - @necto-react/components@1.4.25
  - @necto-react/helpers@2.6.16
  - @necto-react/hooks@2.16.2

## 1.1.30

### Patch Changes

- Updated dependencies [18140db]
  - @necto-react/hooks@2.16.1
  - @necto-react/components@1.4.24
  - @necto-react/helpers@2.6.15
  - @necto-react/popper@0.8.1

## 1.1.29

### Patch Changes

- Updated dependencies [595c9b6]
  - @necto-react/hooks@2.16.0
  - @necto-react/popper@0.8.0
  - @necto-react/components@1.4.23
  - @necto-react/helpers@2.6.14

## 1.1.28

### Patch Changes

- Updated dependencies [b3ee3bc]
  - @necto-react/popper@0.7.0
  - @necto-react/hooks@2.15.0
  - @necto-react/components@1.4.22
  - @necto-react/helpers@2.6.13

## 1.1.27

### Patch Changes

- Updated dependencies [f4f3a19]
  - @necto-react/popper@0.6.0

## 1.1.26

### Patch Changes

- Updated dependencies [40c54dc]
  - @necto-react/hooks@2.14.17
  - @necto-react/components@1.4.21
  - @necto-react/popper@0.5.2

## 1.1.25

### Patch Changes

- @necto-react/popper@0.5.1

## 1.1.24

### Patch Changes

- Updated dependencies [b53176e]
  - @necto-react/popper@0.5.0

## 1.1.23

### Patch Changes

- Updated dependencies [d003ea7]
  - @necto-react/popper@0.4.0

## 1.1.22

### Patch Changes

- Updated dependencies
  - @necto-react/hooks@2.14.13
  - @necto-react/components@1.4.16
  - @necto-react/popper@0.3.11

## 1.1.21

### Patch Changes

- @necto-react/components@1.4.15
- @necto-react/hooks@2.14.12
- @necto-react/popper@0.3.10

## 1.1.20

### Patch Changes

- @necto-react/components@1.4.14
- @necto-react/hooks@2.14.11
- @necto-react/popper@0.3.9

## 1.1.19

### Patch Changes

- Fix workspace dependency resolution - republish with proper workspace:\* replacement
- Updated dependencies
- Updated dependencies
  - @necto-react/hooks@2.14.10
  - @necto-react/components@1.4.13
  - @necto-react/popper@0.3.8

## 1.1.18

### Patch Changes

- Updated dependencies
  - @necto-react/components@1.4.12

## 1.1.17

### Patch Changes

- @necto-react/components@1.4.11
- @necto-react/hooks@2.14.9
- @necto-react/popper@0.3.7

## 1.1.16

### Patch Changes

- Updated dependencies
  - @necto-react/components@1.4.10

## 1.1.15

### Patch Changes

- Updated dependencies
  - @necto-react/components@1.4.9

## 1.1.14

### Patch Changes

- Updated dependencies
  - @necto-react/hooks@2.14.8
  - @necto-react/components@1.4.8
  - @necto-react/popper@0.3.6

## 1.1.13

### Patch Changes

- @necto-react/hooks@2.14.7
- @necto-react/popper@0.3.5
- @necto-react/components@1.4.7

## 1.1.12

### Patch Changes

- @necto-react/hooks@2.14.6
- @necto-react/popper@0.3.4
- @necto-react/components@1.4.6

## 1.1.11

### Patch Changes

- @necto-react/components@1.4.5
- @necto-react/hooks@2.14.5
- @necto-react/popper@0.3.3

## 1.1.10

### Patch Changes

- @necto-react/components@1.4.4
- @necto-react/hooks@2.14.4
- @necto-react/popper@0.3.2

## 1.1.9

### Patch Changes

- Updated dependencies
  - @necto-react/components@1.4.3
  - @necto-react/hooks@2.14.3
  - @necto-react/popper@0.3.1

## 1.1.8

### Patch Changes

- Updated dependencies
  - @necto-react/popper@0.3.0

## 1.1.7

### Patch Changes

- Updated dependencies
  - @necto-react/hooks@2.14.2
  - @necto-react/components@1.4.2
  - @necto-react/popper@0.2.5

## 1.1.6

### Patch Changes

- @necto-react/hooks@2.14.1
- @necto-react/components@1.4.1
- @necto-react/popper@0.2.4

## 1.1.5

### Patch Changes

- Updated dependencies
  - @necto-react/components@1.4.0

## 1.1.4

### Patch Changes

- Updated dependencies
  - @necto-react/hooks@2.14.0
  - @necto-react/components@1.3.3
  - @necto-react/popper@0.2.3

## 1.1.3

### Patch Changes

- @necto-react/hooks@2.13.2
- @necto-react/components@1.3.2
- @necto-react/popper@0.2.2

## 1.1.2

### Patch Changes

- @necto-react/components@1.3.1
- @necto-react/hooks@2.13.1
- @necto-react/popper@0.2.1

## 1.1.1

### Patch Changes

- Updated dependencies [d6ea5b7]
  - @necto-react/components@1.3.0
  - @necto-react/hooks@2.13.0
  - @necto-react/popper@0.2.0

## 1.1.0

### Minor Changes

- 97a590e: Added new changes

### Patch Changes

- Updated dependencies [97a590e]
  - @necto-react/popper@0.1.0
  - @necto-react/hooks@2.12.7
  - @necto-react/components@1.2.16
