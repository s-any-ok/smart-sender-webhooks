import { useMutation, useQueryClient } from '@tanstack/react-query';

import { sessionApi } from 'src/entities/session';

import { clearLocalSession } from '../lib/clearLocalSession';

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sessionApi.revoke,
    onSettled: () => clearLocalSession(queryClient, 'logout'),
  });
}
