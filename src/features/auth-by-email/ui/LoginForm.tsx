import { Alert, Button, TextField } from 'src/shared/ui';

import { useLoginForm } from '../model/useLoginForm';
import styles from './LoginForm.module.css';

export const LoginForm = () => {
  const { form, onSubmit } = useLoginForm();
  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <form
      className={styles.form}
      onSubmit={onSubmit}
      noValidate
    >
      {errors.root?.server && <Alert>{errors.root.server.message}</Alert>}
      <TextField
        label="Email"
        type="email"
        autoComplete="username"
        autoFocus
        error={errors.email?.message}
        {...register('email', { required: 'Вкажіть email' })}
      />
      <TextField
        label="Пароль"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password', { required: 'Вкажіть пароль' })}
      />
      <Button
        type="submit"
        loading={isSubmitting}
        className={styles.submit}
      >
        Увійти
      </Button>
    </form>
  );
};
