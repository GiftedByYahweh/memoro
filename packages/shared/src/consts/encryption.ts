export const EncryptionAlgorithm = {
  AES_GCM: 'AES-GCM',
  AES_CTR: 'AES-CTR',
} as const;
export type EncryptionAlgorithm = (typeof EncryptionAlgorithm)[keyof typeof EncryptionAlgorithm];

export const ENCRYPTION_CONSTRAINTS = {
  ALGORITHM_MAX_LENGTH: 16,
  ORIGINAL_IV_MAX_LENGTH: 32,
} as const;
