import { useQuery } from '@tanstack/react-query';

import { webhookQueries } from '../api/webhookQueries';
import type { WebhookListParams } from './types';

export const useWebhooks = (params: WebhookListParams) => useQuery(webhookQueries.list(params));
