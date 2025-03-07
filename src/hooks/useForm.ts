import { useState, useMemo, useEffect, useCallback } from 'react';
import { useForm as useReactHookForm, DefaultValues } from 'react-hook-form';
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
  // react-hook-form 사용
  const methods = useReactHookForm<V>({
    defaultValues: options.defaultValues as DefaultValues<V>,
    mode: 'onChange'
  });

  const {
    control,
    watch,
    formState: { isDirty },
    setValue,
    reset: rhfReset,
    getValues
  } = methods;

  // rules 상태 관리
  const [rules, setRules] = useState<FormRules<V, K> | undefined>(options.rules);

  // Keep the initial values passed as props in the first render.
  const [firstDefaultValues] = useState<V>(options.defaultValues);
  const [firstRules] = useState<FormRules<V, K> | undefined>(options.rules);

  // 사용자 지정 오류 상태
  const [customErrors, setCustomErrors] = useState<FormErrors<K>>({});

  // values 모니터링
  const values = watch();

  // 오류 객체 통합
  const errors = useMemo(() => {
    return { ...customErrors } as FormErrors<K>;
  }, [customErrors]);

  // 유효성 여부 확인
  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const setPartialValues = useCallback(
    (valuesOrCallback: ShallowPartial<V> | ((prevValues: V) => ShallowPartial<V>)) => {
      const partialNewValues =
        typeof valuesOrCallback === 'function' ? valuesOrCallback(getValues()) : valuesOrCallback;

      Object.entries(partialNewValues).forEach(([key, value]) => {
        if (value !== undefined) {
          setValue(key as any, value as any);
        }
      });
    },
    [setValue, getValues]
  );

  // 규칙 추가
  const addRule = useCallback((ruleKey: K, rule: FormRule<V>) => {
    setRules((prevRules) => ({ ...prevRules, [ruleKey]: rule }) as FormRules<V, K>);
  }, []);

  // 규칙 트리거
  const triggerRule = useCallback(
    (ruleKey: K, rule: FormRule<V>) => {
      const result = rule(values);
      if (!result.isValid) {
        setCustomErrors((prev) => ({
          ...prev,
          [ruleKey]: result.message || `Validation by \`${ruleKey}\` rule failed`
        }));
      } else {
        setCustomErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[ruleKey];
          return newErrors;
        });
      }
    },
    [values]
  );

  // 커스텀 규칙 검사
  useEffect(() => {
    const newErrors: FormErrors<K> = {};

    if (rules) {
      Object.keys(rules).forEach((_ruleKey) => {
        const ruleKey = _ruleKey as keyof typeof rules;
        const rule = rules[ruleKey];
        if (rule) {
          const result = rule(values);
          if (!result.isValid) {
            newErrors[ruleKey] = result.message || `Validation by \`${ruleKey}\` rule failed`;
          }
        }
      });
    }

    setCustomErrors(newErrors);
  }, [values, rules]);

  // 리셋 함수
  const reset = useCallback(() => {
    rhfReset(firstDefaultValues as DefaultValues<V>);
    setCustomErrors({});
    setRules(firstRules);
  }, [rhfReset, firstDefaultValues, firstRules]);

  return useMemo(
    () => ({
      values,
      errors,
      isValid,
      isDirty,
      control,
      setValues: setPartialValues,
      addRule,
      triggerRule,
      reset,
      methods // 전체 methods 객체 추가
    }),
    [
      values,
      errors,
      isValid,
      isDirty,
      control,
      setPartialValues,
      addRule,
      triggerRule,
      reset,
      methods
    ]
  );
}
