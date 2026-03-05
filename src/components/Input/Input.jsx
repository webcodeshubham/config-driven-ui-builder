import { memo } from 'react';
import { useValidation } from '../../hooks/useValidation';
import styles from './Input.module.css';

/**
 * Schema-driven input field.
 *
 * Memo is applied because the Renderer re-renders all children when
 * any form value changes; memoising prevents re-painting fields whose
 * own value + error have not changed.
 */
const Input = memo(function Input({
  name,
  label,
  placeholder,
  inputType = 'text',
  hint,
  validation,
  disabled,
}) {
  const { value, error, isTouched, handleChange, handleBlur } = useValidation(name);

  const showError = isTouched && error;
  const isRequired = validation?.required;

  return (
    <div className={styles.field}>
      {label && (
        <label className={styles.label} htmlFor={name}>
          {label}
          {isRequired && <span className={styles.required}>*</span>}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={inputType}
        className={`${styles.input} ${showError ? styles.inputError : ''}`}
        value={value}
        placeholder={placeholder || ''}
        disabled={disabled}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-invalid={!!showError}
        aria-describedby={showError ? `${name}-error` : undefined}
      />

      {hint && !showError && <span className={styles.hint}>{hint}</span>}
      {showError && (
        <span id={`${name}-error`} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
});

export default Input;
