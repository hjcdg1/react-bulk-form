import { useContext } from 'react';
import { FormContext } from '../providers/FormProvider';
import { FormValues, UseFormReturn } from '../types/common';

export function useFormContext<T extends FormValues>(): UseFormReturn<T> {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }

  return context as UseFormReturn<T>;
}
