import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';

import { parsePositiveInt } from 'src/shared/lib';

const PARAM = { PAGE: 'page', SEARCH: 'search' } as const;

export function useWebhookListParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parsePositiveInt(searchParams.get(PARAM.PAGE), 1);
  const search = (searchParams.get(PARAM.SEARCH) ?? '').trim();

  const setPage = useCallback(
    (next: number) =>
      setSearchParams((current) => {
        const params = new URLSearchParams(current);
        if (next > 1) params.set(PARAM.PAGE, String(next));
        else params.delete(PARAM.PAGE);
        return params;
      }),
    [setSearchParams],
  );

  const setSearch = useCallback(
    (next: string) =>
      setSearchParams((current) => {
        const params = new URLSearchParams(current);
        const value = next.trim();
        if (value) params.set(PARAM.SEARCH, value);
        else params.delete(PARAM.SEARCH);
        params.delete(PARAM.PAGE);
        return params;
      }),
    [setSearchParams],
  );

  return useMemo(() => ({ page, search, setPage, setSearch }), [page, search, setPage, setSearch]);
}
