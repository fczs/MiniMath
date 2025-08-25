import { Level } from '../types';

/**
 * Shared utilities for generators
 */

export interface LevelRanges {
  min: number;
  max: number;
}

/**
 * Get number ranges by level
 */
export const getLevelRanges = (level: Level): LevelRanges => {
  switch (level) {
    case 1:
      return { min: 0, max: 9 };
    case 2:
      return { min: 10, max: 99 };
    case 3:
      return { min: 100, max: 999 };
    default:
      throw new Error(`Invalid level: ${level}`);
  }
};

/**
 * Generate random number within range (inclusive)
 */
export const randomInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generate unique problem ID
 */
export const generateProblemId = (mode: string): string => {
  return `${mode}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Create problem key for tracking duplicates (accounts for commutativity)
 */
export const createProblemKey = (operands: number[], operation: string): string => {
  if (operation === '+' || operation === '*') {
    // Commutative operations: sort operands
    const sorted = [...operands].sort((a, b) => a - b);

    return sorted.join(operation);
  } else {
    // Non-commutative operations: preserve order
    return operands.join(operation);
  }
};

/**
 * Retry helper with fallback
 */
export const retryWithFallback = <T>(
  generator: () => T,
  validator: (result: T) => boolean,
  fallback: () => T,
  maxAttempts: number = 1000
): T => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const result = generator();

    if (validator(result)) {
      return result;
    }
  }
  
  // Use fallback if all attempts failed
  return fallback();
};
