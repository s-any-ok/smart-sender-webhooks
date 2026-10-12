import { useQuery } from '@tanstack/react-query';

import { userQueries } from '../api/userQueries';

export const useCurrentUser = () => useQuery(userQueries.me());
