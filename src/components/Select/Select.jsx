import { memo } from 'react';
import { useValidation } from '../../hooks/useValidation';
import styles from './Select.module.css';

const Select = memo(function Select({
  name,
  label,
  options = [],
  placeholder,
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

      <select
        id={name}
        name={name}
        className={`${styles.select} ${showError ? styles.selectError : ''}`}
        value={value}
        disabled={disabled}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-invalid={!!showError}
      >
        <option value="">{placeholder || 'Select...'}</option>
        {options.map((opt) => {
          const optValue = typeof opt === 'string' ? opt : opt.value;
          const optLabel = typeof opt === 'string' ? opt : opt.label;
          return (
            <option key={optValue} value={optValue}>
              {optLabel}
            </option>
          );
        })}
      </select>

      {showError && (
        <span className={styles.error} role="alert">{error}</span>
      )}
    </div>
  );
});

export default Select;
