---
'@necto-react/hooks': patch
'@necto-react/components': patch
---

Fix Overflow flicker, "vanishing item" bug, and infinite-loop pitfall when
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
