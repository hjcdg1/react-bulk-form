# react-bulk-form

A simple React library for managing form-related states in bulk.

## Mental Model

It manages form field values and errors(i.e., validation results based on statically declared rules, for colocation) in bulk, and tracks form-level or field-level status.

How to implement the UX of forms based on these states is not a concern of this package, and therefore it minimizes secondary interfaces.

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
 * Define the type of the form values, which should be object type.
 * Each property should not be `undefined`.
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
type PostFormRuleKey = 'titleMinLengthCheck' | 'titleMaxLengthCheck' | 'contentMinLengthCheck';
```

#### useForm

```ts
import { useForm } from 'react-bulk-form';

const {
  /**
   * The values of the form.
   * The type of this object is the `PostFormValues` type.
   *
   * Example: `{ title: 'current title', content: 'current content' }`
   */
  values,

  /**
   * The errors of the form.
   * The type of each property name is `string` type, for considering the errors set by `setErrors`,
   * but it supports auto-completion for properties corresponding to the `PostFormRuleKey` type.
   *
   * Example: `{ titleMinLengthCheck: true }`
   */
  errors,

  /**
   * The fields whose values differ from their default values.
   * The type of each property name is the `keyof PostFormValues` type.
   *
   * Example: `{ title: true }`
   */
  dirtyFields,

  /**
   * The fields whose values have been changed. (Regardless of matching their default value.)
   * The type of each property name is the `keyof PostFormValues` type.
   *
   * Example: `{ title: true }`
   */
  touchedFields,

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
     * Whether the values of the form are different from the default values.
     * It equals to `Object.keys(dirtyFields).length > 0`.
     */
    isDirty,
  },

  /**
   * Set the values of the form. (It supports partial updates.)
   *
   * Example: `setValues({ title: 'new title' })`
   */
  setValues,

  /**
   * Set the errors of the form manually. (It supports partial updates.)
   * Those errors will be cleared when the values or the validation rules of the form are changed.
   * It is recommended to use this only when you need to perform heavy validation(e.g., async API calls)
   * for one-time validation(e.g., in submit handler). For other cases, don't use this.
   *
   * Example: `setErrors({ titleDuplicationCheck: true })`
   */
  setErrors,

  /**
   * Reset the values and the validation rules of the form to the default values, and clear the errors.
   */
  reset,

  /**
   * Commit the values of the form to the default values. (`flags.isDirty` will be set to `false`.)
   * In general, it is used right after submitting the form, for refreshing the default values.
   */
  commit,
} = useForm<PostFormValues, PostFormRuleKey>({
  /**
   * Set default values of the form.
   * The type of this object should be the `PostFormValues` type.
   */
  defaultValues: {
    title: '',
    content: '',
  },

  /**
   * Set validation rules for the form.
   * The type of each property name should be the `PostFormRuleKey` type.
   */
  rules: {
    titleMinLengthCheck: (values) => values.title.length >= 4,
    titleMaxLengthCheck: (values) => values.title.length <= 128,
    contentMinLengthCheck: (values) => values.content.length >= 16,
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
