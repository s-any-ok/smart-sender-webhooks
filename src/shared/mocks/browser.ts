import { setupWorker } from 'msw/browser';

import { mockDb } from './db';
import { handlers } from './handlers';

export async function startMockWorker(): Promise<void> {
  await setupWorker(...handlers).start({ onUnhandledRequest: 'bypass', quiet: true });

  if (import.meta.env.DEV) {
    Object.assign(window, { __mock: mockDb });
  }
}
