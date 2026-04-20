/**
 * Options for the useId hook.
 */
export interface UseIdOptions {
  /** Optional custom prefix for the generated ID. */
  prefix?: string;

  /** Optional default ID to use instead of generating one. */
  defaultId?: string;
}
