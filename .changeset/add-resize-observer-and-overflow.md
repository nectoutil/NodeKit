---
"@necto/dom": minor
"@necto-react/hooks": minor
"@necto-react/components": minor
"@necto/react": minor
---

Add a shared `ResizeObserver` primitive plus the `Overflow` component and `useOverflow` hook for laying out items that don't fit their container.

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
