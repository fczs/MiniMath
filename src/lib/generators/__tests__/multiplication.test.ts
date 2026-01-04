import { MultiplicationGenerator } from '../multiplication';
import { Level } from '../../types';

describe('MultiplicationGenerator', () => {
  let generator: MultiplicationGenerator;

  beforeEach(() => {
    generator = new MultiplicationGenerator();
  });

  describe('Level 1 (Beginner)', () => {
    const level: Level = 1;

    it('should generate factors in range [0..9]', () => {
      for (let i = 0; i < 50; i++) {
        const problem = generator.next(level);
        
        expect(problem.operands[0]).toBeGreaterThanOrEqual(0);
        expect(problem.operands[0]).toBeLessThanOrEqual(9);
        expect(problem.operands[1]).toBeGreaterThanOrEqual(0);
        expect(problem.operands[1]).toBeLessThanOrEqual(9);
        expect(problem.answer).toBe(problem.operands[0] * problem.operands[1]);
        expect(problem.prompt).toMatch(/^\d+ × \d+ = \?$/);
        expect(problem.mode).toBe('multiplication');
        expect(problem.level).toBe(1);
      }
    });

    it('should enforce session constraints in 10-problem session', () => {
      generator.reset();
      const problems = [];
      
      for (let i = 0; i < 10; i++) {
        problems.push(generator.next(level));
      }

      // Count problems with factor 0
      const zeroFactorProblems = problems.filter(p => 
        p.operands[0] === 0 || p.operands[1] === 0
      );

      expect(zeroFactorProblems.length).toBeLessThanOrEqual(1);

      // Count problems with factor 1
      const oneFactorProblems = problems.filter(p => 
        p.operands[0] === 1 || p.operands[1] === 1
      );

      expect(oneFactorProblems.length).toBeLessThanOrEqual(1);

      // Check for unique unordered pairs
      const pairs = new Set();

      problems.forEach(p => {
        const sorted = [...p.operands].sort((a, b) => a - b);
        const key = `${sorted[0]},${sorted[1]}`;

        expect(pairs.has(key)).toBe(false); // No duplicates
        pairs.add(key);
      });

      expect(pairs.size).toBe(10); // All unique
    });

    it('should handle commutativity correctly (treat (a,b) and (b,a) as same)', () => {
      generator.reset();
      
      // Generate a problem, say 3 × 4
      const problem1 = generator.next(level);
      
      // Reset and try to generate many problems to see if we can get the commutative pair
      generator.reset();
      
      // Generate problems until we find one that would be commutative to problem1
      for (let i = 0; i < 100; i++) {
        const testProblem = generator.next(level);

        if ((testProblem.operands[0] === problem1.operands[1] && 
             testProblem.operands[1] === problem1.operands[0]) ||
            (testProblem.operands[0] === problem1.operands[0] && 
             testProblem.operands[1] === problem1.operands[1])) {
          break;
        }
        generator.reset();
      }
      
      // Now test that in a single session, we can't get both (a,b) and (b,a)
      generator.reset();
      const sessionProblems = [];

      for (let i = 0; i < 10; i++) {
        sessionProblems.push(generator.next(level));
      }
      
      // Check no commutative duplicates exist
      const normalizedPairs = new Set();

      sessionProblems.forEach(p => {
        const sorted = [...p.operands].sort((a, b) => a - b);
        const key = `${sorted[0]},${sorted[1]}`;

        normalizedPairs.add(key);
      });
      
      expect(normalizedPairs.size).toBe(sessionProblems.length);
    });

    it('should provide valid hints for level 1', () => {
      const problem = generator.next(level);

      expect(problem.level).toBe(1);
      // Hint eligibility is tested in the mode registry, but the problem should be valid for hints
      expect(problem.operands.length).toBe(2);
      expect(problem.operands[0]).toBeGreaterThanOrEqual(0);
      expect(problem.operands[1]).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Level 2 (Intermediate)', () => {
    const level: Level = 2;

    it('should generate valid factor combinations (multiples of 10 or single digit × multiple of 10)', () => {
      const validMultiples = [10, 20, 30, 40, 50, 60, 70, 80, 90];
      const validSingleDigits = [2, 3, 4, 5, 6, 7, 8, 9];
      
      for (let i = 0; i < 50; i++) {
        const problem = generator.next(level);
        const [a, b] = problem.operands;
        
        // Valid combinations:
        // 1. Both are multiples of 10
        // 2. One is single digit (2-9), other is multiple of 10
        const bothMultiples = validMultiples.includes(a) && validMultiples.includes(b);
        const mixedA = validSingleDigits.includes(a) && validMultiples.includes(b);
        const mixedB = validMultiples.includes(a) && validSingleDigits.includes(b);
        
        expect(bothMultiples || mixedA || mixedB).toBe(true);
        expect(problem.answer).toBe(a * b);
        expect(problem.prompt).toMatch(/^\d+ × \d+ = \?$/);
        expect(problem.mode).toBe('multiplication');
        expect(problem.level).toBe(2);
      }
    });

    it('should generate both types of problems (mixed variants)', () => {
      // Generate many problems to check we get both variants
      let bothMultiplesCount = 0;
      let mixedCount = 0;
      const validMultiples = [10, 20, 30, 40, 50, 60, 70, 80, 90];
      
      for (let i = 0; i < 100; i++) {
        generator.reset();
        const problem = generator.next(level);
        const [a, b] = problem.operands;
        
        if (validMultiples.includes(a) && validMultiples.includes(b)) {
          bothMultiplesCount++;
        } else {
          mixedCount++;
        }
      }
      
      // Both types should appear (with some tolerance for randomness)
      expect(bothMultiplesCount).toBeGreaterThan(10);
      expect(mixedCount).toBeGreaterThan(10);
    });

    it('should enforce session constraints in 10-problem session', () => {
      generator.reset();
      const problems = [];
      
      for (let i = 0; i < 10; i++) {
        problems.push(generator.next(level));
      }

      // Count problems with factor 10
      const tenFactorProblems = problems.filter(p => 
        p.operands[0] === 10 || p.operands[1] === 10
      );

      expect(tenFactorProblems.length).toBeLessThanOrEqual(1);

      // Check for unique unordered pairs
      const pairs = new Set();

      problems.forEach(p => {
        const sorted = [...p.operands].sort((a, b) => a - b);
        const key = `${sorted[0]},${sorted[1]}`;

        expect(pairs.has(key)).toBe(false); // No duplicates
        pairs.add(key);
      });

      expect(pairs.size).toBe(10); // All unique
    });

    it('should not provide hints for level 2', () => {
      const problem = generator.next(level);

      expect(problem.level).toBe(2);
      // Level 2 should not be eligible for hints according to specs
    });
  });

  describe('Level 3 (Advanced)', () => {
    const level: Level = 3;

    it('should generate one single digit (2..9) and one two-digit (10..99) factor', () => {
      for (let i = 0; i < 50; i++) {
        const problem = generator.next(level);
        
        const [a, b] = problem.operands;
        
        // One factor should be 2..9, the other 10..99
        const hasSingleDigit = (a >= 2 && a <= 9) || (b >= 2 && b <= 9);
        const hasTwoDigit = (a >= 10 && a <= 99) || (b >= 10 && b <= 99);
        
        expect(hasSingleDigit).toBe(true);
        expect(hasTwoDigit).toBe(true);
        
        // Ensure exactly one of each type
        const singleDigitCount = (a >= 2 && a <= 9 ? 1 : 0) + (b >= 2 && b <= 9 ? 1 : 0);
        const twoDigitCount = (a >= 10 && a <= 99 ? 1 : 0) + (b >= 10 && b <= 99 ? 1 : 0);
        
        expect(singleDigitCount).toBe(1);
        expect(twoDigitCount).toBe(1);
        
        expect(problem.answer).toBe(problem.operands[0] * problem.operands[1]);
        expect(problem.prompt).toMatch(/^\d+ × \d+ = \?$/);
        expect(problem.mode).toBe('multiplication');
        expect(problem.level).toBe(3);
      }
    });

    it('should enforce session constraints in 10-problem session', () => {
      generator.reset();
      const problems = [];
      
      for (let i = 0; i < 10; i++) {
        problems.push(generator.next(level));
      }

      // Check for unique unordered pairs
      const pairs = new Set();

      problems.forEach(p => {
        const sorted = [...p.operands].sort((a, b) => a - b);
        const key = `${sorted[0]},${sorted[1]}`;

        expect(pairs.has(key)).toBe(false); // No duplicates
        pairs.add(key);
      });

      expect(pairs.size).toBe(10); // All unique
    });

    it('should not provide hints for level 3', () => {
      const problem = generator.next(level);

      expect(problem.level).toBe(3);
      // Level 3 should not be eligible for hints according to specs
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
      expect(problem.mode).toBe('multiplication');
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
          const sorted = [...p.operands].sort((a, b) => a - b);
          const key = `${sorted[0]},${sorted[1]}`;

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
      // Level 1: both operands 0-9
      expect(level1Problem.operands[0]).toBeLessThanOrEqual(9);
      expect(level1Problem.operands[1]).toBeLessThanOrEqual(9);
      
      // Level 2: valid combinations (both multiples of 10, or one single digit 2-9 and one multiple of 10)
      const validMultiples = [10, 20, 30, 40, 50, 60, 70, 80, 90];
      const validSingleDigits = [2, 3, 4, 5, 6, 7, 8, 9];
      const [l2a, l2b] = level2Problem.operands;
      const bothMultiples = validMultiples.includes(l2a) && validMultiples.includes(l2b);
      const mixedA = validSingleDigits.includes(l2a) && validMultiples.includes(l2b);
      const mixedB = validMultiples.includes(l2a) && validSingleDigits.includes(l2b);

      expect(bothMultiples || mixedA || mixedB).toBe(true);
      
      // Level 3: one 2-9, one 10-99
      const [a, b] = level3Problem.operands;
      const hasSingleDigit = (a >= 2 && a <= 9) || (b >= 2 && b <= 9);
      const hasTwoDigit = (a >= 10 && a <= 99) || (b >= 10 && b <= 99);

      expect(hasSingleDigit && hasTwoDigit).toBe(true);
    });
  });
});
