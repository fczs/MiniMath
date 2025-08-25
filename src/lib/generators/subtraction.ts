import { Generator, Problem, Level } from '../types';
import { randomInRange, generateProblemId, createProblemKey, retryWithFallback } from './utils';

export class SubtractionGenerator implements Generator {
  private usedProblems: Set<string> = new Set();
  private zeroResultUsed = false;
  private zeroOperandUsed = false;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next(level: Level, _sessionCtx?: object): Problem {
    const operands = retryWithFallback(
      () => this.generateOperands(level),
      (ops) => !this.shouldReject(ops, level),
      () => this.generateFallbackOperands(level)
    );

    const answer = operands[0] - operands[1];
    // Use real minus sign U+2212 (−) not hyphen (-)
    const prompt = `${operands[0]} − ${operands[1]} = ?`;
    
    const problem: Problem = {
      id: generateProblemId('sub'),
      mode: 'subtraction',
      level,
      prompt,
      operands,
      answer,
      meta: {
        generatedAt: Date.now(),
      },
    };

    // Update tracking
    const problemKey = createProblemKey(operands, '-');

    this.usedProblems.add(problemKey);
    
    // Track zero results for all levels (when a === b)
    if (operands[0] === operands[1]) {
      this.zeroResultUsed = true;
    }

    // Track zero operands usage (when any operand is 0)
    if (operands[0] === 0 || operands[1] === 0) {
      this.zeroOperandUsed = true;
    }

    return problem;
  }

  private generateOperands(level: Level): number[] {
    switch (level) {
      case 1: {
        // Beginner: operands in [0..9], result non-negative (a ≥ b)
        const a = randomInRange(0, 9);
        const b = randomInRange(0, a); // Ensure a ≥ b (no negatives)

        return [a, b];
      }
      
      case 2: {
        // Intermediate: operands in [10..99], result non-negative (a ≥ b)
        const a = randomInRange(10, 99);
        const b = randomInRange(10, a); // Ensure a ≥ b (no negatives)

        return [a, b];
      }
      
      case 3: {
        // Advanced: operands in [0..99], result strictly negative (a < b)
        const a = randomInRange(0, 98); // Max 98 so b can be at least 99
        const b = randomInRange(a + 1, 99); // Ensure a < b (negative results)

        return [a, b];
      }
      
      default:
        throw new Error(`Invalid level: ${level}`);
    }
  }

  private shouldReject(operands: number[], level: Level): boolean {
    const [a, b] = operands;
    
    // Check if this problem was already used in session
    const problemKey = createProblemKey(operands, '-');

    if (this.usedProblems.has(problemKey)) {
      return true;
    }

    // Level 1 specific: Never allow 0-0
    if (level === 1 && a === 0 && b === 0) {
      return true;
    }

    // At most one zero result (a === b) per session for all levels
    if (a === b && this.zeroResultUsed) {
      return true;
    }

    // At most one problem with zero operand (a === 0 or b === 0) per session
    if ((a === 0 || b === 0) && this.zeroOperandUsed) {
      return true;
    }

    if (level === 1 || level === 2) {
      // Beginner/Intermediate: result must be non-negative
      if (a - b < 0) {
        return true;
      }
    } else if (level === 3) {
      // Advanced: result must be strictly negative
      if (a - b >= 0) {
        return true;
      }
      
      // No zero results allowed (enforced by a < b requirement)
      if (a === b) {
        return true;
      }
    }

    return false;
  }

  private generateFallbackOperands(level: Level): number[] {
    // Generate simple, safe fallbacks that are likely not used
    switch (level) {
      case 1:
        return [2, 1]; // 2 - 1 = 1 (non-negative)
      case 2:
        return [12, 11]; // 12 - 11 = 1 (non-negative)
      case 3:
        return [1, 2]; // 1 - 2 = -1 (negative)
      default:
        return [2, 1];
    }
  }

  // Reset state for new session
  reset(): void {
    this.usedProblems.clear();
    this.zeroResultUsed = false;
    this.zeroOperandUsed = false;
  }
}
