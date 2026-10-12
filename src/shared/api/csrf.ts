import { HEADER } from 'src/shared/config';

import { ApiError } from './ApiError';
import { createSingleFlight } from './createSingleFlight';

type SendRaw = (path: string) => Promise<Response>;

export function createCsrfStore(sendRaw: SendRaw) {
  let token: string | null = null;

  const fetchToken = createSingleFlight(async () => {
    const response = await sendRaw('/csrf');
    const received = response.headers.get(HEADER.CSRF_TOKEN);
    if (!response.ok || !received) {
      throw response.ok
        ? new ApiError(response.status, 'UnknownError', 'CSRF token is missing in response')
        : await ApiError.fromResponse(response);
    }
    token = received;
    return received;
  });

  return {
    async get(): Promise<string> {
      return token ?? fetchToken.run();
    },
    invalidate(stale: string): void {
      if (token === stale) token = null;
    },
    reset(): void {
      token = null;
    },
  };
}
