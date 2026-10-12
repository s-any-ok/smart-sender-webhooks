import type { ApiErrorType, ErrorResponseBody, ValidationErrors } from './types';

export class ApiError extends Error {
  readonly status: number;
  readonly type: ApiErrorType;
  readonly payload: ValidationErrors | undefined;

  constructor(status: number, type: ApiErrorType, message: string, payload?: ValidationErrors) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.type = type;
    this.payload = payload;
  }

  static async fromResponse(response: Response): Promise<ApiError> {
    const body = await response.json().catch(() => null);
    if (isErrorResponseBody(body)) {
      const { type, message, payload } = body.error;
      return new ApiError(response.status, type, message, payload);
    }
    return new ApiError(response.status, 'UnknownError', response.statusText || 'Request failed');
  }
}

function isErrorResponseBody(value: unknown): value is ErrorResponseBody {
  if (typeof value !== 'object' || value === null || !('error' in value)) return false;
  const { error } = value;
  return typeof error === 'object' && error !== null && 'type' in error && 'message' in error;
}

export const isApiError = (error: unknown): error is ApiError => error instanceof ApiError;

export const isValidationError = (
  error: unknown,
): error is ApiError & { payload: ValidationErrors } =>
  isApiError(error) && error.status === 422 && error.payload !== undefined;
