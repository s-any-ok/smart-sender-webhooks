import { delay, http, HttpResponse } from 'msw';

import { randomHex } from 'src/shared/lib';

import { FINGERPRINT_PATTERN, MOCK_API, MOCK_USER, SESSION_TTL_MS } from '../config';
import { mockDb } from '../db';
import { asString, checkCsrf, readJson } from '../guards';
import { badRequest, validationError } from '../responses';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const authHandlers = [
  http.post(`${MOCK_API}/auth/login`, async ({ request }) => {
    await delay();
    const csrfError = checkCsrf(request);
    if (csrfError) return csrfError;

    if (!request.headers.get('X-Captcha-Token')) {
      return badRequest('Captcha token is required.');
    }

    const body = await readJson(request);
    const email = asString(body.email).trim();
    const password = asString(body.password);
    const fingerprint = asString(body.fingerprint);

    const errors: Record<string, string[]> = {};
    if (!email) errors.email = ['The email field is required.'];
    else if (!EMAIL_PATTERN.test(email))
      errors.email = ['The email must be a valid email address.'];
    if (!password) errors.password = ['The password field is required.'];
    if (!FINGERPRINT_PATTERN.test(fingerprint))
      errors.fingerprint = ['The fingerprint is invalid.'];
    if (Object.keys(errors).length > 0) return validationError(errors);

    if (email.toLowerCase() !== MOCK_USER.email) {
      return validationError({ email: ['These credentials do not match our records.'] });
    }
    if (password !== MOCK_USER.password) {
      return validationError({ password: ['The provided password is incorrect.'] });
    }

    const deviceSessionToken = randomHex(32);
    mockDb.state.deviceSessions.set(deviceSessionToken, { userId: MOCK_USER.id, fingerprint });
    return HttpResponse.json({ device_session_token: deviceSessionToken });
  }),

  http.post(`${MOCK_API}/auth/token/issue`, async ({ request }) => {
    await delay();
    const csrfError = checkCsrf(request);
    if (csrfError) return csrfError;

    const body = await readJson(request);
    const token = asString(body.device_session_token);
    const fingerprint = asString(body.fingerprint);
    const deviceSession = mockDb.state.deviceSessions.get(token);

    if (!deviceSession || deviceSession.fingerprint !== fingerprint) {
      return validationError({ device_session_token: ['The device session token is invalid.'] });
    }

    mockDb.state.deviceSessions.delete(token);
    mockDb.state.session = {
      userId: deviceSession.userId,
      fingerprint,
      expiresAt: Date.now() + SESSION_TTL_MS,
    };
    return new HttpResponse(null, { status: 200 });
  }),

  http.post(`${MOCK_API}/auth/token/rotate`, async ({ request }) => {
    await delay();
    const csrfError = checkCsrf(request);
    if (csrfError) return csrfError;

    const { fingerprint } = await readJson(request);
    const { session } = mockDb.state;
    if (!session || session.fingerprint !== fingerprint) {
      return badRequest('Session cannot be rotated.');
    }

    session.expiresAt = Date.now() + SESSION_TTL_MS;
    return new HttpResponse(null, { status: 200 });
  }),

  http.post(`${MOCK_API}/auth/token/revoke`, async ({ request }) => {
    await delay();
    const csrfError = checkCsrf(request);
    if (csrfError) return csrfError;

    mockDb.state.session = null;
    return new HttpResponse(null, { status: 204 });
  }),
];
