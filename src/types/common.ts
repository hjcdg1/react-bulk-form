import type { ReactNode } from 'react';
import type { ShallowPartial } from './utils';

export type FormValues<V> = { [K in keyof V]: undefined extends V[K] ? never : V[K] };

export type FormRuleKey = string;

export type FormRule<V extends FormValues<V>> = (
  values: V
) => { isValid: true } | { isValid: false; message?: string };

export type FormRules<V extends FormValues<V>, K extends FormRuleKey> = ShallowPartial<
  Record<K, FormRule<V>>
>;

export type FormErrors<K extends FormRuleKey> = ShallowPartial<Record<K, string>>;

export type UseFormOptions<V extends FormValues<V>, K extends FormRuleKey> = {
  defaultValues: V;
  rules?: K extends never ? never : FormRules<V, K>;
};

export type UseFormReturn<V extends FormValues<V>, K extends FormRuleKey> = {
  values: V;
  errors: FormErrors<K>;
  flags: { isValid: boolean; isDirty: boolean };
  setValues: (valuesOrCallback: ShallowPartial<V> | ((prevValues: V) => ShallowPartial<V>)) => void;
  setErrors: (
    errorsOrCallback: FormErrors<K> | ((prevErrors: FormErrors<K>) => FormErrors<K>)
  ) => void;
  reset: () => void;
  commit: () => void;
};

export type FormProviderProps<V extends FormValues<V>, K extends FormRuleKey> = {
  form: UseFormReturn<V, K>;
  children: ReactNode;
};
