import crypto from 'crypto';

const ALGO = 'aes-256-gcm';
const PREFIX = 'enc:';

function getKey() {
  const raw = process.env.TOKEN_ENCRYPTION_KEY;
  if (!raw) {
    // In development (or if not set), we might want to warn or fallback.
    // But for security, it's better to fail if we expect encryption.
    // However, during build or if feature is optional, we might need a dummy.
    // For now, let's throw if missing, prompting user to set it.
    throw new Error('TOKEN_ENCRYPTION_KEY missing in environment variables');
  }
  return Buffer.from(raw, 'base64');
}

export function encrypt(plain: string): string {
  // If already encrypted or empty, return as is
  if (!plain || plain.startsWith(PREFIX)) return plain;

  try {
    const key = getKey();
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGO, key, iv);
    
    // Encrypt
    const encrypted = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    
    // Format: iv + tag + encrypted_data
    const payload = Buffer.concat([iv, tag, encrypted]).toString('base64');
    return `${PREFIX}${payload}`;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Encryption failed:', error);
    // Fallback? or throw? Safest is to throw to avoid saving plain text if we meant to encrypt.
    throw error;
  }
}

export function decrypt(value: string): string {
  if (!value || !value.startsWith(PREFIX)) return value;

  try {
    const key = getKey();
    // Remove prefix
    const data = Buffer.from(value.substring(PREFIX.length), 'base64');
    
    // Extract parts
    const iv = data.subarray(0, 12);
    const tag = data.subarray(12, 28);
    const encrypted = data.subarray(28);
    
    const decipher = crypto.createDecipheriv(ALGO, key, iv);
    decipher.setAuthTag(tag);
    
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Decryption failed for value:', value, error);
    return value; // Return original if decryption fails (e.g. key changed or corrupt)
  }
}
