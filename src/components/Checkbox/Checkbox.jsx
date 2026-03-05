import { memo, useCallback } from 'react';
import { useValidation } from '../../hooks/useValidation';
import styles from './Checkbox.module.css';

const Checkbox = memo(function Checkbox({ name, label, validation, disabled }) {
  const { value, error, isTouched, handleChange, handleBlur } = useValidation(name);

  const onChange = useCallback(
    (e) => handleChange(e.target.checked),
    [handleChange]
  );

  const showError = isTouched && error;

  return (
    <div className={styles.wrapper}>
      <div className={styles.field}>
        <input
          id={name}
          name={name}
          type="checkbox"
          className={styles.checkbox}
          checked={!!value}
          disabled={disabled}
          onChange={onChange}
          onBlur={handleBlur}
        />
        {label && (
          <label className={styles.label} htmlFor={name}>
            {label}
          </label>
        )}
      </div>
      {showError && (
        <span className={styles.error} role="alert">{error}</span>
      )}
    </div>
  );
});

export default Checkbox;
