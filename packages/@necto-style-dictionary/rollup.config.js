import packageJson from './package.json' with { type: 'json' };

import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.min.js',
    format: 'esm',
    sourcemap: false,
  },
  external: ['style-dictionary'],
  plugins: [
    replace({
      __PACKAGE_NAME__: () => JSON.stringify(packageJson.name),
    }),
    json(),
    terser(),
    resolve(),
    typescript()
  ]
};
