import { useCallback, useEffect, useRef, useState } from 'react';

const DEFAULT_DELAY_MS = 350;

export function useSearchDraft(
  value: string,
  onCommit: (next: string) => void,
  delayMs = DEFAULT_DELAY_MS,
) {
  const [draft, setDraft] = useState(value);
  const [syncedValue, setSyncedValue] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  if (value !== syncedValue) {
    setSyncedValue(value);
    if (draft.trim() !== value) setDraft(value);
  }

  useEffect(() => () => clearTimeout(timerRef.current), [value]);

  const commit = useCallback(
    (next: string) => {
      clearTimeout(timerRef.current);
      if (next.trim() !== value) onCommit(next);
    },
    [value, onCommit],
  );

  const onChange = useCallback(
    (next: string) => {
      setDraft(next);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => commit(next), delayMs);
    },
    [commit, delayMs],
  );

  const flush = useCallback(() => commit(draft), [commit, draft]);

  return { draft, onChange, flush };
}
