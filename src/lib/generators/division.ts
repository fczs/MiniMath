import { Generator, Problem, Level } from '../types';
import { randomInRange, generateProblemId, createProblemKey, retryWithFallback } from './utils';

export class DivisionGenerator implements Generator {
  private usedProblems: Set<string> = new Set();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next(level: Level, _sessionCtx?: object): Problem {
    const operands = retryWithFallback(
      () => this.generateOperands(level),
      (ops) => !this.shouldReject(ops, level),
      () => this.generateFallbackOperands(level)
    );

    const answer = operands[0] / operands[1];
    // Use division sign ÷ (U+00F7)
    const prompt = `${operands[0]} ÷ ${operands[1]} = ?`;
    
    const problem: Problem = {
      id: generateProblemId('div'),
      mode: 'division',
      level,
      prompt,
      operands,
      answer,
      meta: {
        generatedAt: Date.now(),
      },
    };

    // Update tracking - for division, order matters so don't sort
    const problemKey = createProblemKey(operands, '/');

    this.usedProblems.add(problemKey);

    return problem;
  }

  private generateOperands(level: Level): number[] {
    switch (level) {
      case 1: {
        // Beginner: Division from multiplication table
        // Dividend: 0-81, Divisor: 1-9, Result must be integer 0-9
        // Generate as: result * divisor = dividend
        const divisor = randomInRange(1, 9); // Never divide by 0
        const result = randomInRange(0, 9);
        const dividend = result * divisor;

        return [dividend, divisor];
      }
      
      case 2: {
        // Intermediate: Division of tens
        // Both dividend and divisor are multiples of 10
        // Max: 990 / 10, examples: 400/20, 900/30
        const divisorMultiplier = randomInRange(1, 9); // 10, 20, 30... 90
        const divisor = divisorMultiplier * 10;
        
        // Result should be a reasonable number (1-99)
        const result = randomInRange(1, 99);
        const dividend = result * divisor;
        
        // Cap dividend at 990 * some reasonable limit
        if (dividend > 9900) {
          // Regenerate with smaller result
          const smallerResult = randomInRange(1, Math.floor(9900 / divisor));
          
          return [smallerResult * divisor, divisor];
        }

        return [dividend, divisor];
      }
      
      case 3: {
        // Advanced: Three-digit dividend ÷ single-digit divisor
        // Dividend: 100-999, Divisor: 2-9, Result must be integer
        const divisor = randomInRange(2, 9);
        
        // Generate dividend that is divisible by divisor and in range 100-999
        const minResult = Math.ceil(100 / divisor);
        const maxResult = Math.floor(999 / divisor);
        const result = randomInRange(minResult, maxResult);
        const dividend = result * divisor;

        return [dividend, divisor];
      }
      
      default:
        throw new Error(`Invalid level: ${level}`);
    }
  }

  private shouldReject(operands: number[], level: Level): boolean {
    const [dividend, divisor] = operands;
    
    // Never allow division by zero
    if (divisor === 0) {
      return true;
    }
    
    // Result must be an integer
    if (dividend % divisor !== 0) {
      return true;
    }
    
    // Check if this problem was already used in session
    const problemKey = createProblemKey(operands, '/');

    if (this.usedProblems.has(problemKey)) {
      return true;
    }

    // Level-specific constraints
    if (level === 1) {
      // Beginner: dividend 0-81, divisor 1-9, result 0-9
      const result = dividend / divisor;

      if (dividend > 81 || divisor < 1 || divisor > 9 || result > 9) {
        return true;
      }
    } else if (level === 2) {
      // Intermediate: divisor must be multiple of 10 (10-90)
      if (divisor % 10 !== 0 || divisor < 10 || divisor > 90) {
        return true;
      }
    } else if (level === 3) {
      // Advanced: dividend 100-999, divisor 2-9
      if (dividend < 100 || dividend > 999 || divisor < 2 || divisor > 9) {
        return true;
      }
    }

    return false;
  }

  private generateFallbackOperands(level: Level): number[] {
    // Generate simple, safe fallbacks that are likely not used
    switch (level) {
      case 1:
        return [12, 3]; // 12 ÷ 3 = 4
      case 2:
        return [200, 20]; // 200 ÷ 20 = 10
      case 3:
        return [126, 3]; // 126 ÷ 3 = 42
      default:
        return [12, 3];
    }
  }

  // Reset state for new session
  reset(): void {
    this.usedProblems.clear();
  }
}
