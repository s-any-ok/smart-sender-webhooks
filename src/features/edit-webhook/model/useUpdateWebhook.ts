import { useMutation, useQueryClient } from '@tanstack/react-query';

import { webhookApi, webhookQueries, type UpdateWebhookPayload } from 'src/entities/webhook';

export function useUpdateWebhook(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateWebhookPayload) => webhookApi.update(id, payload),
    onSuccess: async (updated) => {
      queryClient.setQueryData(webhookQueries.detail(id).queryKey, updated);
      await queryClient.invalidateQueries({ queryKey: webhookQueries.lists() });
    },
  });
}
