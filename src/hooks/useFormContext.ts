import { useContext } from 'react';
import { FormContext } from '../providers/FormProvider';
import type { FormValues, FormRuleKey, UseFormReturn } from '../types/common';

export function useFormContext<
  V extends FormValues<V>,
  K extends FormRuleKey = never
>(): UseFormReturn<V, K> {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }

  return context as UseFormReturn<V, K>;
}
