import { memo } from 'react';
import { useValidation } from '../../hooks/useValidation';
import styles from './Textarea.module.css';

const Textarea = memo(function Textarea({
  name,
  label,
  placeholder,
  rows = 4,
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

      <textarea
        id={name}
        name={name}
        className={`${styles.textarea} ${showError ? styles.textareaError : ''}`}
        value={value}
        rows={rows}
        placeholder={placeholder || ''}
        disabled={disabled}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-invalid={!!showError}
      />

      {showError && (
        <span className={styles.error} role="alert">{error}</span>
      )}
    </div>
  );
});

export default Textarea;
