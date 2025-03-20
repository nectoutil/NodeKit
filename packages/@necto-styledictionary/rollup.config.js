import copy from 'rollup-plugin-copy';
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
    terser(),
    resolve(),
    typescript(),
    copy({
      targets: [
        { src: 'src/filters/*', dest: 'dist/filters' }
      ]
    })
  ]
};
