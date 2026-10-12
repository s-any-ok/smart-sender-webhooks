export interface FromState {
  from: string;
}

export const createFromState = ({
  pathname,
  search,
}: {
  pathname: string;
  search: string;
}): FromState => ({ from: `${pathname}${search}` });

export const readFromState = (state: unknown, fallback: string): string => {
  if (typeof state !== 'object' || state === null || !('from' in state)) return fallback;
  const { from } = state;
  return typeof from === 'string' && from.startsWith('/') && !from.startsWith('//')
    ? from
    : fallback;
};
