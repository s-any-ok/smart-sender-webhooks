export const ROUTES = {
  LOGIN: '/login',
  WEBHOOKS: '/webhooks',
  webhookEdit: (id: number | string) => `/webhooks/${id}`,
} as const;

export const ROUTE_PATTERNS = {
  WEBHOOK_EDIT: '/webhooks/:id',
} as const;
