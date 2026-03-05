import { memo, useCallback } from 'react';
import { useFormContext } from '../../context/FormContext';
import styles from './Button.module.css';

const Button = memo(function Button({
  label,
  buttonType = 'submit',
  variant = 'primary',
  fullWidth = false,
  disabled,
  onClick,
}) {
  const { submitForm, isSubmitting, resetForm } = useFormContext();

  const handleClick = useCallback(
    (e) => {
      if (onClick) return onClick(e);
      if (buttonType === 'reset') return resetForm();
      if (buttonType === 'submit') return submitForm(e);
    },
    [onClick, buttonType, submitForm, resetForm]
  );

  const classNames = [
    styles.button,
    styles[variant] || styles.primary,
    fullWidth ? styles.fullWidth : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={buttonType === 'submit' ? 'submit' : 'button'}
      className={classNames}
      disabled={disabled || isSubmitting}
      onClick={handleClick}
    >
      {isSubmitting ? 'Submitting...' : label}
    </button>
  );
});

export default Button;
