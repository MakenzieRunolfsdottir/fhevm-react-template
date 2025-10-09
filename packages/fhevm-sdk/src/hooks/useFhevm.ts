/**
 * React Hook for FHEVM SDK
 * Provides convenient access to FHEVM operations in React components
 */

import { useCallback } from 'react';
import { useFhevmContext } from '../provider';
import { encryptInput, decryptOutput } from '../encryption';
import type { EncryptionOptions, DecryptionOptions, EncryptedInput } from '../types';

/**
 * Main FHEVM hook
 * Provides encrypt, decrypt, and client access
 */
export function useFhevm() {
  const { client, isInitialized, error, init } = useFhevmContext();

  /**
   * Encrypt a value
   */
  const encrypt = useCallback(
    async (
      contractAddress: string,
      userAddress: string,
      options: EncryptionOptions
    ): Promise<EncryptedInput> => {
      if (!client) {
        throw new Error('FHEVM client not initialized');
      }

      return await encryptInput(client, contractAddress, userAddress, options);
    },
    [client]
  );

  /**
   * Decrypt a value
   */
  const decrypt = useCallback(
    async (options: DecryptionOptions): Promise<bigint> => {
      if (!client) {
        throw new Error('FHEVM client not initialized');
      }

      return await decryptOutput(client, options);
    },
    [client]
  );

  /**
   * Public decrypt (no signature)
   */
  const publicDecrypt = useCallback(
    async (handle: string, contractAddress: string): Promise<bigint> => {
      if (!client) {
        throw new Error('FHEVM client not initialized');
      }

      return await client.publicDecrypt(handle, contractAddress);
    },
    [client]
  );

  /**
   * Create encrypted input builder
   */
  const createEncryptedInput = useCallback(
    (contractAddress: string, userAddress: string) => {
      if (!client) {
        throw new Error('FHEVM client not initialized');
      }

      return client.createEncryptedInput(contractAddress, userAddress);
    },
    [client]
  );

  /**
   * Get contract instance
   */
  const getContract = useCallback(
    (address: string, abi: any[]) => {
      if (!client) {
        throw new Error('FHEVM client not initialized');
      }

      return client.getContract(address, abi);
    },
    [client]
  );

  return {
    client,
    isInitialized,
    error,
    init,
    encrypt,
    decrypt,
    publicDecrypt,
    createEncryptedInput,
    getContract
  };
}

/**
 * Hook for encryption operations
 */
export function useFhevmEncrypt() {
  const { encrypt, createEncryptedInput } = useFhevm();

  return {
    encrypt,
    createEncryptedInput
  };
}

/**
 * Hook for decryption operations
 */
export function useFhevmDecrypt() {
  const { decrypt, publicDecrypt } = useFhevm();

  return {
    decrypt,
    publicDecrypt
  };
}

/**
 * Hook for contract interactions
 */
export function useFhevmContract(address: string, abi: any[]) {
  const { getContract } = useFhevm();

  return getContract(address, abi);
}
