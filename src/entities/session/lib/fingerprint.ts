import { STORAGE_KEY } from 'src/shared/config';
import { randomHex, safeStorage } from 'src/shared/lib';

const FINGERPRINT_PATTERN = /^[0-9a-f]{32}$/;

let cached: string | null = null;

export function getFingerprint(): string {
  if (cached) return cached;

  const stored = safeStorage.get(STORAGE_KEY.FINGERPRINT);
  if (stored && FINGERPRINT_PATTERN.test(stored)) {
    cached = stored;
    return stored;
  }

  const generated = randomHex(16);
  safeStorage.set(STORAGE_KEY.FINGERPRINT, generated);
  cached = generated;
  return generated;
}
