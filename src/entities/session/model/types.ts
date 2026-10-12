export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  device_session_token: string;
}

export type SessionStatus = 'anonymous' | 'authenticated';

export type SessionEndReason = 'logout' | 'expired';
