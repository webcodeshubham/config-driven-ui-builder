import { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { validateField, validateForm } from '../utils/validationUtils';
import { extractFields } from '../utils/schemaParser';

const FormContext = createContext(null);

const ACTION = {
  SET_VALUE: 'SET_VALUE',
  SET_ERROR: 'SET_ERROR',
  SET_ERRORS: 'SET_ERRORS',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_TOUCHED: 'SET_TOUCHED',
  RESET: 'RESET',
  SET_SUBMITTING: 'SET_SUBMITTING',
};

function formReducer(state, action) {
  switch (action.type) {
    case ACTION.SET_VALUE:
      return {
        ...state,
        formValues: { ...state.formValues, [action.field]: action.value },
      };
    case ACTION.SET_ERROR:
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.error },
      };
    case ACTION.SET_ERRORS:
      return { ...state, errors: action.errors };
    case ACTION.CLEAR_ERROR: {
      const next = { ...state.errors };
      delete next[action.field];
      return { ...state, errors: next };
    }
    case ACTION.SET_TOUCHED:
      return {
        ...state,
        touched: { ...state.touched, [action.field]: true },
      };
    case ACTION.RESET:
      return {
        formValues: action.initialValues,
        errors: {},
        touched: {},
        isSubmitting: false,
      };
    case ACTION.SET_SUBMITTING:
      return { ...state, isSubmitting: action.value };
    default:
      return state;
  }
}

export function FormProvider({ schema, onSubmit, children }) {
  const fields = useMemo(() => extractFields(schema), [schema]);

  const initialValues = useMemo(() => {
    const vals = {};
    for (const f of fields) vals[f.name] = f.defaultValue;
    return vals;
  }, [fields]);

  const [state, dispatch] = useReducer(formReducer, {
    formValues: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
  });

  const fieldMeta = useMemo(() => {
    const map = {};
    for (const f of fields) map[f.name] = f;
    return map;
  }, [fields]);

  const updateField = useCallback((field, value) => {
    dispatch({ type: ACTION.SET_VALUE, field, value });
  }, []);

  const validateSingleField = useCallback(
    (field) => {
      const meta = fieldMeta[field];
      if (!meta?.validation) return null;
      const error = validateField(
        state.formValues[field],
        meta.validation,
        meta.label,
        state.formValues
      );
      if (error) {
        dispatch({ type: ACTION.SET_ERROR, field, error });
      } else {
        dispatch({ type: ACTION.CLEAR_ERROR, field });
      }
      return error;
    },
    [fieldMeta, state.formValues]
  );

  const touchField = useCallback((field) => {
    dispatch({ type: ACTION.SET_TOUCHED, field });
  }, []);

  const submitForm = useCallback(
    (e) => {
      if (e?.preventDefault) e.preventDefault();

      const schemaChildren = schema.children || [];
      const errors = validateForm(state.formValues, schemaChildren);

      dispatch({ type: ACTION.SET_ERRORS, errors });

      if (Object.keys(errors).length > 0) return;

      dispatch({ type: ACTION.SET_SUBMITTING, value: true });

      const result = onSubmit?.(state.formValues);

      if (result && typeof result.then === 'function') {
        result.finally(() => dispatch({ type: ACTION.SET_SUBMITTING, value: false }));
      } else {
        dispatch({ type: ACTION.SET_SUBMITTING, value: false });
      }
    },
    [schema, state.formValues, onSubmit]
  );

  const resetForm = useCallback(() => {
    dispatch({ type: ACTION.RESET, initialValues });
  }, [initialValues]);

  const contextValue = useMemo(
    () => ({
      formValues: state.formValues,
      errors: state.errors,
      touched: state.touched,
      isSubmitting: state.isSubmitting,
      updateField,
      validateField: validateSingleField,
      touchField,
      submitForm,
      resetForm,
    }),
    [state, updateField, validateSingleField, touchField, submitForm, resetForm]
  );

  return (
    <FormContext.Provider value={contextValue}>
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const ctx = useContext(FormContext);
  if (!ctx) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return ctx;
}

export default FormContext;
