import { QueryClient } from '@tanstack/react-query';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { sessionApi, useSessionStore } from 'src/entities/session';
import { userApi } from 'src/entities/user';
import { webhookApi } from 'src/entities/webhook';
import { httpClient } from 'src/shared/api';
import { MOCK_USER } from 'src/shared/mocks/config';
import { mockDb } from 'src/shared/mocks/db';
import { mockServer } from 'src/shared/mocks/server';

import { setupHttpClient } from './setupHttpClient';

let responses: string[] = [];

const countResponses = (pattern: string) => responses.filter((line) => line === pattern).length;

const startSession = async () => {
  const { device_session_token } = await sessionApi.login({
    email: MOCK_USER.email,
    password: MOCK_USER.password,
  });
  await sessionApi.issue(device_session_token);
  useSessionStore.getState().markAuthenticated();
};

beforeAll(() => {
  mockServer.listen({ onUnhandledRequest: 'error' });
  mockServer.events.on('response:mocked', ({ request, response }) => {
    responses.push(`${request.method} ${new URL(request.url).pathname} ${response.status}`);
  });
});

afterAll(() => mockServer.close());

beforeEach(() => {
  mockDb.reset();
  httpClient.resetCsrf();
  useSessionStore.getState().endSession('logout');
  setupHttpClient(new QueryClient());
  httpClient.configure({ baseUrl: 'http://localhost/api' });
  responses = [];
});

describe('session rotation', () => {
  it('shares one rotate between two parallel 401s and retries both requests', async () => {
    await startSession();
    mockDb.expireSession();
    responses = [];

    const [me, webhooks] = await Promise.all([
      userApi.getMe(),
      webhookApi.list({ page: 1, limit: 10, search: '' }),
    ]);

    expect(countResponses('GET /api/v1/me 401')).toBe(1);
    expect(countResponses('GET /api/v1/webhooks 401')).toBe(1);
    expect(countResponses('POST /api/auth/token/rotate 200')).toBe(1);
    expect(countResponses('GET /api/v1/me 200')).toBe(1);
    expect(countResponses('GET /api/v1/webhooks 200')).toBe(1);

    expect(me.email).toBe(MOCK_USER.email);
    expect(webhooks.data).toHaveLength(10);
    expect(useSessionStore.getState().status).toBe('authenticated');
  });

  it('ends the local session when rotate fails', async () => {
    await startSession();
    mockDb.state.session = null;
    responses = [];

    const results = await Promise.allSettled([
      userApi.getMe(),
      webhookApi.list({ page: 1, limit: 10, search: '' }),
    ]);

    expect(results.map((result) => result.status)).toEqual(['rejected', 'rejected']);
    expect(countResponses('POST /api/auth/token/rotate 400')).toBe(1);
    expect(useSessionStore.getState()).toMatchObject({ status: 'anonymous', endReason: 'expired' });
  });

  it('refetches the CSRF token on 419 and retries the request once', async () => {
    await startSession();
    mockDb.changeCsrfToken();
    responses = [];

    const updated = await webhookApi.update(1, {
      name: 'Renamed',
      url: 'https://example.com/hook',
    });

    expect(updated.name).toBe('Renamed');
    expect(responses).toEqual([
      'PUT /api/v1/webhooks/1 419',
      'GET /api/csrf 204',
      'PUT /api/v1/webhooks/1 200',
    ]);
  });
});
