# @necto-react/types

## 2.4.2

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

## 2.4.1

### Patch Changes

- Add type: module and exports field for proper ESM resolution in Vite

## 2.4.0

### Minor Changes

- d6ea5b7: Added new changes

## 2.3.0

### Minor Changes

- 3bd0ef2: Update backlog

## 2.2.0

### Minor Changes

- 3f3a40e: Update backlog

## 2.1.0

### Minor Changes

- 343fcae: Added new release as default

## 2.0.0

### Major Changes

- fixed packages
