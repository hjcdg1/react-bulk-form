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
import type { ShallowPartial } from '../types/utils';

export function useForm<V extends FormValues<V>, K extends FormRuleKey = never>(
  options: UseFormOptions<V, K>
): UseFormReturn<V, K> {
  const [values, setValues] = useState<V>(options.defaultValues);
  const [errors, setErrors] = useState<FormErrors<K>>({});

  const [defaultValues, setDefaultValues] = useState<V>(options.defaultValues);
  const [rules] = useState<FormRules<V, K> | undefined>(options.rules);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);
  const isDirty = useMemo(() => !isEqual(values, defaultValues), [values, defaultValues]);

  // Validate the form values when the values or the rules change.
  useEffect(() => {
    const newErrors: FormErrors<K> = {};

    if (rules) {
      Object.keys(rules).forEach((_ruleKey) => {
        const ruleKey = _ruleKey as keyof typeof rules;
        const rule = rules[ruleKey];
        const result = rule!(values);

        if (!result.isValid) {
          newErrors[ruleKey] = result.message || `Validation by \`${ruleKey}\` rule failed`;
        }
      });
    }

    setErrors(newErrors);
  }, [values, rules]);

  const setPartialValues = useCallback(
    (valuesOrCallback: ShallowPartial<V> | ((prevValues: V) => ShallowPartial<V>)) => {
      setValues((prevValues) => {
        const newPartialValues = Object.entries(
          typeof valuesOrCallback === 'function' ? valuesOrCallback(prevValues) : valuesOrCallback
        ).reduce((acc, [key, value]) => {
          if (value !== undefined) {
            acc[key as keyof V] = value as V[keyof V];
          }
          return acc;
        }, {} as ShallowPartial<V>);

        const newValues = {
          ...prevValues,
          ...newPartialValues
        } as V;

        return newValues;
      });
    },
    []
  );

  const setPartialErrors = useCallback(
    (errorsOrCallback: FormErrors<K> | ((prevErrors: FormErrors<K>) => FormErrors<K>)) => {
      setErrors((prevErrors) => {
        const newPartialErrors =
          typeof errorsOrCallback === 'function' ? errorsOrCallback(prevErrors) : errorsOrCallback;

        const newErrors = {
          ...prevErrors,
          ...newPartialErrors
        };

        return newErrors;
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
