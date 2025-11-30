import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: false,
    splitting: false,
    clean: true,
    cjsInterop: true,
    platform: 'neutral',
    minify: true,
    outExtension({ format }) {
      return {
        js: format === 'cjs' ? '.cjs' : '.mjs'
      };
    }
  }
]);
