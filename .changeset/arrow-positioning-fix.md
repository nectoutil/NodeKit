---
"@necto-react/popper": minor
"@necto/popper": patch
---

feat: pixel-perfect arrow positioning using arrow middleware

- **@necto-react/popper**: Rewrote PopperArrow to match Radix's approach — outer span handles positioning and rotation via transforms, inner element renders the SVG. Single polygon with CSS rotation per side. Arrow middleware ref on the span for correct measurement.
- **@necto/popper**: Fixed arrow middleware to use `offsetWidth` for cross-axis measurement. Fixed flip middleware to use actual positioned coordinates for overflow detection.
