# @necto/types

## 1.4.0

### Minor Changes

- d435091: Add `useEventListener` and `useOnClickOutside` hooks.

  ## `useEventListener`

  Subscribe to a DOM event for the lifetime of a component. Single signature
  with conditional types — narrows event payload from the target ref:

  ```tsx
  // Window event (default target)
  useEventListener("resize", handleResize);

  // Element event — `event` typed as MouseEvent automatically
  const buttonRef = useRef<HTMLButtonElement>(null);
  useEventListener("click", (event) => console.log(event.button), buttonRef);

  // MediaQueryList — `event` typed as MediaQueryListEvent automatically
  const mql = useRef(window.matchMedia("(prefers-color-scheme: dark)"));
  useEventListener("change", (event) => setDark(event.matches), mql);
  ```

  Supports targets: `Window`, `Document`, `HTMLElement`, `SVGElement`,
  `MediaQueryList`. Includes an `enabled` option for toggling the
  subscription without unmounting the host component.

  ## `useOnClickOutside`

  Fire a handler when an interaction happens outside one or more refs.
  Composes on top of `useEventListener`:

  ```tsx
  const menuRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(menuRef, () => setOpen(false));

  // Multiple refs — handler only fires when target is outside all of them
  useOnClickOutside([menuRef, triggerRef], close, { eventType: "mouseup" });
  ```

  Defaults: `eventType: 'mousedown'` (fastest dismiss), listener attached
  with `{ passive: true }` since the hook never calls `preventDefault`.
  Skips if the click target is detached from the document.

  ## `InteractionEventName` type added to `@necto/types`

  Shared string-literal union covering pointer-down/up, touch-start/end, and
  focus-in/out events. Used by `useOnClickOutside` and intended for any
  hook that exposes a configurable interaction-trigger event name.

## 1.3.2

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

## 1.3.1

### Patch Changes

- Add ESM module support with type: module, exports, and dual format output

## 1.3.0

### Minor Changes

- 3bd0ef2: Update backlog

## 1.2.0

### Minor Changes

- 3f3a40e: Update backlog

## 1.1.0

### Minor Changes

- 343fcae: Added new release as default
