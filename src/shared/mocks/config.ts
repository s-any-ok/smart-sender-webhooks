export const MOCK_API = '*/api';

export const MOCK_USER = {
  id: 1,
  email: 'admin@smartsender.dev',
  password: 'password123',
  first_name: 'Olena',
  last_name: 'Kovalenko',
} as const;

export const MOCK_CSRF_TOKEN = 'mock-csrf-3f9a1c7e5b2d4a60';

export const SESSION_TTL_MS = 30_000;

export const FINGERPRINT_PATTERN = /^[0-9a-f]{32}$/;
