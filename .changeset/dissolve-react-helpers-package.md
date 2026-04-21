---
"@necto-react/hooks": minor
"@necto/react": minor
"@necto/dom": minor
---

Dissolve the `@necto-react/helpers` package and distribute its utilities to more appropriate homes.

**Moved to `@necto/dom`:**
- `filterDOMProps`
- `isVirtualClick`
- `isKeyboardFocusEvent`

**Moved to `@necto-react/hooks` (under a new `utils/` subfolder):**
- `createSyntheticEvent`
- `createEventHandler`

Consumers using the `@necto/react` umbrella package are unaffected — all utilities remain exported via that re-export barrel. Consumers who imported directly from `@necto-react/helpers` must update their imports to the new package homes.

Also removes the unused `terser` devDependency from `@necto/file`.
