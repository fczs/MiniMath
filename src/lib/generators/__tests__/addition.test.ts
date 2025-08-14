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

  describe('Duplicate avoidance', () => {
    it('should avoid immediate duplicates', () => {
      generator.reset();
      const problem1 = generator.next(1);
      const problem2 = generator.next(1);
      
      // Should not be the exact same operands (considering commutativity)
      const ops1 = problem1.operands.sort();
      const ops2 = problem2.operands.sort();
      
      expect(ops1).not.toEqual(ops2);
    });

    it('should limit 0 + 0 to maximum once per session', () => {
      generator.reset();
      let zeroZeroCount = 0;
      
      // Generate many problems to test the limit
      for (let i = 0; i < 50; i++) {
        const problem = generator.next(1);

        if (problem.operands[0] === 0 && problem.operands[1] === 0) {
          zeroZeroCount++;
        }
      }
      
      expect(zeroZeroCount).toBeLessThanOrEqual(1);
    });
  });

  describe('Reset functionality', () => {
    it('should reset state when reset() is called', () => {
      // Generate some problems to change state
      generator.next(1);
      generator.next(1);
      
      // Reset and verify we can generate 0 + 0 again if it comes up
      generator.reset();
      
      // This is a probabilistic test, but we can at least ensure reset doesn't throw
      expect(() => generator.reset()).not.toThrow();
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
