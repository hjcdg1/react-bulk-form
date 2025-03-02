# react-bulk-form

A simple React library for managing form-related states in bulk.

## Install

```bash
$ npm install react-bulk-form

// or
$ yarn add react-bulk-form
```

## Usage

#### useForm

```tsx
import { useForm } from 'react-bulk-form';

// Define the type of the form values, where each property should not be undefined.
type PostFormValues = {
  title: string;
  content: string;
}

const {
  // The values of the form.
  values,

  // The errors of the form.
  errors,

  // Whether the form is valid. (Whether the values of the form are valid, based on the validation rules.)
  isValid,

  // Whether the form is dirty. (Whether the values of the form have been changed from the default values.)
  isDirty,

  // Set the values of the form. (It supports partial updates.)
  setValues,

  // Reset the values of the form to the default values, and clear the errors.
  reset,
} = useForm<PostFormValues>({
  // Set default values of the form.
  defaultValues: {
    title: '',
    content: '',
  },

  // Set validation rules for the form.
  validateBy: {
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
import { FormProvider, useFormContext } from 'react-bulk-form';

// The parent component provides the form to the children.
function Parent() {
  const form = useForm<PostFormValues>({ ... });
  ...

  return (
    <FormProvider form={form}>
      <Child />
    </FormProvider>
  );
}

// The child component can use the form context.
function Child() {
  const {
    values,
    errors,
    ...
  } = useFormContext<PostFormValues>();
  ...
}
```

## Types

```ts
type FormValues = Record<string, NonNullable<unknown> | null>;

type FormErrors = Record<string, string>;

type UseFormOptions<T extends FormValues> = {
  defaultValues: T;
  validateBy?: Record<
    string,
    (values: T) => { isValid: true } | { isValid: false; message?: string }
  >;
};

type UseFormReturn<T extends FormValues> = {
  values: T;
  errors: FormErrors;
  isValid: boolean;
  isDirty: boolean;
  setValues: (valuesOrCallback: ShallowPartial<T> | ((prevValues: T) => ShallowPartial<T>)) => void;
  reset: () => void;
};

type FormProviderProps<T extends FormValues> = {
  form: UseFormReturn<T>;
  children: ReactNode;
};

declare function useForm<T extends FormValues>(
  options: UseFormOptions<T>
): UseFormReturn<T>

declare function FormProvider<T extends FormValues>(
	props: FormProviderProps<T>
): React.Provider<T>

declare function useFormContext<T extends FormValues>(): UseFormReturn<T>
```
