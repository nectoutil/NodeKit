---
'@necto-react/state': minor
---

Add a signal-style API to `useLocalState` while keeping the tuple destructure
working. The result object now supports both access styles on the same value:

```tsx
// Tuple style (unchanged — works exactly as before):
const [count, setCount] = useLocalState(0);

// Signal style (new):
const counter = useLocalState(0);
counter.value;                  // current value
counter.set(123);               // direct setter
counter.update((c) => c + 1);   // functional updater
counter.reset();                // restore initial value
```

Both styles read and write the same underlying state. Pick whichever reads
better at the call site, or mix them in the same component:

```tsx
const counter = useLocalState(0);
const [count, setCount] = counter;   // ← also works
counter.set(10);                     // ← also works on the same object
```

`.reset()` already existed in prior releases; `.value`, `.set()`, and
`.update()` are new. No breaking changes — existing tuple-destructure code
continues to work without modification.
