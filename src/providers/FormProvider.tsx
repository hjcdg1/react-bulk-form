import React, { createContext } from 'react';
import { UseFormReturn, FormValues, FormProviderProps } from '../types/common';

export const FormContext = createContext<UseFormReturn<any> | null>(null);

export function FormProvider<T extends FormValues>({ form, children }: FormProviderProps<T>) {
  return <FormContext.Provider value={form}>{children}</FormContext.Provider>;
}
