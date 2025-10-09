/**
 * Encryption and Decryption Utilities
 * Helper functions for FHE operations
 */

import type { FhevmClient } from './client';
import type { EncryptionOptions, DecryptionOptions, EncryptedInput } from './types';

/**
 * Encrypt input value based on type
 */
export async function encryptInput(
  client: FhevmClient,
  contractAddress: string,
  userAddress: string,
  options: EncryptionOptions
): Promise<EncryptedInput> {
  const builder = client.createEncryptedInput(contractAddress, userAddress);

  switch (options.type) {
    case 'euint8':
      builder.add8(Number(options.value));
      break;
    case 'euint16':
      builder.add16(Number(options.value));
      break;
    case 'euint32':
      builder.add32(Number(options.value));
      break;
    case 'euint64':
      builder.add64(BigInt(options.value));
      break;
    case 'ebool':
      builder.addBool(Boolean(options.value));
      break;
    case 'eaddress':
      builder.addAddress(String(options.value));
      break;
    default:
      throw new Error(`Unsupported encryption type: ${options.type}`);
  }

  return await builder.encrypt();
}

/**
 * Decrypt output value
 */
export async function decryptOutput(
  client: FhevmClient,
  options: DecryptionOptions
): Promise<bigint> {
  return await client.userDecrypt(
    options.handle,
    options.contractAddress,
    options.userAddress
  );
}

/**
 * Batch encrypt multiple values
 */
export async function batchEncrypt(
  client: FhevmClient,
  contractAddress: string,
  userAddress: string,
  values: EncryptionOptions[]
): Promise<EncryptedInput> {
  const builder = client.createEncryptedInput(contractAddress, userAddress);

  for (const value of values) {
    switch (value.type) {
      case 'euint8':
        builder.add8(Number(value.value));
        break;
      case 'euint16':
        builder.add16(Number(value.value));
        break;
      case 'euint32':
        builder.add32(Number(value.value));
        break;
      case 'euint64':
        builder.add64(BigInt(value.value));
        break;
      case 'ebool':
        builder.addBool(Boolean(value.value));
        break;
      case 'eaddress':
        builder.addAddress(String(value.value));
        break;
    }
  }

  return await builder.encrypt();
}

/**
 * Public decrypt (no signature required)
 */
export async function publicDecrypt(
  client: FhevmClient,
  handle: string,
  contractAddress: string
): Promise<bigint> {
  return await client.publicDecrypt(handle, contractAddress);
}
