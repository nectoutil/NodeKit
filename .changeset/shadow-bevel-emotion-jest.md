---
"@necto-react/components": patch
---

Add `@emotion/jest` to the test setup for `necto-react-components`. Extends vitest's `expect` with `toHaveStyleRule` so tests can assert emotion-generated CSS rules and pseudo-element styles. Also fixes `ShadowBevel` empty-string fallback for `boxShadow` and `borderRadius` props, and adds comprehensive static-style coverage for the component.
