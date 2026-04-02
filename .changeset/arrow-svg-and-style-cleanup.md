---
"@necto-react/popper": minor
"@necto/dom": patch
---

feat: PopperArrow renders default SVG triangle with placement-based rotation

- **@necto-react/popper**: `PopperArrow` now renders a default SVG triangle that rotates based on placement (top/bottom/left/right). Accepts `width` and `height` props. Custom `children` override the default SVG. Inlined all arrow rendering logic into the component.
- **@necto/dom**: Cleaned up `injectStyle` — merged helper functions inline, added JSDoc, renamed constants to uppercase convention.
