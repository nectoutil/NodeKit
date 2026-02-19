/**
 * Portions of this file are based on code from the React Aria Spectrum library by Adobe,
 * licensed under the Apache License, Version 2.0.
 * Copyright (c) Adobe. All rights reserved.
 * See: https://github.com/adobe/react-spectrum
 *
 * Modifications copyright (c) Corinvo, LLC. and affiliates. All rights reserved.
 *
 * This file contains code licensed under:
 * - The MIT License (see LICENSE in the root directory) for Corinvo modifications.
 * - The Apache License, Version 2.0 for portions from Adobe.
 *
 * Modifications have been made to adapt the code for use in this project.
 */

/** A validation error message string, or an array of messages. */
export type ValidationError = string | string[];

/** A map of field names to their validation errors, used for server-side error propagation. */
export type ValidationErrors = Record<string, ValidationError>;

/** A function that validates a value and returns error messages, or `true`/`null` for valid. */
export type ValidationFunction<T> = (
  value: T
) => ValidationError | true | null | undefined;

/** The result of validating a form field value. */
export interface ValidationResult {
  /** Whether the value is invalid. */
  isInvalid: boolean;
  /** The validation error messages. */
  validationErrors: string[];
  /** The native validity state details. */
  validationDetails: ValidityState;
}

/** Component-facing validation props for form fields. */
export interface Validation<T> {
  /** Whether the value is invalid. */
  isInvalid?: boolean;
  /**
   * @deprecated Use `isInvalid` instead.
   * Whether the value is valid or invalid.
   */
  validationState?: 'valid' | 'invalid';
  /**
   * Controls when validation errors are displayed.
   * - `'aria'`: errors are displayed in realtime as the user edits.
   * - `'native'`: errors are displayed on form submit or explicit commit.
   * @default 'aria'
   */
  validationBehavior?: 'aria' | 'native';
  /** A custom validation function for the field value. */
  validate?: ValidationFunction<T>;
}

/** Options for the `useFormState` hook. */
export interface UseFormStateOptions<T> extends Validation<T> {
  /** The current value of the form field. */
  value: T | null;
  /** The name of the form field, used to look up server errors from context. */
  name?: string | string[];
  /** Built-in browser validation result, passed from the native element. */
  builtinValidation?: ValidationResult;
}

/** Return type for the `useFormState` hook. */
export interface UseFormStateReturn {
  /** Realtime validation results, updated as the user edits the value. */
  realtimeValidation: ValidationResult;
  /** Currently displayed validation results, updated when the user commits their changes. */
  displayValidation: ValidationResult;
  /** Updates the current validation result. Not displayed to the user until `commitValidation` is called. */
  updateValidation(result: ValidationResult): void;
  /** Resets the displayed validation state to valid when the user resets the form. */
  resetValidation(): void;
  /** Commits the realtime validation so it is displayed to the user. */
  commitValidation(): void;
}
