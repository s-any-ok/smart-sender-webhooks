import type { QueryClient } from '@tanstack/react-query';

import { sessionApi } from 'src/entities/session';
import { clearLocalSession } from 'src/features/logout';
import { httpClient } from 'src/shared/api';

export function setupHttpClient(queryClient: QueryClient): void {
  httpClient.configure({
    refreshSession: sessionApi.rotate,
    onSessionExpired: () => clearLocalSession(queryClient, 'expired'),
  });
}
