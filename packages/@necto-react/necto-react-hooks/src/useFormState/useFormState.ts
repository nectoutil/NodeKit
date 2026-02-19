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

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import type { Context } from 'react';
import type {
  UseFormStateOptions,
  UseFormStateReturn,
  ValidationErrors,
  ValidationFunction,
  ValidationResult
} from './useFormState.types';

/** An all-valid `ValidityState` where every constraint passes. */
export const VALID_VALIDITY_STATE: ValidityState = {
  badInput: false,
  customError: false,
  patternMismatch: false,
  rangeOverflow: false,
  rangeUnderflow: false,
  stepMismatch: false,
  tooLong: false,
  tooShort: false,
  typeMismatch: false,
  valueMissing: false,
  valid: true
};

const CUSTOM_VALIDITY_STATE: ValidityState = {
  ...VALID_VALIDITY_STATE,
  customError: true,
  valid: false
};

/** The default validation result representing a valid state. */
export const DEFAULT_VALIDATION_RESULT: ValidationResult = {
  isInvalid: false,
  validationErrors: [],
  validationDetails: VALID_VALIDITY_STATE
};

/** Context for propagating server-side validation errors to form fields. */
export const FormValidationContext: Context<ValidationErrors> =
  createContext<ValidationErrors>({});

/**
 * Private prop key used by parent form components (e.g. a future `useForm`)
 * to pass pre-computed validation state to child fields, avoiding redundant computation.
 */
export const privateValidationStateProp: string =
  '__formValidationState' + Date.now();

/**
 * Manages form field validation state, combining custom validation,
 * built-in browser validation, server errors, and controlled invalid state.
 *
 * Returns realtime and display validation results along with methods
 * to update, reset, and commit validation.
 */
