import { memo, useCallback } from 'react';
import { useFormContext } from '../../context/FormContext';
import styles from './Form.module.css';

const Form = memo(function Form({ title, description, children }) {
  const { submitForm } = useFormContext();

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      submitForm();
    },
    [submitForm]
  );

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {title && <h2 className={styles.title}>{title}</h2>}
      {description && <p className={styles.description}>{description}</p>}
      {children}
    </form>
  );
});

export default Form;
