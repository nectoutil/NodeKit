---
"@necto-react/hooks": minor
---

Added `useCookie` hook for reading, writing and deleting cookies through `@necto/cookie`. Returns a `[value, set, remove]` tuple that also exposes `value`, `set`, `update` and `remove`, supports `defaultValue`, `parse`/`serialize` for typed values, shared `attributes`, a custom `client`, and `serverValue` for SSR. Stays in sync across components and tabs.
