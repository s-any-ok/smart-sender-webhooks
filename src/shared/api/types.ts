export type ServerErrorType =
  | 'BadRequestException'
  | 'AuthenticationException'
  | 'NotFoundException'
  | 'TokenMismatchException'
  | 'ValidationException';

export type ClientErrorType = 'NetworkError' | 'UnknownError';

export type ApiErrorType = ServerErrorType | ClientErrorType;

export type ValidationErrors = Record<string, string[]>;

export interface ErrorResponseBody {
  error: {
    type: ServerErrorType;
    message: string;
    payload?: ValidationErrors;
  };
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type QueryParams = Record<string, string | number | undefined>;

export interface RequestOptions {
  method: HttpMethod;
  path: string;
  query?: QueryParams;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  auth?: boolean;
}

export interface HttpClientConfig {
  baseUrl: string;
  refreshSession: () => Promise<void>;
  onSessionExpired: () => void;
}
