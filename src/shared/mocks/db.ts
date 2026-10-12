import { MOCK_CSRF_TOKEN } from './config';
import { createSeedWebhooks } from './seed';
import type { MockDeviceSession, MockSession, MockWebhook } from './types';

interface MockState {
  csrfToken: string;
  deviceSessions: Map<string, MockDeviceSession>;
  session: MockSession | null;
  webhooks: MockWebhook[];
}

const createState = (): MockState => ({
  csrfToken: MOCK_CSRF_TOKEN,
  deviceSessions: new Map(),
  session: null,
  webhooks: createSeedWebhooks(),
});

let state = createState();

export const mockDb = {
  get state(): MockState {
    return state;
  },
  reset(): void {
    state = createState();
  },
  expireSession(): void {
    if (state.session) state.session.expiresAt = 0;
  },
  changeCsrfToken(token = `mock-csrf-${Math.random().toString(16).slice(2, 18)}`): void {
    state.csrfToken = token;
  },
};
