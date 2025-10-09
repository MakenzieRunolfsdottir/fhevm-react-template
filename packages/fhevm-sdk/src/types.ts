/**
 * Core types for FHEVM SDK
 */

import { ethers } from 'ethers';

export interface FhevmConfig {
  network: {
    chainId: number;
    name: string;
    rpcUrl: string;
  };
  gatewayUrl?: string;
  aclAddress?: string;
  kmsVerifierAddress?: string;
}

export interface FhevmInstance {
  createEncryptedInput: (contractAddress: string, userAddress: string) => EncryptedInputBuilder;
  userDecrypt: (handle: string, contractAddress: string, userAddress: string) => Promise<bigint>;
  publicDecrypt: (handle: string, contractAddress: string) => Promise<bigint>;
  hasKeypair: (address: string) => boolean;
  generateKeypair: () => Promise<void>;
}

export interface EncryptedInputBuilder {
  add8: (value: number) => EncryptedInputBuilder;
  add16: (value: number) => EncryptedInputBuilder;
  add32: (value: number) => EncryptedInputBuilder;
  add64: (value: bigint) => EncryptedInputBuilder;
  addBool: (value: boolean) => EncryptedInputBuilder;
  addAddress: (value: string) => EncryptedInputBuilder;
  encrypt: () => Promise<EncryptedInput>;
}

export interface EncryptedInput {
  handles: Uint8Array[];
  inputProof: string;
}

export interface DecryptionResult {
  value: bigint;
  decrypted: boolean;
}

export interface ContractInfo {
  address: string;
  abi: any[];
  contractName?: string;
}

export type FhevmType = 'euint8' | 'euint16' | 'euint32' | 'euint64' | 'ebool' | 'eaddress';

export interface EncryptionOptions {
  type: FhevmType;
  value: number | bigint | boolean | string;
}

export interface DecryptionOptions {
  handle: string;
  contractAddress: string;
  userAddress: string;
  type: FhevmType;
}
