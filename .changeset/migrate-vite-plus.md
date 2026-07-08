---
'@necto-react/components': patch
'@necto-react/hooks': patch
'@necto-react/popper': patch
'@necto-react/state': patch
'@necto-react/types': patch
'@necto/assert': patch
'@necto/bolt': patch
'@necto/constants': patch
'@necto/crypto': patch
'@necto/dom': patch
'@necto/env': patch
'@necto/file': patch
'@necto/id': patch
'@necto/image': patch
'@necto/math': patch
'@necto/mergers': patch
'@necto/platform': patch
'@necto/popper': patch
'@necto/state': patch
'@necto/strings': patch
'@necto/types': patch
'@necto/url': patch
---

Migrate the build toolchain from tsdown to Vite+ (`vp pack`). The ESM build now emits `.mjs` (previously `.js`) and its types `.d.mts`; the CommonJS build (`.cjs`/`.d.cts`) is unchanged. Each package's `exports`, `main`, `module`, and `types` fields are updated to match, so normal package imports resolve exactly as before — only direct-to-`dist/index.js` deep imports are affected.

This also migrates lint/format from Biome to oxlint/oxfmt (`vp lint` / `vp fmt`), the task runner from Turbo to pnpm, and bumps Vitest 3 → 4. Node 24+ is now required.
