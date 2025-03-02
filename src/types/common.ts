import type { ReactNode } from 'react';
import type { ShallowPartial } from './utils';

export type FormValues = Record<string, NonNullable<unknown> | null>;

export type FormRuleKey = string;

export type FormRule<V extends FormValues> = (
  values: V
) => { isValid: true } | { isValid: false; message?: string };

export type FormRules<V extends FormValues, K extends FormRuleKey> = ShallowPartial<
  Record<K, FormRule<V>>
>;

export type FormErrors<K extends FormRuleKey> = ShallowPartial<Record<K, string>>;

export type UseFormOptions<V extends FormValues, K extends FormRuleKey> = {
  defaultValues: V;
  rules?: K extends never ? never : FormRules<V, K>;
};

export type UseFormReturn<V extends FormValues, K extends FormRuleKey> = {
  values: V;
  errors: FormErrors<K>;
  isValid: boolean;
  isDirty: boolean;
  setValues: (valuesOrCallback: ShallowPartial<V> | ((prevValues: V) => ShallowPartial<V>)) => void;
  addRule: (ruleKey: K, rule: FormRule<V>) => void;
  triggerRule: (ruleKey: K, rule: FormRule<V>) => void;
  reset: () => void;
};

export type FormProviderProps<V extends FormValues, K extends FormRuleKey> = {
  form: UseFormReturn<V, K>;
  children: ReactNode;
};
