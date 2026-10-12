import type { Webhook } from 'src/entities/webhook';
import { Alert, Button, TextField } from 'src/shared/ui';

import { useEditWebhookForm } from '../model/useEditWebhookForm';
import styles from './EditWebhookForm.module.css';

interface EditWebhookFormProps {
  webhook: Webhook;
  onSaved: (updated: Webhook) => void;
  onCancel: () => void;
}

export const EditWebhookForm = ({ webhook, onSaved, onCancel }: EditWebhookFormProps) => {
  const { form, onSubmit } = useEditWebhookForm(webhook, onSaved);
  const {
    register,
    formState: { errors, isSubmitting, isDirty },
  } = form;

  return (
    <form
      className={styles.form}
      onSubmit={onSubmit}
      noValidate
    >
      {errors.root?.server && <Alert>{errors.root.server.message}</Alert>}
      <TextField
        label="Назва"
        autoComplete="off"
        error={errors.name?.message}
        {...register('name', {
          validate: (value) => value.trim().length > 0 || 'Вкажіть назву',
        })}
      />
      <TextField
        label="URL"
        inputMode="url"
        autoComplete="off"
        spellCheck={false}
        placeholder="https://example.com/webhook"
        error={errors.url?.message}
        {...register('url', {
          validate: (value) => value.trim().length > 0 || 'Вкажіть URL',
        })}
      />
      <div className={styles.actions}>
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Скасувати
        </Button>
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={!isDirty}
        >
          Зберегти
        </Button>
      </div>
    </form>
  );
};
