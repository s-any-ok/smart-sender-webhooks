import { httpClient } from 'src/shared/api';
import { HEADER } from 'src/shared/config';

import { getFingerprint } from '../lib/fingerprint';
import type { LoginCredentials, LoginResponse } from '../model/types';

const CAPTCHA_TOKEN = 'mock-captcha-token';

const AUTH_ENDPOINT = { auth: false } as const;

export const sessionApi = {
  login: ({ email, password }: LoginCredentials) =>
    httpClient.post<LoginResponse>(
      '/auth/login',
      { email, password, fingerprint: getFingerprint() },
      { ...AUTH_ENDPOINT, headers: { [HEADER.CAPTCHA_TOKEN]: CAPTCHA_TOKEN } },
    ),

  issue: (deviceSessionToken: string) =>
    httpClient.post<undefined>(
      '/auth/token/issue',
      { device_session_token: deviceSessionToken, fingerprint: getFingerprint() },
      AUTH_ENDPOINT,
    ),

  rotate: () =>
    httpClient.post<undefined>(
      '/auth/token/rotate',
      { fingerprint: getFingerprint() },
      AUTH_ENDPOINT,
    ),

  revoke: () =>
    httpClient.post<undefined>(
      '/auth/token/revoke',
      { fingerprint: getFingerprint() },
      AUTH_ENDPOINT,
    ),
};
