import { HttpResponse } from 'msw';

type ErrorType =
  | 'BadRequestException'
  | 'AuthenticationException'
  | 'NotFoundException'
  | 'TokenMismatchException'
  | 'ValidationException';

const errorResponse = (
  status: number,
  type: ErrorType,
  message: string,
  payload?: Record<string, string[]>,
) => HttpResponse.json({ error: { type, message, ...(payload && { payload }) } }, { status });

export const badRequest = (message = 'Bad request.') =>
  errorResponse(400, 'BadRequestException', message);

export const unauthenticated = () =>
  errorResponse(401, 'AuthenticationException', 'Unauthenticated.');

export const notFound = (message = 'Not found.') =>
  errorResponse(404, 'NotFoundException', message);

export const tokenMismatch = () =>
  errorResponse(419, 'TokenMismatchException', 'CSRF token mismatch.');

export const validationError = (payload: Record<string, string[]>) =>
  errorResponse(422, 'ValidationException', 'The given data was invalid.', payload);
