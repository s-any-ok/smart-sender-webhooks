import { isApiError } from 'src/shared/api';

const FALLBACK = 'Щось пішло не так. Спробуйте ще раз.';

export const getErrorMessage = (error: unknown): string => {
  if (!isApiError(error)) return FALLBACK;
  if (error.type === 'NetworkError') return 'Немає зʼєднання з сервером.';
  if (error.status >= 500) return 'Сервер тимчасово недоступний.';
  return error.message || FALLBACK;
};
