/**
 * FHE Type Definitions
 * TypeScript types for FHE operations
 */

export type FHEDataType = 'euint8' | 'euint32' | 'euint64' | 'ebool';

export type EncryptionResult = {
  handles: string[];
  inputProof: string;
};

export type DecryptionResult = number | bigint | boolean;

export type FHEOperation = 'add' | 'subtract' | 'multiply' | 'divide' | 'compare' | 'min' | 'max';

export interface FHEConfig {
  network: {
    chainId: number;
    name: string;
    rpcUrl: string;
  };
  contractAddress?: string;
}

export interface EncryptionParams {
  value: number | bigint | boolean;
  type: FHEDataType;
  contractAddress: string;
  userAddress: string;
}

export interface DecryptionParams {
  handle: string;
  contractAddress: string;
  userAddress: string;
  type: FHEDataType;
}

export interface ComputationParams {
  operation: FHEOperation;
  operands: string[];
  contractAddress: string;
}
