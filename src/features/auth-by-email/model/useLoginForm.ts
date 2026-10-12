import { useForm } from 'react-hook-form';

import { applyServerErrors } from 'src/shared/lib';

import type { LoginFormValues } from './types';
import { useLogin } from './useLogin';

const FIELDS = ['email', 'password'] as const;

export function useLoginForm() {
  const form = useForm<LoginFormValues>({ defaultValues: { email: '', password: '' } });
  const { mutateAsync: login } = useLogin();

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await login({ email: values.email.trim(), password: values.password });
    } catch (error) {
      applyServerErrors(error, FIELDS, form.setError);
    }
  });

  return { form, onSubmit };
}
