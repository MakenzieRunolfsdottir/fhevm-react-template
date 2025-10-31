/**
 * API Type Definitions
 * Types for API requests and responses
 */

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface EncryptRequest {
  value: number | string | boolean;
  type: 'euint8' | 'euint32' | 'euint64' | 'ebool';
  contractAddress: string;
  userAddress: string;
}

export interface EncryptResponse {
  encrypted: {
    handles: string[];
    inputProof: string;
  };
  type: string;
}

export interface DecryptRequest {
  handle: string;
  contractAddress: string;
  userAddress: string;
  signature?: string;
}

export interface DecryptResponse {
  decrypted: number | bigint | boolean;
  handle: string;
}

export interface ComputeRequest {
  operation: 'add' | 'subtract' | 'multiply' | 'compare';
  operands: string[];
  contractAddress: string;
}

export interface ComputeResponse {
  operation: string;
  result: string;
  message: string;
}
