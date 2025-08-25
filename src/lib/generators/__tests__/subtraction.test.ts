import { SubtractionGenerator } from '../subtraction';
import { Level } from '../../types';

describe('SubtractionGenerator', () => {
  let generator: SubtractionGenerator;

  beforeEach(() => {
    generator = new SubtractionGenerator();
  });

  describe('Level 1 - Beginner (Single digits, non-negative)', () => {
    it('generates problems with single digits (0-9)', () => {
      for (let i = 0; i < 10; i++) {
        const problem = generator.next(1);
        
        expect(problem.operands).toHaveLength(2);
        expect(problem.operands[0]).toBeGreaterThanOrEqual(0);
        expect(problem.operands[0]).toBeLessThanOrEqual(9);
        expect(problem.operands[1]).toBeGreaterThanOrEqual(0);
        expect(problem.operands[1]).toBeLessThanOrEqual(9);
      }
    });

    it('ensures non-negative results (a ≥ b)', () => {
      for (let i = 0; i < 20; i++) {
        const problem = generator.next(1);
        const [a, b] = problem.operands;
        
        expect(a).toBeGreaterThanOrEqual(b);
        expect(problem.answer).toBeGreaterThanOrEqual(0);
      }
    });

    it('calculates correct answers', () => {
      for (let i = 0; i < 10; i++) {
        const problem = generator.next(1);
        const [a, b] = problem.operands;
        
        expect(problem.answer).toBe(a - b);
      }
    });

    it('uses real minus sign (−) in prompt', () => {
      const problem = generator.next(1);
      const [a, b] = problem.operands;
      
      expect(problem.prompt).toBe(`${a} − ${b} = ?`);
      expect(problem.prompt).toContain('−'); // U+2212 minus sign
      expect(problem.prompt).not.toContain('-'); // No hyphen
    });

    it('allows at most one zero result per session', () => {
      const problems = [];
      let zeroResultCount = 0;
      
      // Generate 20 problems to test constraint
      for (let i = 0; i < 20; i++) {
        const problem = generator.next(1);

        problems.push(problem);

        if (problem.answer === 0) {
          zeroResultCount++;
        }
      }
      
      expect(zeroResultCount).toBeLessThanOrEqual(1);
    });

    it('never generates 0-0 example', () => {
      // Generate many problems to test this constraint
      for (let i = 0; i < 100; i++) {
        const problem = generator.next(1);
        const [a, b] = problem.operands;
        
        expect(a === 0 && b === 0).toBe(false);
      }
    });

    it('allows at most one problem with zero operand per session', () => {
      const problems = [];
      let zeroOperandCount = 0;
      
      // Generate 20 problems to test constraint
      for (let i = 0; i < 20; i++) {
        const problem = generator.next(1);
        const [a, b] = problem.operands;

        problems.push(problem);

        if (a === 0 || b === 0) {
          zeroOperandCount++;
        }
      }
      
      expect(zeroOperandCount).toBeLessThanOrEqual(1);
    });

    it('simulates 100 sessions with correct constraints', () => {
      for (let session = 0; session < 100; session++) {
        generator.reset();
        let zeroResultCount = 0;
        let zeroOperandCount = 0;
        const usedPairs = new Set<string>();
        
        for (let i = 0; i < 10; i++) {
          const problem = generator.next(1);
          const [a, b] = problem.operands;
          
          // Operands in [0..9]
          expect(a).toBeGreaterThanOrEqual(0);
          expect(a).toBeLessThanOrEqual(9);
          expect(b).toBeGreaterThanOrEqual(0);
          expect(b).toBeLessThanOrEqual(9);
          
          // Non-negative results
          expect(problem.answer).toBeGreaterThanOrEqual(0);
          expect(a).toBeGreaterThanOrEqual(b);
          
          // Never 0-0
          expect(a === 0 && b === 0).toBe(false);
          
          // Track zero results, zero operands, and unique pairs
          if (problem.answer === 0) zeroResultCount++;

          if (a === 0 || b === 0) zeroOperandCount++;
          const pairKey = `${a}-${b}`;

          expect(usedPairs.has(pairKey)).toBe(false);
          usedPairs.add(pairKey);
        }
        
        expect(zeroResultCount).toBeLessThanOrEqual(1);
        expect(zeroOperandCount).toBeLessThanOrEqual(1);
        expect(usedPairs.size).toBe(10);
      }
    });
  });

  describe('Level 2 - Intermediate (Two digits, non-negative)', () => {
    it('generates problems with two digits (10-99)', () => {
      for (let i = 0; i < 10; i++) {
        const problem = generator.next(2);
        
        expect(problem.operands).toHaveLength(2);
        expect(problem.operands[0]).toBeGreaterThanOrEqual(10);
        expect(problem.operands[0]).toBeLessThanOrEqual(99);
        expect(problem.operands[1]).toBeGreaterThanOrEqual(10);
        expect(problem.operands[1]).toBeLessThanOrEqual(99);
      }
    });

    it('ensures non-negative results (a ≥ b)', () => {
      for (let i = 0; i < 20; i++) {
        const problem = generator.next(2);
        const [a, b] = problem.operands;
        
        expect(a).toBeGreaterThanOrEqual(b);
        expect(problem.answer).toBeGreaterThanOrEqual(0);
      }
    });

    it('never generates problems with zero operands (since range is 10-99)', () => {
      // Generate many problems to test this constraint
      for (let i = 0; i < 100; i++) {
        const problem = generator.next(2);
        const [a, b] = problem.operands;
        
        expect(a).not.toBe(0);
        expect(b).not.toBe(0);
      }
    });

    it('simulates 100 sessions with correct constraints', () => {
      for (let session = 0; session < 100; session++) {
        generator.reset();
        let zeroResultCount = 0;
        let zeroOperandCount = 0;
        const usedPairs = new Set<string>();
        
        for (let i = 0; i < 10; i++) {
          const problem = generator.next(2);
          const [a, b] = problem.operands;
          
          // Operands in [10..99]
          expect(a).toBeGreaterThanOrEqual(10);
          expect(a).toBeLessThanOrEqual(99);
          expect(b).toBeGreaterThanOrEqual(10);
          expect(b).toBeLessThanOrEqual(99);
          
          // Non-negative results
          expect(problem.answer).toBeGreaterThanOrEqual(0);
          expect(a).toBeGreaterThanOrEqual(b);
          
          // No zero operands (since range is 10-99)
          expect(a).not.toBe(0);
          expect(b).not.toBe(0);
          
          // Track zero results, zero operands, and unique pairs
          if (problem.answer === 0) zeroResultCount++;

          if (a === 0 || b === 0) zeroOperandCount++;
          const pairKey = `${a}-${b}`;

          expect(usedPairs.has(pairKey)).toBe(false);
          usedPairs.add(pairKey);
        }
        
        expect(zeroResultCount).toBeLessThanOrEqual(1);
        expect(zeroOperandCount).toBe(0); // Should be 0 for Level 2
        expect(usedPairs.size).toBe(10);
      }
    });
  });

  describe('Level 3 - Advanced (Mixed range, negative results)', () => {
    it('generates problems with operands in [0..99] range', () => {
      for (let i = 0; i < 10; i++) {
        const problem = generator.next(3);
        
        expect(problem.operands).toHaveLength(2);
        expect(problem.operands[0]).toBeGreaterThanOrEqual(0);
        expect(problem.operands[0]).toBeLessThanOrEqual(98); // a max is 98 to ensure b fits in range
        expect(problem.operands[1]).toBeGreaterThanOrEqual(0);
        expect(problem.operands[1]).toBeLessThanOrEqual(99);
      }
    });

    it('ensures strictly negative results (a < b)', () => {
      for (let i = 0; i < 20; i++) {
        const problem = generator.next(3);
        const [a, b] = problem.operands;
        
        expect(a).toBeLessThan(b);
        expect(problem.answer).toBeLessThan(0);
      }
    });

    it('never generates zero results', () => {
      for (let i = 0; i < 50; i++) {
        const problem = generator.next(3);
        
        expect(problem.answer).not.toBe(0);
        expect(problem.answer).toBeLessThan(0);
      }
    });

    it('allows at most one problem with zero operand per session', () => {
      const problems = [];
      let zeroOperandCount = 0;
      
      // Generate 20 problems to test constraint
      for (let i = 0; i < 20; i++) {
        const problem = generator.next(3);
        const [a, b] = problem.operands;

        problems.push(problem);

        if (a === 0 || b === 0) {
          zeroOperandCount++;
        }
      }
      
      expect(zeroOperandCount).toBeLessThanOrEqual(1);
    });

    it('simulates 100 sessions with correct constraints', () => {
      for (let session = 0; session < 100; session++) {
        generator.reset();
        let zeroOperandCount = 0;
        const usedPairs = new Set<string>();
        
        for (let i = 0; i < 10; i++) {
          const problem = generator.next(3);
          const [a, b] = problem.operands;
          
          // Operands in [0..99], but a is limited to [0..98] to ensure b can be in valid range
          expect(a).toBeGreaterThanOrEqual(0);
          expect(a).toBeLessThanOrEqual(98); // a max is 98 so b can be 99
          expect(b).toBeGreaterThanOrEqual(0);
          expect(b).toBeLessThanOrEqual(99);
          
          // Strictly negative results
          expect(problem.answer).toBeLessThan(0);
          expect(a).toBeLessThan(b);
          
          // No zero results
          expect(problem.answer).not.toBe(0);
          
          // Track zero operands and unique pairs
          if (a === 0 || b === 0) zeroOperandCount++;
          const pairKey = `${a}-${b}`;

          expect(usedPairs.has(pairKey)).toBe(false);
          usedPairs.add(pairKey);
        }
        
        expect(zeroOperandCount).toBeLessThanOrEqual(1);
        expect(usedPairs.size).toBe(10);
      }
    });
  });

  describe('Problem properties', () => {
    it('sets correct mode', () => {
      const problem = generator.next(1);

      expect(problem.mode).toBe('subtraction');
    });

    it('sets correct level', () => {
      [1, 2, 3].forEach(level => {
        const problem = generator.next(level as Level);

        expect(problem.level).toBe(level);
      });
    });

    it('includes metadata', () => {
      const problem = generator.next(1);

      expect(problem.meta).toBeDefined();
      expect(typeof problem.meta?.generatedAt).toBe('number');
    });

    it('generates unique IDs', () => {
      const ids = new Set();

      for (let i = 0; i < 100; i++) {
        const problem = generator.next(1);

        expect(ids.has(problem.id)).toBe(false);
        ids.add(problem.id);
      }
    });
  });

  describe('Avoiding duplicates', () => {
    it('avoids immediate duplicate problems', () => {
      const problems = [];

      for (let i = 0; i < 5; i++) {
        problems.push(generator.next(1));
      }

      // Check that consecutive problems are different
      for (let i = 1; i < problems.length; i++) {
        const prev = problems[i - 1];
        const curr = problems[i];
        
        // Problems should be different (either different operands)
        const prevKey = prev.operands.slice().sort().join('-');
        const currKey = curr.operands.slice().sort().join('-');
        
        expect(currKey).not.toBe(prevKey);
      }
    });

    it('resets tracking on reset()', () => {
      // Generate some problems
      for (let i = 0; i < 5; i++) {
        generator.next(1);
      }

      generator.reset();

      // Should be able to generate problems again without constraints
      const problem1 = generator.next(1);

      expect(problem1).toBeDefined();
      expect(problem1.mode).toBe('subtraction');
    });
  });
});
