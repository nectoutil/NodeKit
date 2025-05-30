import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'esm', 'iife'],
    dts: true,
    sourcemap: false
  }
]);
