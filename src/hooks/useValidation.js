import { useCallback } from 'react';
import { useFormContext } from '../context/FormContext';

/**
 * Hook that wires a single field's validation into the form context.
 * Returns handlers the Input (or any field component) can attach to
 * onChange, onBlur, and an imperative `validate` call.
 *
 * @param {string} name - Field name matching the schema `name` prop
 */
export function useValidation(name) {
  const {
    formValues,
    errors,
    touched,
    updateField,
    validateField,
    touchField,
  } = useFormContext();

  const value = formValues[name] ?? '';
  const error = errors[name] || null;
  const isTouched = touched[name] || false;

  const handleChange = useCallback(
    (rawValue) => {
      const next = rawValue?.target !== undefined ? rawValue.target.value : rawValue;
      updateField(name, next);

      // Re-validate on change only if the field was already touched
      if (isTouched) {
        // Defer so the context value has settled before validation reads it.
        // The validateField callback already reads from the latest state via
        // the reducer, but scheduling keeps the update batching cleaner.
        queueMicrotask(() => validateField(name));
      }
    },
    [name, updateField, validateField, isTouched]
  );

  const handleBlur = useCallback(() => {
    touchField(name);
    validateField(name);
  }, [name, touchField, validateField]);

  const validate = useCallback(() => validateField(name), [name, validateField]);

  return {
    value,
    error,
    isTouched,
    handleChange,
    handleBlur,
    validate,
  };
}
