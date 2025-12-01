export interface UseStyleInjectionProps {
  id?: string;
  css: string | string[];
  window?: Window | null;
  insertionPoint?: HTMLElement | null;
  enabled?: boolean;
}
