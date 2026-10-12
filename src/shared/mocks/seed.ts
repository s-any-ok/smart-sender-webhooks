import type { MockWebhook } from './types';

const SEED: ReadonlyArray<[name: string, path: string]> = [
  ['Order created', 'orders/created'],
  ['Order paid', 'orders/paid'],
  ['Order cancelled', 'orders/cancelled'],
  ['Order refunded', 'orders/refunded'],
  ['Subscriber added', 'subscribers/added'],
  ['Subscriber unsubscribed', 'subscribers/unsubscribed'],
  ['Subscriber tag changed', 'subscribers/tags'],
  ['Payment succeeded', 'payments/succeeded'],
  ['Payment failed', 'payments/failed'],
  ['Invoice issued', 'invoices/issued'],
  ['Invoice overdue', 'invoices/overdue'],
  ['Chat started', 'chats/started'],
  ['Chat closed', 'chats/closed'],
  ['Operator assigned', 'chats/operator'],
  ['Message delivered', 'messages/delivered'],
  ['Message read', 'messages/read'],
  ['Message failed', 'messages/failed'],
  ['Campaign launched', 'campaigns/launched'],
  ['Campaign finished', 'campaigns/finished'],
  ['Funnel step reached', 'funnels/step'],
  ['Lead qualified', 'crm/lead-qualified'],
  ['Deal won', 'crm/deal-won'],
  ['Deal lost', 'crm/deal-lost'],
  ['Form submitted', 'forms/submitted'],
  ['Bot error', 'bots/error'],
  ['Daily report', 'reports/daily'],
  ['Weekly report', 'reports/weekly'],
  ['Inventory low stock', 'inventory/low-stock'],
];

const BASE_DATE = Date.UTC(2026, 0, 5, 9, 0, 0);
const DAY_MS = 86_400_000;

export const createSeedWebhooks = (): MockWebhook[] =>
  SEED.map(([name, path], index) => ({
    id: index + 1,
    name,
    url: `https://hooks.example.com/${path}`,
    active: index % 4 !== 3,
    created_at: new Date(BASE_DATE + index * DAY_MS).toISOString(),
  }));
