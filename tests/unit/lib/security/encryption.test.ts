import { describe, it, expect, beforeAll } from 'vitest';
import { encrypt, decrypt } from '@/lib/security/encryption';

// NOTE: These tests assume TOKEN_ENCRYPTION_KEY is set to a valid 32-byte base64 value.
// We ensure that in the test process so they are self-contained.

describe('encryption helpers', () => {
  const PLAINTEXT = 'sensitive-token-123';

  beforeAll(() => {
    if (!process.env.TOKEN_ENCRYPTION_KEY) {
      const rawKey = '0123456789abcdef0123456789abcdef'; // 32 chars -> 32 bytes
      process.env.TOKEN_ENCRYPTION_KEY = Buffer.from(rawKey, 'utf8').toString('base64');
    }
  });

  it('encrypts and decrypts a value losslessly', () => {
    const cipher = encrypt(PLAINTEXT);
    expect(cipher).not.toBe(PLAINTEXT);

    const decoded = decrypt(cipher);
    expect(decoded).toBe(PLAINTEXT);
  });

  it('encrypt is idempotent for already-encrypted strings', () => {
    const cipher = encrypt(PLAINTEXT);
    const cipherAgain = encrypt(cipher);

    expect(cipherAgain).toBe(cipher);
  });

  it('decrypt returns original value for unencrypted input', () => {
    const value = 'not-encrypted';
    expect(decrypt(value)).toBe(value);
  });

  it('decrypt gracefully handles corrupted encrypted payloads', () => {
    const corrupted = 'enc:this-is-not-valid-base64';
    const result = decrypt(corrupted);

    // When decryption fails, implementation returns the original value
    expect(result).toBe(corrupted);
  });

  it('throws when TOKEN_ENCRYPTION_KEY is missing on encrypt', () => {
    const originalKey = process.env.TOKEN_ENCRYPTION_KEY;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore allow deleting env key for this test
    delete process.env.TOKEN_ENCRYPTION_KEY;

    try {
      expect(() => encrypt('test')).toThrowError();
    } finally {
      // Restore key so other tests keep working
      if (originalKey) {
        process.env.TOKEN_ENCRYPTION_KEY = originalKey;
      }
    }
  });
});
