import React, { createContext } from 'react';
import type { UseFormReturn, FormValues, FormRuleKey, FormProviderProps } from '../types/common';

export const FormContext = createContext<UseFormReturn<any, any> | null>(null);

export function FormProvider<V extends FormValues<V>, K extends FormRuleKey>({
  form,
  children
}: FormProviderProps<V, K>) {
  return <FormContext.Provider value={form}>{children}</FormContext.Provider>;
}
