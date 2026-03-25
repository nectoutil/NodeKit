/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { defineConfig } from 'tsup';
import { sassPlugin } from 'esbuild-sass-plugin';
import * as sass from 'sass-embedded';
import postcss from 'postcss';
import postcssModules from 'postcss-modules';
import type { Plugin } from 'esbuild';

const STYLE_ATTR = 'data-necto';

function nectoScssModulesPlugin(): Plugin {
  return {
    name: 'necto-scss-modules',
    setup(build) {
      build.onLoad({ filter: /\.module\.scss$/ }, async (args) => {
        const compiled = sass.compile(args.path);

        let classMap: Record<string, string> = {};
        const result = await postcss([
          postcssModules({
            getJSON(_: string, json: Record<string, string>) {
              classMap = json;
            }
          })
        ]).process(compiled.css, { from: args.path });

        return {
          contents: `
var _injected = false;
function _inject() {
  if (_injected || typeof document === 'undefined') return;
  _injected = true;
  var s = document.createElement('style');
  s.setAttribute('${STYLE_ATTR}', '');
  s.textContent = ${JSON.stringify(result.css)};
  document.head.appendChild(s);
}
var _classes = ${JSON.stringify(classMap)};
export default new Proxy(_classes, {
  get: function(target, prop) {
    _inject();
    return target[prop];
  }
});
`,
          loader: 'js'
        };
      });
    }
  };
}

export default defineConfig({
  format: ['esm', 'cjs'],
  entry: ['./src/index.ts'],
  esbuildPlugins: [
    nectoScssModulesPlugin(),
    sassPlugin({
      filter: /\.scss$/,
      type: 'style',
      cache: false
    })
  ],
  dts: true,
  clean: true,
  minify: true,
  sourcemap: true
});
