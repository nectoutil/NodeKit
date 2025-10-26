---
'@necto-react/components': patch
---

Fix multiple TypeScript and bundler compatibility issues:

- Remove FC type from If/Else conditional components to prevent TypeScript conflicts
- Fix package.json exports configuration with correct entry points for ESM (index.js) and CommonJS (index.cjs)
- Add proper exports field for Vite and modern bundler compatibility
- Add sideEffects field for CSS handling
- Export style.css for manual stylesheet imports

These changes resolve "cannot be used as a JSX component" errors and Vite import resolution failures.
