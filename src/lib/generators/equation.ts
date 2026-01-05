import { Generator, Problem, Level } from '../types';
import { randomInRange, generateProblemId, retryWithFallback } from './utils';

type EquationType = 
  | 'x_plus_b_eq_c'      // x + b = c
  | 'a_minus_x_eq_c'     // a - x = c
  | 'x_times_b_eq_c'     // x × b = c
  | 'a_div_x_eq_c'       // a ÷ x = c
  | 'a_times_x_plus_b'   // a × (x + b) = c
  | 'a_times_x_minus_b'; // a × (x - b) = c

interface EquationData {
  type: EquationType;
  prompt: string;
  answer: number;
  operands: number[];
}

export class EquationGenerator implements Generator {
  private usedProblems: Set<string> = new Set();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next(level: Level, _sessionCtx?: object): Problem {
    const equationData = retryWithFallback(
      () => this.generateEquation(level),
      (data) => !this.shouldReject(data, level),
      () => this.generateFallbackEquation(level)
    );

    const problem: Problem = {
      id: generateProblemId('eq'),
      mode: 'equation',
      level,
      prompt: equationData.prompt,
      operands: equationData.operands,
      answer: equationData.answer,
      meta: {
        generatedAt: Date.now(),
        equationType: equationData.type,
      },
    };

    // Track used problems
    const problemKey = `${equationData.type}:${equationData.prompt}`;

    this.usedProblems.add(problemKey);

    return problem;
  }

  private generateEquation(level: Level): EquationData {
    switch (level) {
      case 1:
        return this.generateLevel1Equation();
      case 2:
        return this.generateLevel2Equation();
      case 3:
        return this.generateLevel3Equation();
      default:
        throw new Error(`Invalid level: ${level}`);
    }
  }

  // Level 1: x + b = c or a - x = c
  private generateLevel1Equation(): EquationData {
    const useAddition = Math.random() < 0.5;
    
    if (useAddition) {
      // x + b = c, find x
      // x = c - b, ensure x >= 0 and c <= 99
      const x = randomInRange(0, 98);
      const b = randomInRange(1, 99 - x);
      const c = x + b;
      
      return {
        type: 'x_plus_b_eq_c',
        prompt: `x + ${b} = ${c}`,
        answer: x,
        operands: [b, c],
      };
    } else {
      // a - x = c, find x
      // x = a - c, ensure x >= 0 and a <= 99
      const a = randomInRange(1, 99);
      const x = randomInRange(0, a);
      const c = a - x;
      
      return {
        type: 'a_minus_x_eq_c',
        prompt: `${a} − x = ${c}`,
        answer: x,
        operands: [a, c],
      };
    }
  }

  // Level 2: x × b = c or a ÷ x = c
  private generateLevel2Equation(): EquationData {
    const useMultiplication = Math.random() < 0.5;
    
    if (useMultiplication) {
      // x × b = c, find x
      // x = c / b, ensure integer result
      const x = randomInRange(1, 9);
      const b = randomInRange(2, Math.min(9, Math.floor(99 / x)));
      const c = x * b;
      
      return {
        type: 'x_times_b_eq_c',
        prompt: `x × ${b} = ${c}`,
        answer: x,
        operands: [b, c],
      };
    } else {
      // a ÷ x = c, find x
      // x = a / c, ensure integer result and x > 0
      const x = randomInRange(2, 9);
      const c = randomInRange(1, Math.floor(99 / x));
      const a = x * c;
      
      return {
        type: 'a_div_x_eq_c',
        prompt: `${a} ÷ x = ${c}`,
        answer: x,
        operands: [a, c],
      };
    }
  }

  // Level 3: a × (x + b) = c or a × (x - b) = c
  private generateLevel3Equation(): EquationData {
    const useAddition = Math.random() < 0.5;
    
    if (useAddition) {
      // a × (x + b) = c, find x
      // x + b = c / a, x = (c / a) - b
      // Need: c divisible by a, x >= 0, all numbers <= 99
      const a = randomInRange(2, 9);
      const innerResult = randomInRange(1, Math.floor(99 / a)); // x + b (must be >= 1)
      const c = a * innerResult; // c is guaranteed to be divisible by a
      const b = randomInRange(1, innerResult); // b <= innerResult so x >= 0
      const x = innerResult - b;
      
      // Safety check: verify x is a non-negative integer
      if (!Number.isInteger(x) || x < 0) {
        return this.generateFallbackEquation(3);
      }
      
      return {
        type: 'a_times_x_plus_b',
        prompt: `${a} × (x + ${b}) = ${c}`,
        answer: x,
        operands: [a, b, c],
      };
    } else {
      // a × (x - b) = c, find x
      // x - b = c / a, x = (c / a) + b
      // Need: c divisible by a, x >= 0, all numbers <= 99
      const a = randomInRange(2, 9);
      const maxInnerResult = Math.floor(99 / a);
      const innerResult = randomInRange(0, maxInnerResult); // x - b (can be 0)
      const c = a * innerResult; // c is guaranteed to be divisible by a
      
      // x = innerResult + b, need x <= 99, so b <= 99 - innerResult
      const maxB = Math.min(99 - innerResult, 20); // Cap b to reasonable size

      if (maxB < 1) {
        // Fallback to addition type
        return this.generateLevel3Equation();
      }
      
      const b = randomInRange(1, maxB);
      const x = innerResult + b;
      
      // Safety check: verify x is a non-negative integer
      if (!Number.isInteger(x) || x < 0 || x > 99) {
        return this.generateFallbackEquation(3);
      }
      
      return {
        type: 'a_times_x_minus_b',
        prompt: `${a} × (x − ${b}) = ${c}`,
        answer: x,
        operands: [a, b, c],
      };
    }
  }

  private shouldReject(data: EquationData, level: Level): boolean {
    // Check for duplicate problems
    const problemKey = `${data.type}:${data.prompt}`;

    if (this.usedProblems.has(problemKey)) {
      return true;
    }

    // Ensure answer is a non-negative integer
    if (data.answer < 0 || !Number.isInteger(data.answer)) {
      return true;
    }

    // Ensure all numbers are within bounds and are integers
    const allNumbers = [...data.operands, data.answer];

    if (allNumbers.some(n => n > 99 || n < 0 || !Number.isInteger(n))) {
      return true;
    }

    // Level-specific validation
    if (level === 2) {
      // Avoid trivial equations like x × 1 = x
      if (data.operands.includes(1)) {
        return true;
      }
    }

    // For Level 3 bracket equations, verify the inner result is an integer
    if (level === 3) {
      const [a, , c] = data.operands;

      if (c % a !== 0) {
        return true;
      }
    }

    return false;
  }

  private generateFallbackEquation(level: Level): EquationData {
    switch (level) {
      case 1:
        return {
          type: 'x_plus_b_eq_c',
          prompt: 'x + 5 = 12',
          answer: 7,
          operands: [5, 12],
        };
      case 2:
        return {
          type: 'x_times_b_eq_c',
          prompt: 'x × 4 = 20',
          answer: 5,
          operands: [4, 20],
        };
      case 3:
        return {
          type: 'a_times_x_plus_b',
          prompt: '3 × (x + 2) = 15',
          answer: 3,
          operands: [3, 2, 15],
        };
      default:
        return {
          type: 'x_plus_b_eq_c',
          prompt: 'x + 5 = 12',
          answer: 7,
          operands: [5, 12],
        };
    }
  }

  reset(): void {
    this.usedProblems.clear();
  }
}
