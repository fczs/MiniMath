import { Generator, Problem, Level } from '../types';

export class AdditionGenerator implements Generator {
  private usedProblems: Set<string> = new Set();
  private zeroExampleUsed = false;

  next(level: Level): Problem {
    let operands: number[];
    let attempts = 0;
    const maxAttempts = 1000; // Increase attempts to handle constraints

    do {
      operands = this.generateOperands(level);
      attempts++;
      
      if (attempts >= maxAttempts) {
        // Fallback: generate a simple, guaranteed unique problem
        operands = this.generateFallbackOperands(level);
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
    const problemKey = this.getProblemKey(operands);

    this.usedProblems.add(problemKey);
    
    if (operands[0] === 0 || operands[1] === 0) {
      this.zeroExampleUsed = true;
    }

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
    // Never allow 0 + 0
    if (operands[0] === 0 && operands[1] === 0) {
      return true;
    }

    // Check if this problem was already used in session
    const problemKey = this.getProblemKey(operands);

    if (this.usedProblems.has(problemKey)) {
      return true;
    }

    // Limit examples with zero to maximum one per session
    if ((operands[0] === 0 || operands[1] === 0) && this.zeroExampleUsed) {
      return true;
    }

    return false;
  }

  private getProblemKey(operands: number[]): string {
    // Sort operands to handle commutativity (3+5 = 5+3)
    const sorted = [...operands].sort((a, b) => a - b);

    return sorted.join('+');
  }

  private generateFallbackOperands(level: Level): number[] {
    // Generate a simple, safe fallback that's likely not used
    switch (level) {
      case 1:
        return [1, 1]; // Simple fallback for level 1
      case 2:
        return [11, 11]; // Simple fallback for level 2
      case 3:
        return [111, 111]; // Simple fallback for level 3
      default:
        return [1, 1];
    }
  }

  private generateId(): string {
    return `add_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Reset state for new session
  reset(): void {
    this.usedProblems.clear();
    this.zeroExampleUsed = false;
  }
}
