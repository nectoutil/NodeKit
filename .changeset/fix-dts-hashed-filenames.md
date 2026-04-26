---
'@necto-react/components': patch
'@necto-react/hooks': patch
'@necto-react/popper': patch
'@necto-react/state': patch
'@necto-react/types': patch
'@necto/assert': patch
'@necto/color': patch
'@necto/constants': patch
'@necto/crypto': patch
'@necto/dom': patch
'@necto/env': patch
'@necto/file': patch
'@necto/flags': patch
'@necto/id': patch
'@necto/image': patch
'@necto/math': patch
'@necto/mergers': patch
'@necto/platform': patch
'@necto/popper': patch
'@necto/react': patch
'@necto/state': patch
'@necto/strings': patch
'@necto/types': patch
'@necto/url': patch
---

Fix TypeScript imports broken in previous releases due to hashed `.d.ts` filenames.

Previous releases shipped `dist/index-{hash}.d.ts` and `dist/index-{hash}.d.cts` while
`package.json` `types` and `exports.types` pointed at `dist/index.d.ts` — causing
`TS2306` / `TS2307` errors in any consumer importing types. Root cause was a bug in
`rolldown-plugin-dts@0.13.x` (transitive of `tsdown@0.12.x`) where entry chunks fell
through to the hashed-filename template instead of the flat one.

Resolved by bumping `tsdown` to `^0.21.10` (which pulls `rolldown-plugin-dts@^0.23.x`
containing the fix from sxzz/rolldown-plugin-dts#132). Build now produces flat
`dist/index.d.ts` and `dist/index.d.cts`, restoring type resolution for all consumers.
