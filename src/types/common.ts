import type { ReactNode } from 'react';

export type FormValues<V> = { [P in keyof V]: undefined extends V[P] ? never : V[P] };

export type FormRuleKey = string;

export type FormRule<V extends FormValues<V>> = (values: V) => boolean;

export type FormRules<V extends FormValues<V>, R extends FormRuleKey> = Record<R, FormRule<V>>;

export type FormErrors<R extends FormRuleKey> = { [P in R]?: true } & {
  [key: string]: true | undefined;
};

export type UseFormOptions<V extends FormValues<V>, R extends FormRuleKey> = {
  defaultValues: V;
} & ([R] extends [never] ? {} : { rules: FormRules<V, R> });

export type UseFormReturn<V extends FormValues<V>, R extends FormRuleKey> = {
  values: V;
  errors: FormErrors<R>;
  flags: {
    isValid: boolean;
    isDirty: boolean;
  };
  setValues: (valuesOrCallback: Partial<V> | ((prevValues: V) => Partial<V>)) => void;
  setErrors: (
    errorsOrCallback:
      | Record<string, boolean>
      | ((prevErrors: FormErrors<R>) => Record<string, boolean>)
  ) => void;
  reset: () => void;
  commit: () => void;
};

export type FormProviderProps<V extends FormValues<V>, R extends FormRuleKey> = {
  form: UseFormReturn<V, R>;
  children: ReactNode;
};
