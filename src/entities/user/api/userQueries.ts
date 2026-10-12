import { queryOptions } from '@tanstack/react-query';

import { userApi } from './userApi';

export const userQueries = {
  all: () => ['user'] as const,
  me: () =>
    queryOptions({
      queryKey: [...userQueries.all(), 'me'] as const,
      queryFn: ({ signal }) => userApi.getMe(signal),
      staleTime: Infinity,
    }),
};
