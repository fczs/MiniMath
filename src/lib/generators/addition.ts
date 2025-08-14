import { Generator, Problem, Level } from '../types';

export class AdditionGenerator implements Generator {
  private lastProblem: Problem | null = null;
  private zeroZeroCount = 0;
  private readonly maxZeroZero = 1;

  next(level: Level): Problem {
    let operands: number[];
    let attempts = 0;
    const maxAttempts = 100; // Prevent infinite loops

    do {
      operands = this.generateOperands(level);
      attempts++;
      
      if (attempts >= maxAttempts) {
        // Fallback to prevent infinite loop
        break;
      }
    } while (this.shouldReject(operands));

    const answer = operands.reduce((sum, operand) => sum + operand, 0);
    const prompt = `${operands[0]} + ${operands[1]} = ?`;
    
    const problem: Problem = {
      id: this.generateId(),
      mode: 'addition',
      level,
      prompt,
      operands,
      answer,
      meta: {
        generatedAt: Date.now(),
      },
    };

    // Update tracking
    if (operands[0] === 0 && operands[1] === 0) {
      this.zeroZeroCount++;
    }
    this.lastProblem = problem;

    return problem;
  }

  private generateOperands(level: Level): number[] {
    switch (level) {
      case 1: {
        // Single-digit: operands in [0..9], result ≤ 18
        let a: number, b: number;

        do {
          a = Math.floor(Math.random() * 10); // 0-9
          b = Math.floor(Math.random() * 10); // 0-9
        } while (a + b > 18);

        return [a, b];
      }
      
      case 2: {
        // Two-digit: operands in [10..99]
        const a = Math.floor(Math.random() * 90) + 10; // 10-99
        const b = Math.floor(Math.random() * 90) + 10; // 10-99

        return [a, b];
      }
      
      case 3: {
        // Three-digit: operands in [100..999]
        const a = Math.floor(Math.random() * 900) + 100; // 100-999
        const b = Math.floor(Math.random() * 900) + 100; // 100-999

        return [a, b];
      }
      
      default:
        throw new Error(`Invalid level: ${level}`);
    }
  }

  private shouldReject(operands: number[]): boolean {
    // Avoid exact same pair as last problem
    if (this.lastProblem && this.operandsEqual(operands, this.lastProblem.operands)) {
      return true;
    }

    // Limit 0 + 0 occurrences
    if (operands[0] === 0 && operands[1] === 0 && this.zeroZeroCount >= this.maxZeroZero) {
      return true;
    }

    return false;
  }

  private operandsEqual(a: number[], b: number[]): boolean {
    if (a.length !== b.length) return false;
    
    // Check both orders since addition is commutative
    const aMatches = a.every((val, idx) => val === b[idx]);
    const bMatches = a.every((val, idx) => val === b[b.length - 1 - idx]);
    
    return aMatches || bMatches;
  }

  private generateId(): string {
    return `add_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Reset state for new session
  reset(): void {
    this.lastProblem = null;
    this.zeroZeroCount = 0;
  }
}
