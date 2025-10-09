/**
 * FHEVM SDK - Universal SDK for Fully Homomorphic Encryption
 * Framework-agnostic solution for building confidential dApps
 */

export { FhevmClient } from './client';
export { createFhevmInstance } from './instance';
export { encryptInput, decryptOutput } from './encryption';
export { useFhevm } from './hooks/useFhevm';
export { FhevmProvider } from './provider';
export * from './types';
export * from './utils';

// Re-export commonly used types
export type {
  FhevmConfig,
  EncryptedInput,
  DecryptionResult,
  FhevmInstance
} from './types';
