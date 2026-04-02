---
"@necto/dom": patch
"@necto-react/hooks": patch
---

fix: rename internal style tracking attribute to data-style-id, fix usePress CSS formatting

- **@necto/dom**: Renamed internal style tracking attribute from `necto-style-id` to `data-style-id`. The `id` option on `injectStyle` now sets the user-facing HTML `id` attribute. Internal tracking ID auto-generated as `necto-<:hash:>`.
- **@necto-react/hooks**: Fixed `usePress` CSS template to output clean indentation in the injected `<style>` tag.
