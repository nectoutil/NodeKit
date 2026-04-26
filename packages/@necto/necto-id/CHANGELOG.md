# @necto/id

## 1.6.8

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
  - @necto/assert@1.0.1
  - @necto/constants@2.0.1
  - @necto/crypto@1.0.1

## 1.6.7

### Patch Changes

- Updated dependencies [023e73e]
  - @necto/constants@2.0.0

## 1.6.5

### Patch Changes

- Add type: module and exports field for proper ESM resolution in Vite

## 1.6.4

### Patch Changes

- Updated dependencies
  - @necto/constants@1.4.4

## 1.6.3

### Patch Changes

- Updated dependencies [e5ea15f]
  - @necto/constants@1.4.3

## 1.6.2

### Patch Changes

- Updated dependencies [f39c992]
  - @necto/constants@1.4.2

## 1.6.1

### Patch Changes

- Updated dependencies [faedceb]
  - @necto/constants@1.4.1

## 1.6.0

### Minor Changes

- 3bd0ef2: Update backlog

### Patch Changes

- Updated dependencies [3bd0ef2]
  - @necto/constants@1.4.0

## 1.5.0

### Minor Changes

- 3f3a40e: Update backlog

### Patch Changes

- Updated dependencies [3f3a40e]
  - @necto/constants@1.3.0

## 1.4.0

### Minor Changes

- 343fcae: Added new release as default

### Patch Changes

- Updated dependencies [343fcae]
  - @necto/constants@1.2.0

## 1.3.0

### Minor Changes

- Fixed error and added sub-dep

## 1.2.0

### Minor Changes

- Fixed code

## 1.1.0

### Minor Changes

- Changed random string generator

## 2.0.0

### Minor Changes

- Added new random id package

### Patch Changes

- Updated dependencies
  - @necto/constants@1.1.0
