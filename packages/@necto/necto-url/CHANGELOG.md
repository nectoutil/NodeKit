# @necto/url

## 1.0.2

### Patch Changes

- 04aba51: Migrate the build toolchain from tsdown to Vite+ (`vp pack`). The ESM build now emits `.mjs` (previously `.js`) and its types `.d.mts`; the CommonJS build (`.cjs`/`.d.cts`) is unchanged. Each package's `exports`, `main`, `module`, and `types` fields are updated to match, so normal package imports resolve exactly as before — only direct-to-`dist/index.js` deep imports are affected.

  This also migrates lint/format from Biome to oxlint/oxfmt (`vp lint` / `vp fmt`), the task runner from Turbo to pnpm, and bumps Vitest 3 → 4. Node 24+ is now required.

## 1.0.1

### Patch Changes

- ad6a4aa: Fix TypeScript imports broken in previous releases due to hashed `.d.ts` filenames.

  Previous releases shipped `dist/index-{hash}.d.ts` and `dist/index-{hash}.d.cts` while
  `package.json` `types` and `exports.types` pointed at `dist/index.d.ts` — causing
  `TS2306` / `TS2307` errors in any consumer importing types. Root cause was a bug in
  `rolldown-plugin-dts@0.13.x` (transitive of `tsdown@0.12.x`) where entry chunks fell
  through to the hashed-filename template instead of the flat one.

  Resolved by bumping `tsdown` to `^0.21.10` (which pulls `rolldown-plugin-dts@^0.23.x`
  containing the fix from sxzz/rolldown-plugin-dts#132). Build now produces flat
  `dist/index.d.ts` and `dist/index.d.cts`, restoring type resolution for all consumers.
