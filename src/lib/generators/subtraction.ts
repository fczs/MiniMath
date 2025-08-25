import { Generator, Problem, Level } from '../types';
import { getLevelRanges, randomInRange, generateProblemId, createProblemKey, retryWithFallback } from './utils';

export class SubtractionGenerator implements Generator {
  private usedProblems: Set<string> = new Set();
  private zeroExampleUsed = false;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next(level: Level, _sessionCtx?: object): Problem {
    const operands = retryWithFallback(
      () => this.generateOperands(level),
      (ops) => !this.shouldReject(ops),
      () => this.generateFallbackOperands(level)
    );

    const answer = operands[0] - operands[1];
    const prompt = `${operands[0]} - ${operands[1]} = ?`;
    
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
    
    if (operands[1] === 0) {
      this.zeroExampleUsed = true;
    }

    return problem;
  }

  private generateOperands(level: Level): number[] {
    switch (level) {
      case 1: {
        // Single-digit: a ≥ b to avoid negatives, result in [0..9]
        let a: number, b: number;

        do {
          a = randomInRange(0, 9);
          b = randomInRange(0, a); // Ensure a ≥ b (no negatives)
        } while (a - b < 0); // Extra safety check

        return [a, b];
      }
      
      case 2: {
        // Two-digit: similar constraints to avoid negatives by default
        const ranges = getLevelRanges(level);
        let a: number, b: number;

        do {
          a = randomInRange(ranges.min, ranges.max);
          b = randomInRange(ranges.min, Math.min(a, ranges.max)); // b ≤ a
        } while (a - b < 0);

        return [a, b];
      }
      
      case 3: {
        // Three-digit: similar constraints
        const ranges = getLevelRanges(level);
        let a: number, b: number;

        do {
          a = randomInRange(ranges.min, ranges.max);
          b = randomInRange(ranges.min, Math.min(a, ranges.max)); // b ≤ a
        } while (a - b < 0);

        return [a, b];
      }
      
      default:
        throw new Error(`Invalid level: ${level}`);
    }
  }

  private shouldReject(operands: number[]): boolean {
    const [a, b] = operands;
    
    // Never allow negative results in any level (following Addition-like simplicity)
    if (a - b < 0) {
      return true;
    }

    // Never allow a - a = 0 when a > 0 (only allow 0 - 0 = 0 as a special case)
    if (a === b && a > 0) {
      return true;
    }

    // Check if this problem was already used in session
    const problemKey = createProblemKey(operands, '-');

    if (this.usedProblems.has(problemKey)) {
      return true;
    }

    // Limit examples with zero subtraction (x - 0) to maximum one per session
    if (b === 0 && this.zeroExampleUsed) {
      return true;
    }

    return false;
  }

  private generateFallbackOperands(level: Level): number[] {
    // Generate simple, safe fallbacks that are likely not used
    switch (level) {
      case 1:
        return [2, 1]; // 2 - 1 = 1
      case 2:
        return [12, 11]; // 12 - 11 = 1
      case 3:
        return [112, 111]; // 112 - 111 = 1
      default:
        return [2, 1];
    }
  }

  // Reset state for new session
  reset(): void {
    this.usedProblems.clear();

    this.zeroExampleUsed = false;
  }
}
