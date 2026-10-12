export interface MockWebhook {
  id: number;
  name: string;
  url: string;
  active: boolean;
  created_at: string;
}

export interface MockSession {
  userId: number;
  fingerprint: string;
  expiresAt: number;
}

export interface MockDeviceSession {
  userId: number;
  fingerprint: string;
}
