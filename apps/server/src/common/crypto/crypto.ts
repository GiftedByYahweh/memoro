import { scrypt as scryptCb, randomBytes, createHash, timingSafeEqual } from 'node:crypto';

const KEY_LENGTH = 64;
const SALT_LENGTH = 16;
const DEFAULT_TOKEN_BYTES = 32;

const SCRYPT_COST = 32768;
const SCRYPT_BLOCK_SIZE = 8;
const SCRYPT_PARALLELIZATION = 3;
const SCRYPT_MAX_MEMORY = 64 * 1024 * 1024;
const SCRYPT_OPTIONS = {
  N: SCRYPT_COST,
  r: SCRYPT_BLOCK_SIZE,
  p: SCRYPT_PARALLELIZATION,
  maxmem: SCRYPT_MAX_MEMORY,
};

function deriveKey(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCb(password, salt, KEY_LENGTH, SCRYPT_OPTIONS, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(derivedKey);
    });
  });
}

export const hashPassword = async (password: string): Promise<string> => {
  const salt = randomBytes(SALT_LENGTH);
  const derivedKey = await deriveKey(password, salt);
  return `${salt.toString('hex')}:${derivedKey.toString('hex')}`;
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const parts = hash.split(':');
  const saltHex = parts[0];
  const keyHex = parts[1];

  if (!saltHex || !keyHex) {
    return false;
  }

  const salt = Buffer.from(saltHex, 'hex');
  const originalKey = Buffer.from(keyHex, 'hex');

  if (originalKey.length !== KEY_LENGTH) {
    return false;
  }

  const derivedKey = await deriveKey(password, salt);
  return timingSafeEqual(originalKey, derivedKey);
};

export const generateToken = (bytes: number = DEFAULT_TOKEN_BYTES): string => {
  return randomBytes(bytes).toString('hex');
};

export const hashToken = (token: string): string => {
  return createHash('sha256').update(token).digest('hex');
};
