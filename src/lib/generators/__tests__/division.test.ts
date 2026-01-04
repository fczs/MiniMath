import { DivisionGenerator } from '../division';
import { Level } from '../../types';

describe('DivisionGenerator', () => {
  let generator: DivisionGenerator;

  beforeEach(() => {
    generator = new DivisionGenerator();
  });

  describe('Level 1 (Beginner - Multiplication Table)', () => {
    const level: Level = 1;

    it('should generate valid division problems from multiplication table', () => {
      for (let i = 0; i < 50; i++) {
        const problem = generator.next(level);
        const [dividend, divisor] = problem.operands;
        
        // Dividend should be 0-81
        expect(dividend).toBeGreaterThanOrEqual(0);
        expect(dividend).toBeLessThanOrEqual(81);
        
        // Divisor should be 1-9 (no division by zero)
        expect(divisor).toBeGreaterThanOrEqual(1);
        expect(divisor).toBeLessThanOrEqual(9);
        
        // Result should be 0-9 and integer
        expect(problem.answer).toBeGreaterThanOrEqual(0);
        expect(problem.answer).toBeLessThanOrEqual(9);
        expect(Number.isInteger(problem.answer)).toBe(true);
        
        // Verify answer is correct
        expect(problem.answer).toBe(dividend / divisor);
        
        // Check prompt format
        expect(problem.prompt).toMatch(/^\d+ ÷ \d+ = \?$/);
        expect(problem.mode).toBe('division');
        expect(problem.level).toBe(1);
      }
    });

    it('should never divide by zero', () => {
      for (let i = 0; i < 100; i++) {
        const problem = generator.next(level);

        expect(problem.operands[1]).not.toBe(0);
      }
    });

    it('should enforce session constraints in 10-problem session', () => {
      generator.reset();
      const problems = [];
      
      for (let i = 0; i < 10; i++) {
        problems.push(generator.next(level));
      }

      // Check for unique pairs
      const pairs = new Set();

      problems.forEach(p => {
        const key = `${p.operands[0]}/${p.operands[1]}`;

        expect(pairs.has(key)).toBe(false); // No duplicates
        pairs.add(key);
      });

      expect(pairs.size).toBe(10); // All unique
    });

    it('should provide valid hints for level 1', () => {
      const problem = generator.next(level);

      expect(problem.level).toBe(1);
      expect(problem.operands.length).toBe(2);
      expect(problem.operands[1]).toBeGreaterThan(0);
    });
  });

  describe('Level 2 (Intermediate - Dividing Tens)', () => {
    const level: Level = 2;

    it('should generate division of tens', () => {
      for (let i = 0; i < 50; i++) {
        const problem = generator.next(level);
        const [dividend, divisor] = problem.operands;
        
        // Divisor should be multiple of 10 (10, 20, 30... 90)
        expect(divisor % 10).toBe(0);
        expect(divisor).toBeGreaterThanOrEqual(10);
        expect(divisor).toBeLessThanOrEqual(90);
        
        // Result should be integer
        expect(Number.isInteger(problem.answer)).toBe(true);
        
        // Verify answer is correct
        expect(problem.answer).toBe(dividend / divisor);
        
        expect(problem.prompt).toMatch(/^\d+ ÷ \d+ = \?$/);
        expect(problem.mode).toBe('division');
        expect(problem.level).toBe(2);
      }
    });

    it('should never divide by zero', () => {
      for (let i = 0; i < 100; i++) {
        const problem = generator.next(level);

        expect(problem.operands[1]).not.toBe(0);
      }
    });

    it('should enforce session constraints in 10-problem session', () => {
      generator.reset();
      const problems = [];
      
      for (let i = 0; i < 10; i++) {
        problems.push(generator.next(level));
      }

      // Check for unique pairs
      const pairs = new Set();

      problems.forEach(p => {
        const key = `${p.operands[0]}/${p.operands[1]}`;

        expect(pairs.has(key)).toBe(false); // No duplicates
        pairs.add(key);
      });

      expect(pairs.size).toBe(10); // All unique
    });

    it('should not provide hints for level 2', () => {
      const problem = generator.next(level);

      expect(problem.level).toBe(2);
    });
  });

  describe('Level 3 (Advanced - Three-digit ÷ One-digit)', () => {
    const level: Level = 3;

    it('should generate three-digit dividend and single-digit divisor', () => {
      for (let i = 0; i < 50; i++) {
        const problem = generator.next(level);
        const [dividend, divisor] = problem.operands;
        
        // Dividend should be 100-999
        expect(dividend).toBeGreaterThanOrEqual(100);
        expect(dividend).toBeLessThanOrEqual(999);
        
        // Divisor should be 2-9
        expect(divisor).toBeGreaterThanOrEqual(2);
        expect(divisor).toBeLessThanOrEqual(9);
        
        // Result should be integer
        expect(Number.isInteger(problem.answer)).toBe(true);
        
        // Verify answer is correct
        expect(problem.answer).toBe(dividend / divisor);
        
        expect(problem.prompt).toMatch(/^\d+ ÷ \d+ = \?$/);
        expect(problem.mode).toBe('division');
        expect(problem.level).toBe(3);
      }
    });

    it('should never divide by zero or one', () => {
      for (let i = 0; i < 100; i++) {
        const problem = generator.next(level);

        expect(problem.operands[1]).toBeGreaterThanOrEqual(2);
      }
    });

    it('should enforce session constraints in 10-problem session', () => {
      generator.reset();
      const problems = [];
      
      for (let i = 0; i < 10; i++) {
        problems.push(generator.next(level));
      }

      // Check for unique pairs
      const pairs = new Set();

      problems.forEach(p => {
        const key = `${p.operands[0]}/${p.operands[1]}`;

        expect(pairs.has(key)).toBe(false); // No duplicates
        pairs.add(key);
      });

      expect(pairs.size).toBe(10); // All unique
    });

    it('should not provide hints for level 3', () => {
      const problem = generator.next(level);

      expect(problem.level).toBe(3);
    });
  });

  describe('Generator state management', () => {
    it('should reset state properly', () => {
      const level: Level = 1;
      
      // Generate some problems to populate state
      for (let i = 0; i < 5; i++) {
        generator.next(level);
      }
      
      // Reset and verify we can generate problems again
      generator.reset();
      
      const problem = generator.next(level);

      expect(problem).toBeDefined();
      expect(problem.mode).toBe('division');
      expect(problem.level).toBe(level);
    });

    it('should generate unique problem IDs', () => {
      const level: Level = 1;
      const ids = new Set();
      
      for (let i = 0; i < 20; i++) {
        const problem = generator.next(level);

        expect(ids.has(problem.id)).toBe(false);
        ids.add(problem.id);
      }
    });

    it('should include proper metadata', () => {
      const level: Level = 1;
      const problem = generator.next(level);
      
      expect(problem.meta).toBeDefined();
      expect(problem.meta?.generatedAt).toBeDefined();
      expect(typeof problem.meta?.generatedAt).toBe('number');
    });
  });

  describe('Integration scenarios', () => {
    it('should handle multiple sessions correctly', () => {
      // Session 1
      generator.reset();
      const session1Problems = [];

      for (let i = 0; i < 10; i++) {
        session1Problems.push(generator.next(1));
      }
      
      // Session 2
      generator.reset();
      const session2Problems = [];

      for (let i = 0; i < 10; i++) {
        session2Problems.push(generator.next(1));
      }
      
      // Both sessions should have valid problems
      expect(session1Problems.length).toBe(10);
      expect(session2Problems.length).toBe(10);
      
      // Each session should have unique pairs within itself
      [session1Problems, session2Problems].forEach(problems => {
        const pairs = new Set();

        problems.forEach(p => {
          const key = `${p.operands[0]}/${p.operands[1]}`;

          pairs.add(key);
        });

        expect(pairs.size).toBe(10);
      });
    });

    it('should work with different levels in sequence', () => {
      generator.reset();
      
      const level1Problem = generator.next(1);
      const level2Problem = generator.next(2);
      const level3Problem = generator.next(3);
      
      expect(level1Problem.level).toBe(1);
      expect(level2Problem.level).toBe(2);
      expect(level3Problem.level).toBe(3);
      
      // Verify level-specific constraints
      // Level 1: dividend 0-81, divisor 1-9
      expect(level1Problem.operands[0]).toBeLessThanOrEqual(81);
      expect(level1Problem.operands[1]).toBeGreaterThanOrEqual(1);
      expect(level1Problem.operands[1]).toBeLessThanOrEqual(9);
      
      // Level 2: divisor is multiple of 10
      expect(level2Problem.operands[1] % 10).toBe(0);
      expect(level2Problem.operands[1]).toBeGreaterThanOrEqual(10);
      
      // Level 3: dividend 100-999, divisor 2-9
      expect(level3Problem.operands[0]).toBeGreaterThanOrEqual(100);
      expect(level3Problem.operands[0]).toBeLessThanOrEqual(999);
      expect(level3Problem.operands[1]).toBeGreaterThanOrEqual(2);
      expect(level3Problem.operands[1]).toBeLessThanOrEqual(9);
    });
  });
});