export function useFormState<T>(
  props: UseFormStateOptions<T>
): UseFormStateReturn {
  // If a parent component already computed the validation state, use it directly.
  if (
    (props as unknown as Record<string, unknown>)[privateValidationStateProp]
  ) {
    const {
      realtimeValidation,
      displayValidation,
      updateValidation,
      resetValidation,
      commitValidation
    } = (props as unknown as Record<string, unknown>)[
      privateValidationStateProp
    ] as UseFormStateReturn;
    return {
      realtimeValidation,
      displayValidation,
      updateValidation,
      resetValidation,
      commitValidation
    };
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useFormStateImpl(props);
}

function useFormStateImpl<T>(
  props: UseFormStateOptions<T>
): UseFormStateReturn {
  let {
    isInvalid,
    validationState,
    name,
    value,
    builtinValidation,
    validate,
    validationBehavior = 'aria'
  } = props;

  // backward compatibility.
  if (validationState) {
    isInvalid ||= validationState === 'invalid';
  }

  // If the isInvalid prop is controlled, produce a realtime validation result.
  let controlledError: ValidationResult | null =
    isInvalid !== undefined
      ? {
          isInvalid,
          validationErrors: [],
          validationDetails: CUSTOM_VALIDITY_STATE
        }
      : null;

  // Perform custom client-side validation.
  const clientError: ValidationResult | null = useMemo(() => {
    if (!validate || value == null) {
      return null;
    }
    const errors = runValidate(validate, value);
    return getValidationResult(errors);
  }, [validate, value]);

  // Ignore builtin validation when the native element reports valid.
  if (builtinValidation?.validationDetails.valid) {
    builtinValidation = undefined;
  }

  // Read server errors from context.
  const serverErrors = useContext(FormValidationContext);
  const serverErrorMessages = useMemo(() => {
    if (name) {
      return Array.isArray(name)
        ? name.flatMap((n) => asArray(serverErrors[n]))
        : asArray(serverErrors[name]);
    }
    return [];
  }, [serverErrors, name]);

  // Show server errors when the form receives new ones; clear when the user modifies the value.
  const [lastServerErrors, setLastServerErrors] = useState(serverErrors);
  const [isServerErrorCleared, setServerErrorCleared] = useState(false);
  if (serverErrors !== lastServerErrors) {
    setLastServerErrors(serverErrors);
    setServerErrorCleared(false);
  }

  const serverError: ValidationResult | null = useMemo(
    () => getValidationResult(isServerErrorCleared ? [] : serverErrorMessages),
    [isServerErrorCleared, serverErrorMessages]
  );

  // Track the next validation state in a ref until commitValidation is called.
  const nextValidation = useRef(DEFAULT_VALIDATION_RESULT);
  const [currentValidity, setCurrentValidity] = useState(
    DEFAULT_VALIDATION_RESULT
  );

  const lastError = useRef(DEFAULT_VALIDATION_RESULT);
  const commitValidationEffect = () => {
    if (!commitQueued) {
      return;
    }

    setCommitQueued(false);
    const error = clientError || builtinValidation || nextValidation.current;
    if (!isEqualValidation(error, lastError.current)) {
      lastError.current = error;
      setCurrentValidity(error);
    }
  };

  const [commitQueued, setCommitQueued] = useState(false);
  useEffect(commitValidationEffect);

  // realtimeValidation updates the native input element's state based on custom validation logic.
  // displayValidation is the currently displayed state the user sees (e.g. on input change/form submit).
  // With validationBehavior="aria", all errors are displayed in realtime rather than on submit.
  const realtimeValidation =
    controlledError ||
    serverError ||
    clientError ||
    builtinValidation ||
    DEFAULT_VALIDATION_RESULT;

  const displayValidation =
    validationBehavior === 'native'
      ? controlledError || serverError || currentValidity
      : controlledError ||
        serverError ||
        clientError ||
        builtinValidation ||
        currentValidity;

  return {
    realtimeValidation,
    displayValidation,
    updateValidation(result) {
      if (
        validationBehavior === 'aria' &&
        !isEqualValidation(currentValidity, result)
      ) {
        setCurrentValidity(result);
      } else {
        nextValidation.current = result;
      }
    },
    resetValidation() {
      const error = DEFAULT_VALIDATION_RESULT;
      if (!isEqualValidation(error, lastError.current)) {
        lastError.current = error;
        setCurrentValidity(error);
      }

      // Do not commit validation after the next render to avoid a condition where
      // components call commitValidation inside an onReset handler.
      if (validationBehavior === 'native') {
        setCommitQueued(false);
      }

      setServerErrorCleared(true);
    },
    commitValidation() {
      // Commit validation state so the user sees it on blur/change/submit.
      // Also clear any server errors. Wait until after the next render to commit
      // so that the latest value has been validated.
      if (validationBehavior === 'native') {
        setCommitQueued(true);
      }
      setServerErrorCleared(true);
    }
  };
}

function asArray<T>(v: T | T[]): T[] {
  if (!v) {
    return [];
  }
  return Array.isArray(v) ? v : [v];
}

function runValidate<T>(validate: ValidationFunction<T>, value: T): string[] {
  if (typeof validate === 'function') {
    const e = validate(value);
    if (e && typeof e !== 'boolean') {
      return asArray(e);
    }
  }
  return [];
}

function getValidationResult(errors: string[]): ValidationResult | null {
  return errors.length
    ? {
        isInvalid: true,
        validationErrors: errors,
        validationDetails: CUSTOM_VALIDITY_STATE
      }
    : null;
}

function isEqualValidation(
  a: ValidationResult | null,
  b: ValidationResult | null
): boolean {
  if (a === b) {
    return true;
  }

  return (
    !!a &&
    !!b &&
    a.isInvalid === b.isInvalid &&
    a.validationErrors.length === b.validationErrors.length &&
    a.validationErrors.every((e, i) => e === b.validationErrors[i]) &&
    Object.entries(a.validationDetails).every(
      ([k, v]) => b.validationDetails[k as keyof ValidityState] === v
    )
  );
}

/**
 * Merges multiple validation results into one, combining error messages
 * and validity details. Useful for group components (e.g. checkbox groups).
 */
export function mergeValidation(
  ...results: ValidationResult[]
): ValidationResult {
  const errors = new Set<string>();
  let isInvalid = false;
  const validationDetails: Record<string, boolean> = {
    ...VALID_VALIDITY_STATE
  };

  for (const v of results) {
    for (const e of v.validationErrors) {
      errors.add(e);
    }
    isInvalid ||= v.isInvalid;
    for (const key in validationDetails) {
      validationDetails[key] ||= v.validationDetails[
        key as keyof ValidityState
      ] as boolean;
    }
  }

  validationDetails.valid = !isInvalid;
  return {
    isInvalid,
    validationErrors: [...errors],
    validationDetails: validationDetails as unknown as ValidityState
  };
}
