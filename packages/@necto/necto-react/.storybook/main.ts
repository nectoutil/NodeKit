import type { StorybookConfig } from '@storybook/react-vite';
import path from 'node:path';

const packagesRoot = path.resolve(__dirname, '../../..');

// Map workspace package names to their source entry points so Vite
// doesn't resolve to CJS dist/ bundles.
const workspaceAliases: Record<string, string> = {
  // @necto-react packages
  '@necto-react/hooks': path.join(
    packagesRoot,
    '@necto-react/necto-react-hooks/src/index.ts'
  ),
  '@necto-react/helpers': path.join(
    packagesRoot,
    '@necto-react/necto-react-helpers/src/index.ts'
  ),
  '@necto-react/popper': path.join(
    packagesRoot,
    '@necto-react/necto-react-popper/src/index.ts'
  ),
  '@necto-react/types': path.join(
    packagesRoot,
    '@necto-react/necto-react-types/src/index.ts'
  ),
  '@necto-react/components': path.join(
    packagesRoot,
    '@necto-react/necto-react-components/src/index.ts'
  ),
  // @necto packages
  '@necto/dom': path.join(packagesRoot, '@necto/necto-dom/src/index.ts'),
  '@necto/popper': path.join(packagesRoot, '@necto/necto-popper/src/index.ts'),
  '@necto/types': path.join(packagesRoot, '@necto/necto-types/src/index.ts'),
  '@necto/mergers': path.join(
    packagesRoot,
    '@necto/necto-mergers/src/index.ts'
  ),
  '@necto/platform': path.join(
    packagesRoot,
    '@necto/necto-platform/src/index.ts'
  ),
  '@necto/strings': path.join(
    packagesRoot,
    '@necto/necto-strings/src/index.ts'
  ),
  '@necto/id': path.join(packagesRoot, '@necto/necto-id/src/index.ts')
};

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
      ...workspaceAliases
    };
    return config;
  }
};

export default config;
