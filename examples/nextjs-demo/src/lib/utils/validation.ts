/**
 * Validation Utilities
 * Input validation helpers
 */

/**
 * Validate required fields
 */
export function validateRequired(value: any): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
}

/**
 * Validate number range
 */
export function validateRange(
  value: number,
  min: number,
  max: number
): boolean {
  return value >= min && value <= max;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate hex string
 */
export function validateHex(hex: string): boolean {
  return /^0x[a-fA-F0-9]+$/.test(hex);
}

/**
 * Validate positive integer
 */
export function validatePositiveInteger(value: string | number): boolean {
  const num = typeof value === 'string' ? parseInt(value) : value;
  return Number.isInteger(num) && num > 0;
}

/**
 * Create validation error message
 */
export function createErrorMessage(field: string, type: string): string {
  const messages: Record<string, string> = {
    required: `${field} is required`,
    invalid: `${field} is invalid`,
    range: `${field} is out of range`,
    format: `${field} has invalid format`,
  };

  return messages[type] || `${field} validation failed`;
}
