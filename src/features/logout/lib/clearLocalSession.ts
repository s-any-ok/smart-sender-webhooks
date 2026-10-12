import type { QueryClient } from '@tanstack/react-query';

import { useSessionStore, type SessionEndReason } from 'src/entities/session';

export function clearLocalSession(queryClient: QueryClient, reason: SessionEndReason): void {
  useSessionStore.getState().endSession(reason);
  queryClient.clear();
}
