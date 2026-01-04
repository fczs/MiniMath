import { Generator, Problem, Level } from '../types';
import { randomInRange, generateProblemId, createProblemKey, retryWithFallback } from './utils';

export class MultiplicationGenerator implements Generator {
  private usedProblems: Set<string> = new Set();
  private zeroFactorUsed = false;
  private oneFactorUsed = false;
  private tenFactorUsed = false; // For level 2

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next(level: Level, _sessionCtx?: object): Problem {
    const operands = retryWithFallback(
      () => this.generateOperands(level),
      (ops) => !this.shouldReject(ops, level),
      () => this.generateFallbackOperands(level)
    );

    const answer = operands[0] * operands[1];
    // Use multiplication sign × (U+00D7)
    const prompt = `${operands[0]} × ${operands[1]} = ?`;
    
    const problem: Problem = {
      id: generateProblemId('mul'),
      mode: 'multiplication',
      level,
      prompt,
      operands,
      answer,
      meta: {
        generatedAt: Date.now(),
      },
    };

    // Update tracking
    const problemKey = createProblemKey(operands, '*');

    this.usedProblems.add(problemKey);
    
    // Track special factors usage
    if (operands[0] === 0 || operands[1] === 0) {
      this.zeroFactorUsed = true;
    }

    if (operands[0] === 1 || operands[1] === 1) {
      this.oneFactorUsed = true;
    }

    if (operands[0] === 10 || operands[1] === 10) {
      this.tenFactorUsed = true;
    }

    return problem;
  }

  private generateOperands(level: Level): number[] {
    switch (level) {
      case 1: {
        // Beginner: factors a,b ∈ [0..9] (single-digit)
        const a = randomInRange(0, 9);
        const b = randomInRange(0, 9);

        return [a, b];
      }
      
      case 2: {
        // Intermediate: mix of variants
        // - Both are multiples of 10: {10,20,30,40,50,60,70,80,90}
        // - Or one is single digit (2-9) and other is multiple of 10
        const multiples = [10, 20, 30, 40, 50, 60, 70, 80, 90];
        
        // ~50% chance for each variant
        if (Math.random() < 0.5) {
          // Both are multiples of 10
          const a = multiples[Math.floor(Math.random() * multiples.length)];
          const b = multiples[Math.floor(Math.random() * multiples.length)];
          
          return [a, b];
        } else {
          // One single digit (2-9), one multiple of 10
          const singleDigit = randomInRange(2, 9);
          const multiple = multiples[Math.floor(Math.random() * multiples.length)];
          
          // Randomly decide which position gets which factor
          if (Math.random() < 0.5) {
            return [singleDigit, multiple];
          } else {
            return [multiple, singleDigit];
          }
        }
      }
      
      case 3: {
        // Advanced: one factor is single digit 2..9; the other is 10..99 (two-digit)
        const singleDigit = randomInRange(2, 9);
        const twoDigit = randomInRange(10, 99);
        
        // Randomly decide which position gets which factor
        if (Math.random() < 0.5) {
          return [singleDigit, twoDigit];
        } else {
          return [twoDigit, singleDigit];
        }
      }
      
      default:
        throw new Error(`Invalid level: ${level}`);
    }
  }

  private shouldReject(operands: number[], level: Level): boolean {
    const [a, b] = operands;
    
    // Check if this problem was already used in session (treat (a,b) and (b,a) as same)
    const problemKey = createProblemKey(operands, '*');
    
    if (this.usedProblems.has(problemKey)) {
      return true;
    }

    if (level === 1) {
      // Beginner constraints
      // At most one problem where any factor equals 0
      if ((a === 0 || b === 0) && this.zeroFactorUsed) {
        return true;
      }
      
      // At most one problem where any factor equals 1
      if ((a === 1 || b === 1) && this.oneFactorUsed) {
        return true;
      }
    } else if (level === 2) {
      // Intermediate constraints
      // At most one problem where any factor equals 10
      if ((a === 10 || b === 10) && this.tenFactorUsed) {
        return true;
      }
    }
    // Level 3 has no special factor constraints

    return false;
  }

  private generateFallbackOperands(level: Level): number[] {
    // Generate simple, safe fallbacks that are likely not used
    switch (level) {
      case 1:
        return [2, 3]; // 2 × 3 = 6
      case 2:
        return [20, 30]; // 20 × 30 = 600
      case 3:
        return [2, 11]; // 2 × 11 = 22
      default:
        return [2, 3];
    }
  }

  // Reset state for new session
  reset(): void {
    this.usedProblems.clear();
    this.zeroFactorUsed = false;
    this.oneFactorUsed = false;
    this.tenFactorUsed = false;
  }
}
