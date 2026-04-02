---
"@necto-react/popper": patch
---

fix: arrow positioning for all placement variants

- Extract side from compound placements (e.g., `top-start` → `top`)
- Handle alignment (`start`/`end`) for arrow offset positioning
- Fix SVG transform to correctly push arrow outside tooltip for all sides
- Use switch statement for cleaner placement handling
