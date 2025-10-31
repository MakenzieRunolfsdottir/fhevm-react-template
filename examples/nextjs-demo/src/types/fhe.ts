/**
 * FHE Type Definitions
 * Application-specific FHE types
 */

export type EncryptedDataType = 'euint8' | 'euint32' | 'euint64' | 'ebool';

export interface EncryptedInput {
  handles: string[];
  inputProof: string;
}

export interface FHEClientConfig {
  network: {
    chainId: number;
    name: string;
    rpcUrl: string;
  };
  contractAddress?: string;
}

export interface EncryptionOptions {
  type: EncryptedDataType;
  value: number | bigint | boolean;
  contractAddress: string;
  userAddress: string;
}

export interface DecryptionOptions {
  handle: string;
  contractAddress: string;
  userAddress: string;
  type: EncryptedDataType;
}
