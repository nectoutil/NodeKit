# @necto-react/state

## 0.3.0

### Minor Changes

- d435091: Add a signal-style API to `useLocalState` while keeping the tuple destructure
  working. The result object now supports both access styles on the same value:

  ```tsx
  // Tuple style (unchanged — works exactly as before):
  const [count, setCount] = useLocalState(0);

  // Signal style (new):
  const counter = useLocalState(0);
  counter.value; // current value
  counter.set(123); // direct setter
  counter.update((c) => c + 1); // functional updater
  counter.reset(); // restore initial value
  ```

  Both styles read and write the same underlying state. Pick whichever reads
  better at the call site, or mix them in the same component:

  ```tsx
  const counter = useLocalState(0);
  const [count, setCount] = counter; // ← also works
  counter.set(10); // ← also works on the same object
  ```

  `.reset()` already existed in prior releases; `.value`, `.set()`, and
  `.update()` are new. No breaking changes — existing tuple-destructure code
  continues to work without modification.

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
