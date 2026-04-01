import type { StorybookConfig } from '@storybook/react-vite';
import path from 'node:path';
import fs from 'node:fs';

const packagesRoot = path.resolve(__dirname, '../../..');

// Dynamically map all workspace package names to their source entry points
// so Vite resolves to TS source instead of CJS dist/ bundles.
function getWorkspaceAliases(): Record<string, string> {
  const aliases: Record<string, string> = {};

  for (const scope of ['@necto', '@necto-react']) {
    const scopeDir = path.join(packagesRoot, scope);
    if (!fs.existsSync(scopeDir)) continue;

    for (const pkg of fs.readdirSync(scopeDir)) {
      const srcIndex = path.join(scopeDir, pkg, 'src', 'index.ts');
      if (!fs.existsSync(srcIndex)) continue;

      const pkgJsonPath = path.join(scopeDir, pkg, 'package.json');
      if (!fs.existsSync(pkgJsonPath)) continue;

      const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
      aliases[pkgJson.name] = srcIndex;
    }
  }

  return aliases;
}

const config: StorybookConfig = {
  stories: [
    '../../../@necto-react/**/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  core: {
    disableTelemetry: true
  },
  viteFinal: async (config) => {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...((config.resolve.alias as Record<string, string>) ?? {}),
      ...getWorkspaceAliases()
    };
    return config;
  }
};

export default config;
