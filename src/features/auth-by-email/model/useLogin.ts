import { useMutation, useQueryClient } from '@tanstack/react-query';

import { sessionApi, useSessionStore, type LoginCredentials } from 'src/entities/session';
import { userQueries } from 'src/entities/user';

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { setDeviceSessionToken, markAuthenticated } = useSessionStore.getState();

      const { device_session_token } = await sessionApi.login(credentials);
      setDeviceSessionToken(device_session_token);

      await sessionApi.issue(device_session_token);
      await queryClient.fetchQuery(userQueries.me());

      markAuthenticated();
    },
    onError: () => useSessionStore.getState().setDeviceSessionToken(null),
  });
}
