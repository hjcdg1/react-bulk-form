# react-bulk-form

A simple React library for managing form-related states in bulk.

## Install

```bash
$ npm install react-bulk-form

// or
$ yarn add react-bulk-form
```

## Usage

#### Define Types

You should define the following two types to use this package.

```ts
/**
 * Define the type of the form values.
 * Each property should not be undefined.
 */
type PostFormValues = {
  title: string;
  content: string;
}

/**
 * Define the type representing the keys of the form validation rules to use.
 * If you don't use the validation rules, you don't need to define this type.
 * These keys don't need to match the field names, for better flexibility.
 */
type PostFormRuleKey = 'title' | 'content';
```

#### useForm

```ts
import { useForm } from 'react-bulk-form';

const {
  /**
   * The values of the form.
   * The type of this object is the `PostFormValues` type.
   */
  values,

  /**
   * The errors of the form.
   * Each property name matches the `PostFormRuleKey` type, and its value is the error message.
   */
  errors,

  /**
   * The flags representing the status of the form.
   */
  flags: {
    /**
     * Whether the values of the form are valid, based on the validation rules.
     * It equals to `Object.keys(errors).length === 0`.
     */
    isValid,

    /**
     * Whether the values of the form have been changed from the default values.
     * It is based on deep comparison between the two objects.
     */
    isDirty,
  },

  /**
   * Set the values of the form. (It supports partial updates.)
   */
  setValues,

  /**
   * Set the errors of the form manually. (It supports partial updates.)
   * Those temporary errors will be cleared when the values or the validation rules of the form are changed.
   * It is recommended to use this only when you need to perform heavy validation(e.g., async API calls)
   * for one-time validation(e.g., in submit handler). For other cases, don't use this.
   */
  setErrors,

  /**
   * Reset the values and the validation rules of the form to the default values, and clear the errors.
   */
  reset,

  /**
   * Commit the values of the form to the default values. (`flags.isDirty` will be set to `false`.)
   * It is recommended to commit the valid values, otherwise `flags.isValid` will be set to `false`.
   * In general, it is used after submitting the form, for refreshing the default values.
   */
  commit,
} = useForm<PostFormValues, PostFormRuleKey>({
  /**
   * Set default values of the form.
   * The type of this object should follow the `PostFormValues` type.
   */
  defaultValues: {
    title: '',
    content: '',
  },

  /**
   * Set validation rules for the form.
   * The type of each property in this object should follow the `PostFormRuleKey` type.
   */
  rules: {
    title: (values) => {
      if (values.title.length < 5) {
        return { isValid: false, message: 'Title must be at least 5 characters long.' };
      }
      return { isValid: true };
    },
    content: (values) => {
      if (values.content.length < 10) {
        return { isValid: false, message: 'Content must be at least 10 characters long.' };
      }
      return { isValid: true };
    },
  },
});
```

#### FormProvider, useFormContext

```tsx
import { useForm, FormProvider, useFormContext } from 'react-bulk-form';

// The parent component provides the form to the children.
function Parent() {
  const form = useForm<PostFormValues, PostFormRuleKey>({ ... });
  ...

  return (
    <FormProvider form={form}>
      <Child />
    </FormProvider>
  );
}

// The child component can use the form provided from `<FormProvider>`.
function Child() {
  const {
    values,
    errors,
    ...
  } = useFormContext<PostFormValues, PostFormRuleKey>();
  ...
}
```

## Types

```ts
type FormValues<V> = { [K in keyof V]: undefined extends V[K] ? never : V[K] };

type FormRuleKey = string;

type FormRule<V extends FormValues<V>> = (
  values: V
) => { isValid: true } | { isValid: false; message?: string };

type FormRules<V extends FormValues<V>, K extends FormRuleKey> = ShallowPartial<
  Record<K, FormRule<V>>
>;

type FormErrors<K extends FormRuleKey> = ShallowPartial<Record<K, string>>;

type UseFormOptions<V extends FormValues<V>, K extends FormRuleKey> = {
  defaultValues: V;
  rules?: K extends never ? never : FormRules<V, K>;
};

type UseFormReturn<V extends FormValues<V>, K extends FormRuleKey> = {
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

type FormProviderProps<V extends FormValues<V>, K extends FormRuleKey> = {
  form: UseFormReturn<V, K>;
  children: ReactNode;
};

declare function useForm<V extends FormValues<V>, K extends FormRuleKey = never>(
  options: UseFormOptions<V, K>
): UseFormReturn<V, K>

declare function FormProvider<V extends FormValues<V>, K extends FormRuleKey>(
  props: FormProviderProps<V, K>
): React.JSX.Element

declare function useFormContext<V extends FormValues<V>, K extends FormRuleKey = never>(
): UseFormReturn<V, K>
```
