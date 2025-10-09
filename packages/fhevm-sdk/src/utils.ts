/**
 * Utility functions for FHEVM SDK
 */

import type { FhevmType } from './types';

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate encrypted handle
 */
export function isValidHandle(handle: string): boolean {
  return /^0x[a-fA-F0-9]+$/.test(handle);
}

/**
 * Get byte size for FHEVM type
 */
export function getTypeSize(type: FhevmType): number {
  switch (type) {
    case 'euint8':
    case 'ebool':
      return 1;
    case 'euint16':
      return 2;
    case 'euint32':
      return 4;
    case 'euint64':
      return 8;
    case 'eaddress':
      return 20;
    default:
      throw new Error(`Unknown type: ${type}`);
  }
}

/**
 * Validate value for type
 */
export function validateValue(type: FhevmType, value: any): boolean {
  switch (type) {
    case 'euint8':
      return typeof value === 'number' && value >= 0 && value <= 255;
    case 'euint16':
      return typeof value === 'number' && value >= 0 && value <= 65535;
    case 'euint32':
      return typeof value === 'number' && value >= 0 && value <= 4294967295;
    case 'euint64':
      return typeof value === 'bigint' && value >= 0n;
    case 'ebool':
      return typeof value === 'boolean';
    case 'eaddress':
      return typeof value === 'string' && isValidAddress(value);
    default:
      return false;
  }
}

/**
 * Format bigint to string with decimals
 */
export function formatBigInt(value: bigint, decimals: number = 18): string {
  const str = value.toString();
  const len = str.length;

  if (len <= decimals) {
    return '0.' + '0'.repeat(decimals - len) + str;
  }

  const intPart = str.slice(0, len - decimals);
  const decPart = str.slice(len - decimals);

  return intPart + '.' + decPart;
}

/**
 * Parse string to bigint with decimals
 */
export function parseBigInt(value: string, decimals: number = 18): bigint {
  const parts = value.split('.');
  const intPart = parts[0] || '0';
  const decPart = (parts[1] || '').padEnd(decimals, '0').slice(0, decimals);

  return BigInt(intPart + decPart);
}

/**
 * Sleep utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        await sleep(delayMs * Math.pow(2, i));
      }
    }
  }

  throw lastError!;
}
