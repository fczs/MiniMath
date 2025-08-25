import { SubtractionGenerator } from '../subtraction';
import { Level } from '../../types';

describe('SubtractionGenerator', () => {
  let generator: SubtractionGenerator;

  beforeEach(() => {
    generator = new SubtractionGenerator();
  });

  describe('Level 1 - Single digits', () => {
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

    it('ensures a ≥ b (no negative results)', () => {
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

    it('generates correct prompt format', () => {
      const problem = generator.next(1);
      const [a, b] = problem.operands;
      
      expect(problem.prompt).toBe(`${a} - ${b} = ?`);
    });
  });

  describe('Level 2 - Two digits', () => {
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

    it('ensures no negative results', () => {
      for (let i = 0; i < 20; i++) {
        const problem = generator.next(2);
        
        expect(problem.answer).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('Level 3 - Three digits', () => {
    it('generates problems with three digits (100-999)', () => {
      for (let i = 0; i < 10; i++) {
        const problem = generator.next(3);
        
        expect(problem.operands).toHaveLength(2);
        expect(problem.operands[0]).toBeGreaterThanOrEqual(100);
        expect(problem.operands[0]).toBeLessThanOrEqual(999);
        expect(problem.operands[1]).toBeGreaterThanOrEqual(100);
        expect(problem.operands[1]).toBeLessThanOrEqual(999);
      }
    });

    it('ensures no negative results', () => {
      for (let i = 0; i < 20; i++) {
        const problem = generator.next(3);
        
        expect(problem.answer).toBeGreaterThanOrEqual(0);
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
