import { httpClient } from 'src/shared/api';

import type { UpdateWebhookPayload, Webhook, WebhookList, WebhookListParams } from '../model/types';

const withSignal = (signal?: AbortSignal) => (signal ? { signal } : {});

export const webhookApi = {
  list: ({ page, limit, search }: WebhookListParams, signal?: AbortSignal) =>
    httpClient.get<WebhookList>('/v1/webhooks', {
      query: { page, limit, search },
      ...withSignal(signal),
    }),

  get: (id: number, signal?: AbortSignal) =>
    httpClient.get<Webhook>(`/v1/webhooks/${id}`, withSignal(signal)),

  update: (id: number, payload: UpdateWebhookPayload) =>
    httpClient.put<Webhook>(`/v1/webhooks/${id}`, payload),
};
