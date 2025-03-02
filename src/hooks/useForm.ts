import { useState, useMemo, useEffect, useCallback } from 'react';
import { FormValues, UseFormOptions, UseFormReturn, FormErrors } from '../types/common';
import { ShallowPartial } from '../types/utils';

export function useForm<T extends FormValues>(options: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(options.defaultValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [defaultValues] = useState<T>(options.defaultValues);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const isDirty = useMemo(
    () => JSON.stringify(values) !== JSON.stringify(defaultValues),
    [values, defaultValues]
  );

  useEffect(() => {
    const rules = options.validateBy;
    const newErrors: FormErrors = {};

    if (rules) {
      Object.keys(rules).forEach((ruleName) => {
        const validate = rules[ruleName];
        const result = validate(values);

        if (!result.isValid) {
          newErrors[ruleName] = result.message || `\`${ruleName}\` rule validation failed`;
        }
      });
    }

    setErrors(newErrors);
  }, [values]);

  const setPartialValues = useCallback(
    (valuesOrCallback: ShallowPartial<T> | ((prevValues: T) => ShallowPartial<T>)) => {
      setValues((prevValues) => {
        const partialNewValues = Object.entries(
          typeof valuesOrCallback === 'function' ? valuesOrCallback(prevValues) : valuesOrCallback
        ).reduce((acc, [key, value]) => {
          if (value !== undefined) {
            acc[key] = value;
          }
          return acc;
        }, {} as any) as ShallowPartial<T>;

        const newValues = {
          ...prevValues,
          ...partialNewValues
        } as T;

        return newValues;
      });
    },
    []
  );

  const reset = useCallback(() => {
    setValues(defaultValues);
    setErrors({});
  }, [defaultValues]);

  return { values, errors, isValid, isDirty, setValues: setPartialValues, reset };
}
