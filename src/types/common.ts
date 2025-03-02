import { ReactNode } from 'react';
import { ShallowPartial } from './utils';

export type FormValues = Record<string, NonNullable<unknown> | null>;

export type FormErrors = Record<string, string>;

export type UseFormOptions<T extends FormValues> = {
  defaultValues: T;
  validateBy?: Record<
    string,
    (values: T) => { isValid: true } | { isValid: false; message?: string }
  >;
};

export type UseFormReturn<T extends FormValues> = {
  values: T;
  errors: FormErrors;
  isValid: boolean;
  isDirty: boolean;
  setValues: (valuesOrCallback: ShallowPartial<T> | ((prevValues: T) => ShallowPartial<T>)) => void;
  reset: () => void;
};

export type FormProviderProps<T extends FormValues> = {
  form: UseFormReturn<T>;
  children: ReactNode;
};
