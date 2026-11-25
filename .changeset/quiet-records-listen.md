---
"@necto-react/hooks": minor
---

Added `useKV` hook for reading, writing and deleting a single IndexedDB record through `@necto/idb`. Returns a `[value, set, remove]` tuple that also exposes `value`, `set`, `update`, `remove` and `pending`, supports `defaultValue`, a custom or scoped `store`, and `serverValue` for SSR. Stays in sync across components and tabs.

Because IndexedDB cannot be read synchronously, the first render is always `pending` with no value; give `defaultValue` to render something in the meantime. Components sharing a store and key share one read and one subscription, `set` with an updater commits through a single transaction, and `serverValue` is returned during server rendering so hydration matches.
