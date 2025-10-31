/**
 * Encryption Hook
 * Simplified encryption operations
 */

'use client';

import { useState, useCallback } from 'react';
import { useFhevm } from '@fhevm/sdk';

export function useEncryption() {
  const { client, isInitialized } = useFhevm();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const encrypt = useCallback(
    async (
      value: number | bigint | boolean,
      type: 'uint8' | 'uint32' | 'uint64' | 'bool',
      contractAddress: string,
      userAddress: string
    ) => {
      if (!client || !isInitialized) {
        throw new Error('FHEVM client not initialized');
      }

      setIsEncrypting(true);
      setError(null);

      try {
        const builder = client.createEncryptedInput(contractAddress, userAddress);

        switch (type) {
          case 'uint8':
            builder.add8(Number(value));
            break;
          case 'uint32':
            builder.add32(Number(value));
            break;
          case 'uint64':
            builder.add64(BigInt(value));
            break;
          case 'bool':
            builder.addBool(Boolean(value));
            break;
        }

        const result = await builder.encrypt();
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Encryption failed';
        setError(errorMessage);
        throw err;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client, isInitialized]
  );

  return {
    encrypt,
    isEncrypting,
    error,
  };
}
