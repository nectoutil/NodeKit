import type { ReactNode } from 'react';

export interface ElseProps {
  children: ReactNode | Array<ReactNode> | (() => ReactNode);
}
