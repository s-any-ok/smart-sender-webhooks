import { useForm } from 'react-hook-form';

import type { Webhook } from 'src/entities/webhook';
import { applyServerErrors } from 'src/shared/lib';

import type { EditWebhookFormValues } from './types';
import { useUpdateWebhook } from './useUpdateWebhook';

const FIELDS = ['name', 'url'] as const;

export function useEditWebhookForm(webhook: Webhook, onSaved: (updated: Webhook) => void) {
  const form = useForm<EditWebhookFormValues>({
    defaultValues: { name: webhook.name, url: webhook.url },
  });
  const { mutateAsync: update } = useUpdateWebhook(webhook.id);

  const onSubmit = form.handleSubmit(async ({ name, url }) => {
    try {
      const updated = await update({ name: name.trim(), url: url.trim() });
      onSaved(updated);
    } catch (error) {
      applyServerErrors(error, FIELDS, form.setError);
    }
  });

  return { form, onSubmit };
}
