---
"@necto-react/popper": patch
---

Two performance improvements in `usePopper`:

- **Skip the extra render on middleware change.** The `latestMiddleware` derived state was implemented via `useState` + setState-during-render, which forced an extra render whenever middleware contents changed. Replaced with a ref-based pattern since `latestMiddleware` is only consumed inside `update()` and never appears in render output. Saves one render per middleware-content change.

- **rAF-coalesce position updates.** Each `update()` call previously fired its own `flushSync(setData(...))`, meaning `autoUpdate` bursts during scroll/resize produced N synchronous render commits. Updates are now batched per animation frame: only the latest pending position is committed, at most once per frame. `flushSync` is preserved so positioning still happens before paint — we just don't pay for it more than once per frame. Significantly reduces render pressure when many floating elements are open during scroll.
