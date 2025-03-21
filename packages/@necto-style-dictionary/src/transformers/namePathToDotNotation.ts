import { camelCase } from 'change-case';

import type { PlatformConfig, Transform, TransformedToken } from 'style-dictionary/types';

export const namePathToDotNotation: Transform = {
  name: 'name/pathToDotNotation',
  type: 'name',
  transform: (token: TransformedToken, options?: PlatformConfig): string => {
    return (
      [options?.prefix, ...token.path]
        .filter((part: unknown): part is string => typeof part === 'string' && part !== '@')
        .map((part: string) => camelCase(part))
        .join('.')
    )
  }
}
