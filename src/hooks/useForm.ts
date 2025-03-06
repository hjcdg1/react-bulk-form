import { useState, useMemo, useEffect, useCallback } from 'react';
import type {
  FormValues,
  FormRuleKey,
  UseFormOptions,
  UseFormReturn,
  FormErrors,
  FormRules,
  FormRule
} from '../types/common';
import type { ShallowPartial } from '../types/utils';

export function useForm<V extends FormValues<V>, K extends FormRuleKey = never>(
  options: UseFormOptions<V, K>
): UseFormReturn<V, K> {
  const [values, setValues] = useState<V>(options.defaultValues);
  const [errors, setErrors] = useState<FormErrors<K>>({});
  const [rules, setRules] = useState<FormRules<V, K> | undefined>(options.rules);

  // Keep the initial values passed as props in the first render.
  const [firstDefaultValues] = useState<V>(options.defaultValues);
  const [firstRules] = useState<FormRules<V, K> | undefined>(options.rules);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);
  const isDirty = useMemo(
    () => JSON.stringify(values) !== JSON.stringify(firstDefaultValues),
    [values, firstDefaultValues]
  );

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
        const partialNewValues = Object.entries(
          typeof valuesOrCallback === 'function' ? valuesOrCallback(prevValues) : valuesOrCallback
        ).reduce((acc, [key, value]) => {
          if (value !== undefined) {
            acc[key as keyof V] = value as V[keyof V];
          }
          return acc;
        }, {} as ShallowPartial<V>);

        const newValues = {
          ...prevValues,
          ...partialNewValues
        } as V;

        return newValues;
      });
    },
    []
  );

  const addRule = useCallback((ruleKey: K, rule: FormRule<V>) => {
    setRules((prevRules) => ({ ...prevRules, [ruleKey]: rule }) as FormRules<V, K>);
  }, []);

  const triggerRule = useCallback((ruleKey: K, rule: FormRule<V>) => {
    setErrors((prevErrors) => {
      const result = rule(values);
      return result.isValid
        ? prevErrors
        : {
            ...prevErrors,
            [ruleKey]: result.message || `Validation by \`${ruleKey}\` rule failed`
          };
    });
  }, []);

  const reset = useCallback(() => {
    setValues(firstDefaultValues);
    setErrors({});
    setRules(firstRules);
  }, [firstDefaultValues, firstRules]);

  return useMemo(
    () => ({
      values,
      errors,
      isValid,
      isDirty,
      setValues: setPartialValues,
      addRule,
      triggerRule,
      reset
    }),
    [values, errors, isValid, isDirty, setPartialValues, addRule, triggerRule, reset]
  );
}
