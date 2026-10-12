import { API_BASE_URL, HEADER } from 'src/shared/config';

import { ApiError } from './ApiError';
import { createCsrfStore } from './csrf';
import { createSessionRefresher } from './sessionRefresher';
import type { HttpClientConfig, HttpMethod, QueryParams, RequestOptions } from './types';

const CSRF_PROTECTED_METHODS: ReadonlySet<HttpMethod> = new Set(['POST', 'PUT', 'DELETE']);

const notConfigured = () => {
  throw new Error('httpClient.configure() must be called before protected requests');
};

export function createHttpClient(initial: Partial<HttpClientConfig> = {}) {
  let config: HttpClientConfig = {
    baseUrl: API_BASE_URL,
    refreshSession: notConfigured,
    onSessionExpired: notConfigured,
    ...initial,
  };

  const buildUrl = (path: string, query?: QueryParams): string => {
    const url = new URL(`${config.baseUrl}${path}`, globalThis.location?.href);
    Object.entries(query ?? {}).forEach(([key, value]) => {
      if (value !== undefined && value !== '') url.searchParams.set(key, String(value));
    });
    return url.toString();
  };

  const send = async (
    { method, path, query, body, headers, signal }: RequestOptions,
    csrfToken: string | null,
  ): Promise<Response> => {
    const finalHeaders = new Headers({
      Accept: 'application/json',
      [HEADER.REQUESTED_WITH]: 'XMLHttpRequest',
      ...headers,
    });
    if (body !== undefined) finalHeaders.set('Content-Type', 'application/json');
    if (csrfToken && CSRF_PROTECTED_METHODS.has(method)) {
      finalHeaders.set(HEADER.CSRF_TOKEN, csrfToken);
    }

    try {
      return await fetch(buildUrl(path, query), {
        method,
        headers: finalHeaders,
        credentials: 'include',
        ...(body !== undefined && { body: JSON.stringify(body) }),
        ...(signal && { signal }),
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') throw error;
      throw new ApiError(0, 'NetworkError', 'Network error, check your connection');
    }
  };

  const csrf = createCsrfStore((path) => send({ method: 'GET', path, auth: false }, null));
  const refresher = createSessionRefresher(
    () => config.refreshSession(),
    () => config.onSessionExpired(),
  );

  const parseBody = async <T>(response: Response): Promise<T> => {
    const text = await response.text();
    return (text ? JSON.parse(text) : undefined) as T;
  };

  async function request<T>(options: RequestOptions): Promise<T> {
    const isProtected = options.auth ?? true;
    let csrfRetried = false;
    let sessionRetried = false;

    for (;;) {
      if (isProtected) await refresher.idle();
      const generation = refresher.generation;
      const csrfToken = await csrf.get();

      const response = await send(options, csrfToken);
      if (response.ok) return parseBody<T>(response);

      const error = await ApiError.fromResponse(response);

      if (error.status === 419 && !csrfRetried) {
        csrfRetried = true;
        csrf.invalidate(csrfToken);
        continue;
      }

      if (error.status === 401 && isProtected) {
        if (sessionRetried) {
          config.onSessionExpired();
          throw error;
        }
        sessionRetried = true;
        await refresher.refresh(generation).catch(() => {
          throw error;
        });
        continue;
      }

      throw error;
    }
  }

  return {
    request,
    get: <T>(path: string, options: Omit<RequestOptions, 'method' | 'path' | 'body'> = {}) =>
      request<T>({ ...options, method: 'GET', path }),
    post: <T>(
      path: string,
      body?: unknown,
      options: Omit<RequestOptions, 'method' | 'path'> = {},
    ) => request<T>({ ...options, method: 'POST', path, body }),
    put: <T>(path: string, body?: unknown, options: Omit<RequestOptions, 'method' | 'path'> = {}) =>
      request<T>({ ...options, method: 'PUT', path, body }),
    configure(next: Partial<HttpClientConfig>): void {
      config = { ...config, ...next };
    },
    resetCsrf(): void {
      csrf.reset();
    },
  };
}

export type HttpClient = ReturnType<typeof createHttpClient>;

export const httpClient = createHttpClient();
