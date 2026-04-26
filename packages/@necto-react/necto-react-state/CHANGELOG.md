# @necto-react/state

## 0.2.2

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

- Updated dependencies [ad6a4aa]
  - @necto/state@0.0.3

## 0.2.1

### Patch Changes

- Updated dependencies [675ff23]
  - @necto/state@0.0.2

## 0.2.0

### Minor Changes

- b53176e: Added leftover changes

## 0.1.0

### Minor Changes

- d003ea7: Updated minor api erros and added some small features
