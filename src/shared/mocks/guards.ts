import { MOCK_USER } from './config';
import { mockDb } from './db';
import { tokenMismatch, unauthenticated } from './responses';

export const checkCsrf = (request: Request) =>
  request.headers.get('X-CSRF-TOKEN') === mockDb.state.csrfToken ? null : tokenMismatch();

export const checkSession = () => {
  const { session } = mockDb.state;
  return session && session.expiresAt > Date.now() && session.userId === MOCK_USER.id
    ? null
    : unauthenticated();
};

export const readJson = async (request: Request): Promise<Record<string, unknown>> => {
  const body: unknown = await request.json().catch(() => null);
  return typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {};
};

export const asString = (value: unknown): string => (typeof value === 'string' ? value : '');
