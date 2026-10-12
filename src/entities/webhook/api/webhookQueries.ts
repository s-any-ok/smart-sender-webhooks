import { keepPreviousData, queryOptions } from '@tanstack/react-query';

import type { WebhookListParams } from '../model/types';
import { webhookApi } from './webhookApi';

export const webhookQueries = {
  all: () => ['webhooks'] as const,
  lists: () => [...webhookQueries.all(), 'list'] as const,
  list: (params: WebhookListParams) =>
    queryOptions({
      queryKey: [...webhookQueries.lists(), params] as const,
      queryFn: ({ signal }) => webhookApi.list(params, signal),
      placeholderData: keepPreviousData,
    }),
  details: () => [...webhookQueries.all(), 'detail'] as const,
  detail: (id: number) =>
    queryOptions({
      queryKey: [...webhookQueries.details(), id] as const,
      queryFn: ({ signal }) => webhookApi.get(id, signal),
    }),
};
