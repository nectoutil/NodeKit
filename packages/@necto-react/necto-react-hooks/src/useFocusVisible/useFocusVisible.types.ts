/**
 * Options for the useFocusVisible hook.
 */
export interface UseFocusVisibleOptions {
  /** Whether the target element is a text input. */
  isTextInput?: boolean;

  /** Whether the element should automatically receive focus when mounted. */
  autoFocus?: boolean;
}

/**
 * Return value for the useFocusVisible hook.
 */
export interface UseFocusVisibleReturn {
  /** Whether focus is currently visible (e.g., due to keyboard navigation). */
  isFocusVisible: boolean;
}
