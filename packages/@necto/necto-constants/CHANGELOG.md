# @necto/constants

## 2.0.1

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

## 2.0.0

### Major Changes

- 023e73e: **Breaking change:** The `NUMERIC` export has been removed. It duplicated `numbers.json`'s content (just `DIGITS` in a different order). Use `NUMBERS.DIGITS` instead, which additionally exposes `NUMBERS.PADDED_DIGITS`.

  ```diff
  - import { NUMERIC } from '@necto/constants';
  - NUMERIC.NUMERIC_DIGITS;
  + import { NUMBERS } from '@necto/constants';
  + NUMBERS.DIGITS;
  + NUMBERS.PADDED_DIGITS; // bonus — now also exposed
  ```

  ***

  Expand `@necto/constants` with spec-sourced web platform data, bundled at build time (zero new runtime dependencies).

  **`DOM` namespace expanded:**

  - `DOM.HTML_TAGS` — now sourced from `html-tags` (auto-updates with HTML spec)
  - `DOM.ARIA_ATTRIBUTES` — now sourced from `aria-attributes` (auto-updates with WAI-ARIA spec)
  - `DOM.ELEMENT_ATTRIBUTES` — new: element → attributes map, sourced from `html-element-attributes`
  - `DOM.VOID_ELEMENTS` — new: void element list, sourced from `html-void-elements`
  - `DOM.PRIMITIVE_TAGS` — unchanged, still Necto-curated

  **New namespaces:**

  - **`SVG`** — `SVG.TAGS` (from `svg-tag-names`), `SVG.ELEMENT_ATTRIBUTES` (from `svg-element-attributes`)
  - **`CSS`** — `CSS.COLOR_NAMES` (CSS4 named color → hex map, from `css-color-names`)
  - **`HTTP`** — `HTTP.STATUS_CODES`, `HTTP.REASON_PHRASES` (from `http-status-codes`)
  - **`ANCHOR`** — `ANCHOR.PROPS` (React-prop-cased anchor attribute list, hand-maintained for JSX consumers)
  - **`NUMBERS`** — `NUMBERS.DIGITS`, `NUMBERS.PADDED_DIGITS` (replaces the removed `NUMERIC` export)

  All source packages (`aria-attributes`, `css-color-names`, `html-element-attributes`, `html-tags`, `html-void-elements`, `http-status-codes`, `svg-element-attributes`, `svg-tag-names`) are declared as `devDependencies` **and** listed in the tsdown config's `noExternal` allowlist — their contents are inlined into the built `dist` so consumers of `@necto/constants` install no new runtime dependencies.

  Usage:

  ```ts
  import { DOM, SVG, CSS, HTTP, ANCHOR, NUMBERS } from "@necto/constants";

  DOM.HTML_TAGS; // spec-sourced HTML tag list
  DOM.ARIA_ATTRIBUTES; // spec-sourced ARIA attribute list
  DOM.ELEMENT_ATTRIBUTES.a; // anchor attrs, lowercase (DOM style)
  DOM.VOID_ELEMENTS; // ['area', 'base', 'br', 'col', ...]
  DOM.PRIMITIVE_TAGS; // Necto-curated polymorphic base tags

  SVG.TAGS; // full SVG element list
  SVG.ELEMENT_ATTRIBUTES.rect; // SVG rect attrs

  CSS.COLOR_NAMES.aliceblue; // '#f0f8ff'

  HTTP.STATUS_CODES.NOT_FOUND; // 404
  HTTP.REASON_PHRASES.NOT_FOUND; // 'Not Found'

  ANCHOR.PROPS; // React-cased: ['rel', 'href', 'hrefLang', ...]

  NUMBERS.DIGITS; // ['0','1',...,'9']
  NUMBERS.PADDED_DIGITS; // ['00','01',...,'09']
  ```

## 1.4.4

### Patch Changes

- Add exports field and type: module for proper ESM resolution

## 1.4.3

### Patch Changes

- e5ea15f: Fixed minor errors

## 1.4.2

### Patch Changes

- f39c992: Added minor fixes

## 1.4.1

### Patch Changes

- faedceb: Added minor fixes

## 1.4.0

### Minor Changes

- 3bd0ef2: Update backlog

## 1.3.0

### Minor Changes

- 3f3a40e: Update backlog

## 1.2.0

### Minor Changes

- 343fcae: Added new release as default

## 1.1.0

### Minor Changes

- Added new random id package
