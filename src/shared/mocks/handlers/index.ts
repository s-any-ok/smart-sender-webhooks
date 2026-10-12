import { authHandlers } from './auth';
import { csrfHandlers } from './csrf';
import { userHandlers } from './user';
import { webhookHandlers } from './webhooks';

export const handlers = [...csrfHandlers, ...authHandlers, ...userHandlers, ...webhookHandlers];
