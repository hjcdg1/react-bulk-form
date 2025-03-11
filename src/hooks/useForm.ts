import { useState, useMemo, useEffect, useCallback } from 'react';
import { isEqual } from '../utils/isEqual';
import type {
  FormValues,
  FormRuleKey,
  UseFormOptions,
  UseFormReturn,
  FormErrors,
  FormRules
} from '../types/common';

export function useForm<V extends FormValues<V>, R extends FormRuleKey = never>(
  options: UseFormOptions<V, R>
): UseFormReturn<V, R> {
  const [values, setValues] = useState<V>(options.defaultValues);
  const [errors, setErrors] = useState<FormErrors<R>>({});

  const [defaultValues, setDefaultValues] = useState<V>(options.defaultValues);
  const [rules] = useState<FormRules<V, R> | undefined>(
    (options as { rules: FormRules<V, R> | undefined }).rules
  );

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);
  const isDirty = useMemo(() => !isEqual(values, defaultValues), [values, defaultValues]);

  // Validate the form values when the values or the rules change.
  useEffect(() => {
    const newErrors: Record<string, boolean> = {};

    if (rules) {
      Object.keys(rules).forEach((_ruleKey) => {
        const ruleKey = _ruleKey as R;
        const rule = rules[ruleKey];

        if (!rule(values)) {
          newErrors[ruleKey] = true;
        }
      });
    }

    setErrors(newErrors as FormErrors<R>);
  }, [values, rules]);

  const setPartialValues = useCallback(
    (valuesOrCallback: Partial<V> | ((prevValues: V) => Partial<V>)) => {
      setValues((prevValues) => {
        const newPartialValues = Object.entries(
          typeof valuesOrCallback === 'function' ? valuesOrCallback(prevValues) : valuesOrCallback
        ).reduce((acc, [_key, _value]) => {
          const key = _key as keyof V;
          const value = _value as V[typeof key];
          if (value !== undefined) {
            acc[key] = value;
          }
          return acc;
        }, {} as Partial<V>);

        return { ...prevValues, ...newPartialValues };
      });
    },
    []
  );

  const setPartialErrors = useCallback(
    (
      errorsOrCallback:
        | Record<string, boolean>
        | ((prevErrors: FormErrors<R>) => Record<string, boolean>)
    ) => {
      setErrors((prevErrors) => {
        const newPartialErrors = Object.entries(
          typeof errorsOrCallback === 'function' ? errorsOrCallback(prevErrors) : errorsOrCallback
        ).reduce(
          (acc, [key, _value]) => {
            const value = _value as boolean;
            if (value) {
              acc[key] = true;
            } else {
              delete acc[key];
            }
            return acc;
          },
          {} as Record<string, boolean>
        );

        return { ...prevErrors, ...newPartialErrors };
      });
    },
    []
  );

  const reset = useCallback(() => {
    setValues(defaultValues);
    setErrors({});
  }, [defaultValues]);

  const commit = useCallback(() => {
    setDefaultValues(values);
  }, [values]);

  return useMemo(
    () => ({
      values,
      errors,
      flags: { isValid, isDirty },
      setValues: setPartialValues,
      setErrors: setPartialErrors,
      reset,
      commit
    }),
    [values, errors, isValid, isDirty, setPartialValues, setPartialErrors, reset, commit]
  );
}
