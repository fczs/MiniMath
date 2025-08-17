import { AdditionGenerator } from '../addition';
import { Level } from '../../types';

describe('AdditionGenerator', () => {
  let generator: AdditionGenerator;

  beforeEach(() => {
    generator = new AdditionGenerator();
  });

  describe('Level 1 (single-digit)', () => {
    it('should generate correct answers for 100 random cases', () => {
      for (let i = 0; i < 100; i++) {
        const problem = generator.next(1);
        const [a, b] = problem.operands;
        const expectedAnswer = a + b;
        
        expect(problem.answer).toBe(expectedAnswer);
        expect(problem.mode).toBe('addition');
        expect(problem.level).toBe(1);
        expect(problem.prompt).toBe(`${a} + ${b} = ?`);
      }
    });

    it('should respect operand ranges for level 1', () => {
      for (let i = 0; i < 50; i++) {
        const problem = generator.next(1);
        const [a, b] = problem.operands;
        
        // Both operands should be 0-9
        expect(a).toBeGreaterThanOrEqual(0);
        expect(a).toBeLessThanOrEqual(9);
        expect(b).toBeGreaterThanOrEqual(0);
        expect(b).toBeLessThanOrEqual(9);
        
        // Result should be ≤ 18
        expect(problem.answer).toBeLessThanOrEqual(18);
      }
    });
  });

  describe('Level 2 (two-digit)', () => {
    it('should generate correct answers for 100 random cases', () => {
      for (let i = 0; i < 100; i++) {
        const problem = generator.next(2);
        const [a, b] = problem.operands;
        const expectedAnswer = a + b;
        
        expect(problem.answer).toBe(expectedAnswer);
        expect(problem.mode).toBe('addition');
        expect(problem.level).toBe(2);
        expect(problem.prompt).toBe(`${a} + ${b} = ?`);
      }
    });

    it('should respect operand ranges for level 2', () => {
      for (let i = 0; i < 50; i++) {
        const problem = generator.next(2);
        const [a, b] = problem.operands;
        
        // Both operands should be 10-99
        expect(a).toBeGreaterThanOrEqual(10);
        expect(a).toBeLessThanOrEqual(99);
        expect(b).toBeGreaterThanOrEqual(10);
        expect(b).toBeLessThanOrEqual(99);
      }
    });
  });

  describe('Level 3 (three-digit)', () => {
    it('should generate correct answers for 100 random cases', () => {
      for (let i = 0; i < 100; i++) {
        const problem = generator.next(3);
        const [a, b] = problem.operands;
        const expectedAnswer = a + b;
        
        expect(problem.answer).toBe(expectedAnswer);
        expect(problem.mode).toBe('addition');
        expect(problem.level).toBe(3);
        expect(problem.prompt).toBe(`${a} + ${b} = ?`);
      }
    });

    it('should respect operand ranges for level 3', () => {
      for (let i = 0; i < 50; i++) {
        const problem = generator.next(3);
        const [a, b] = problem.operands;
        
        // Both operands should be 100-999
        expect(a).toBeGreaterThanOrEqual(100);
        expect(a).toBeLessThanOrEqual(999);
        expect(b).toBeGreaterThanOrEqual(100);
        expect(b).toBeLessThanOrEqual(999);
      }
    });
  });

  describe('Game logic constraints', () => {
    it('should never generate 0 + 0', () => {
      const problems = [];
      
      // Generate many problems to test the restriction
      for (let i = 0; i < 100; i++) {
        const problem = generator.next(1);

        problems.push(problem);
      }

      const zeroZeroProblems = problems.filter(p => 
        p.operands[0] === 0 && p.operands[1] === 0
      );

      expect(zeroZeroProblems.length).toBe(0);
    });

    it('should have at most one example with zero per session', () => {
      const problems = [];
      
      // Generate many problems to test the restriction
      for (let i = 0; i < 50; i++) {
        const problem = generator.next(1);

        problems.push(problem);
      }

      const zeroProblems = problems.filter(p => 
        p.operands[0] === 0 || p.operands[1] === 0
      );

      expect(zeroProblems.length).toBeLessThanOrEqual(1);
    });

    it('should not repeat problems in a session', () => {
      const problems = [];
      const problemKeys = new Set<string>();
      
      // Generate multiple problems
      for (let i = 0; i < 20; i++) {
        const problem = generator.next(1);

        problems.push(problem);
        
        // Create key for uniqueness check (handle commutativity)
        const sorted = [...problem.operands].sort((a, b) => a - b);
        const key = sorted.join('+');
        
        expect(problemKeys.has(key)).toBe(false);
        problemKeys.add(key);
      }
    });
  });

  describe('Reset functionality', () => {
    it('should reset state properly', () => {
      // Generate a problem with zero
      let problem;
      let attempts = 0;

      do {
        problem = generator.next(1);
        attempts++;
      } while ((problem.operands[0] !== 0 && problem.operands[1] !== 0) && attempts < 100);
      
      // Now zero examples should be blocked
      // Reset and try again
      generator.reset();
      
      // Should be able to generate zero examples again after reset
      let foundZero = false;

      for (let i = 0; i < 50; i++) {
        const newProblem = generator.next(1);

        if (newProblem.operands[0] === 0 || newProblem.operands[1] === 0) {
          foundZero = true;
          break;
        }
      }
      
      expect(foundZero).toBe(true);
    });
  });

  describe('Problem structure', () => {
    it('should generate problems with required fields', () => {
      const problem = generator.next(1);
      
      expect(typeof problem.id).toBe('string');
      expect(problem.id).toMatch(/^add_/);
      expect(problem.mode).toBe('addition');
      expect(problem.level).toBe(1);
      expect(typeof problem.prompt).toBe('string');
      expect(Array.isArray(problem.operands)).toBe(true);
      expect(problem.operands).toHaveLength(2);
      expect(typeof problem.answer).toBe('number');
      expect(problem.meta).toBeDefined();
      expect(typeof problem.meta?.generatedAt).toBe('number');
    });
  });

  describe('Edge cases', () => {
    it('should handle invalid level gracefully', () => {
      expect(() => generator.next(4 as Level)).toThrow('Invalid level: 4');
    });
  });
});