---
'@necto/dom': patch
'@necto/constants': patch
---

Fix package.json exports configuration for ESM/CommonJS compatibility. Added proper exports field and type: "module" to resolve Vite import errors when used as dependencies.
