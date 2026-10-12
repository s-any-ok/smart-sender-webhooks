import { httpClient } from 'src/shared/api';

import type { User } from '../model/types';

export const userApi = {
  getMe: (signal?: AbortSignal) => httpClient.get<User>('/v1/me', signal ? { signal } : {}),
};
