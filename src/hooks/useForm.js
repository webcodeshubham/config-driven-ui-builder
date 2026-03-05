import { useMemo } from 'react';
import { useFormContext } from '../context/FormContext';

/**
 * Convenience hook that exposes the full form API alongside
 * derived helpers such as `isValid` and `isDirty`.
 */
export function useForm() {
  const ctx = useFormContext();

  const isValid = useMemo(
    () => Object.keys(ctx.errors).length === 0,
    [ctx.errors]
  );

  return {
    ...ctx,
    isValid,
  };
}
