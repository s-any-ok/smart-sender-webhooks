import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';

import { isValidationError } from 'src/shared/api';

import { getErrorMessage } from './getErrorMessage';

export const SERVER_ERROR_KEY = 'root.server';

export function applyServerErrors<TValues extends FieldValues>(
  error: unknown,
  fields: ReadonlyArray<Path<TValues>>,
  setError: UseFormSetError<TValues>,
): void {
  if (!isValidationError(error)) {
    setError(SERVER_ERROR_KEY, { type: 'server', message: getErrorMessage(error) });
    return;
  }

  const unmatched: string[] = [];
  let shouldFocus = true;
  Object.entries(error.payload).forEach(([field, messages]) => {
    const known = fields.find((name) => name === field);
    if (!known) {
      unmatched.push(...messages);
      return;
    }
    setError(known, { type: 'server', message: messages.join(' ') }, { shouldFocus });
    shouldFocus = false;
  });

  if (unmatched.length > 0) {
    setError(SERVER_ERROR_KEY, { type: 'server', message: unmatched.join(' ') });
  }
}
