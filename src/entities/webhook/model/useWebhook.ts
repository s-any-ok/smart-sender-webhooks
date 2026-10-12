import { useQuery } from '@tanstack/react-query';

import { webhookQueries } from '../api/webhookQueries';

export const useWebhook = (id: number) =>
  useQuery({ ...webhookQueries.detail(id), enabled: Number.isSafeInteger(id) && id > 0 });
