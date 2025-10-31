/**
 * Security Utilities
 * Helper functions for security operations
 */

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

/**
 * Validate numeric input
 */
export function validateNumericInput(input: string): boolean {
  return /^\d+$/.test(input);
}

/**
 * Validate Ethereum address
 */
export function validateAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Truncate address for display
 */
export function truncateAddress(
  address: string,
  startLength: number = 6,
  endLength: number = 4
): string {
  if (!address) return '';
  if (address.length <= startLength + endLength) return address;

  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

/**
 * Validate proof format
 */
export function validateProof(proof: string): boolean {
  return proof.startsWith('0x') && proof.length >= 64;
}

/**
 * Hash data for verification
 */
export function hashData(data: string): string {
  // Simple hash function for demo
  // In production, use a proper hashing library
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return '0x' + Math.abs(hash).toString(16).padStart(64, '0');
}
