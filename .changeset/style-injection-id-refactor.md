---
"@necto/dom": minor
"@necto-react/hooks": minor
"@necto-react/popper": minor
---

feat: refactor style injection ID system and add global press styles

- **@necto/dom**: `injectStyle` now uses `id` as the user-facing HTML `id` attribute on the `<style>` element. Internal tracking uses auto-generated `necto-style-id` with `ncto-<:hash:>` format. Removed `elementId` option.
- **@necto-react/hooks**: `useStyleInjection` updated to match new `injectStyle` API. `usePress` defaults to `styleInjection: 'global'` which injects a shared `<style id="necto-pressable">` tag for `touch-action`. Added `useIsomorphicLayoutEffect` hook.
- **@necto-react/popper**: Refactored hooks to use consistent `{hookName}.types.ts` naming. Replaced local utilities with shared necto packages. Fixed `PopperArrow` centering and transform merging. Fixed `useTransitionStyles` to derive `transitionProperty` from style keys. Moved `PopperPortal` to components directory. Added `useTransitionStyles` tests.
