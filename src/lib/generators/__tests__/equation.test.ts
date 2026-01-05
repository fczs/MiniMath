import { EquationGenerator } from '../equation';
import { Level } from '../../types';

describe('EquationGenerator', () => {
  let generator: EquationGenerator;

  beforeEach(() => {
    generator = new EquationGenerator();
  });

  describe('Level 1 - Addition and Subtraction equations', () => {
    const level: Level = 1;

    it('should generate x + b = c or a - x = c equations', () => {
      for (let i = 0; i < 20; i++) {
        const problem = generator.next(level);

        expect(problem.mode).toBe('equation');
        expect(problem.level).toBe(level);
        expect(problem.answer).toBeGreaterThanOrEqual(0);
        expect(problem.answer).toBeLessThanOrEqual(99);
        
        // Verify prompt format
        const isAddition = problem.prompt.includes('x +');
        const isSubtraction = problem.prompt.includes('− x');

        expect(isAddition || isSubtraction).toBe(true);

        // Verify the equation is correct
        if (isAddition) {
          // x + b = c, answer is x
          const match = problem.prompt.match(/x \+ (\d+) = (\d+)/);

          expect(match).not.toBeNull();

          const b = parseInt(match![1]);
          const c = parseInt(match![2]);

          expect(problem.answer + b).toBe(c);
          expect(c).toBeLessThanOrEqual(99);
        } else {
          // a - x = c, answer is x
          const match = problem.prompt.match(/(\d+) − x = (\d+)/);

          expect(match).not.toBeNull();

          const a = parseInt(match![1]);
          const c = parseInt(match![2]);

          expect(a - problem.answer).toBe(c);
          expect(a).toBeLessThanOrEqual(99);
        }
      }
    });

    it('should generate both addition and subtraction equations', () => {
      let hasAddition = false;
      let hasSubtraction = false;
      
      for (let i = 0; i < 50; i++) {
        const problem = generator.next(level);

        if (problem.prompt.includes('x +')) hasAddition = true;
        if (problem.prompt.includes('− x')) hasSubtraction = true;

        if (hasAddition && hasSubtraction) break;
      }

      expect(hasAddition).toBe(true);
      expect(hasSubtraction).toBe(true);
    });

    it('should not generate duplicate problems in a session', () => {
      generator.reset();
      const usedPrompts = new Set<string>();

      for (let i = 0; i < 10; i++) {
        const problem = generator.next(level);

        expect(usedPrompts.has(problem.prompt)).toBe(false);
        usedPrompts.add(problem.prompt);
      }
    });
  });

  describe('Level 2 - Multiplication and Division equations', () => {
    const level: Level = 2;

    it('should generate x × b = c or a ÷ x = c equations', () => {
      for (let i = 0; i < 20; i++) {
        const problem = generator.next(level);

        expect(problem.mode).toBe('equation');
        expect(problem.level).toBe(level);
        expect(problem.answer).toBeGreaterThanOrEqual(1);
        expect(problem.answer).toBeLessThanOrEqual(99);
        
        // Verify prompt format
        const isMultiplication = problem.prompt.includes('x ×');
        const isDivision = problem.prompt.includes('÷ x');

        expect(isMultiplication || isDivision).toBe(true);

        // Verify the equation is correct
        if (isMultiplication) {
          // x × b = c, answer is x
          const match = problem.prompt.match(/x × (\d+) = (\d+)/);

          expect(match).not.toBeNull();

          const b = parseInt(match![1]);
          const c = parseInt(match![2]);

          expect(problem.answer * b).toBe(c);
          expect(c).toBeLessThanOrEqual(99);
          expect(b).toBeGreaterThan(1); // No trivial × 1
        } else {
          // a ÷ x = c, answer is x
          const match = problem.prompt.match(/(\d+) ÷ x = (\d+)/);

          expect(match).not.toBeNull();

          const a = parseInt(match![1]);
          const c = parseInt(match![2]);

          expect(a / problem.answer).toBe(c);
          expect(a).toBeLessThanOrEqual(99);
        }
      }
    });

    it('should generate both multiplication and division equations', () => {
      let hasMultiplication = false;
      let hasDivision = false;
      
      for (let i = 0; i < 50; i++) {
        const problem = generator.next(level);

        if (problem.prompt.includes('x ×')) hasMultiplication = true;
        if (problem.prompt.includes('÷ x')) hasDivision = true;

        if (hasMultiplication && hasDivision) break;
      }

      expect(hasMultiplication).toBe(true);
      expect(hasDivision).toBe(true);
    });

    it('should only generate integer results', () => {
      for (let i = 0; i < 30; i++) {
        const problem = generator.next(level);

        expect(Number.isInteger(problem.answer)).toBe(true);
      }
    });
  });

  describe('Level 3 - Bracket equations', () => {
    const level: Level = 3;

    it('should generate a × (x + b) = c or a × (x - b) = c equations', () => {
      for (let i = 0; i < 20; i++) {
        const problem = generator.next(level);

        expect(problem.mode).toBe('equation');
        expect(problem.level).toBe(level);
        expect(problem.answer).toBeGreaterThanOrEqual(0);
        expect(problem.answer).toBeLessThanOrEqual(99);
        
        // Verify prompt format
        const isAddition = problem.prompt.includes('(x +');
        const isSubtraction = problem.prompt.includes('(x −');

        expect(isAddition || isSubtraction).toBe(true);

        // Verify the equation is correct
        if (isAddition) {
          // a × (x + b) = c, answer is x
          const match = problem.prompt.match(/(\d+) × \(x \+ (\d+)\) = (\d+)/);

          expect(match).not.toBeNull();

          const a = parseInt(match![1]);
          const b = parseInt(match![2]);
          const c = parseInt(match![3]);

          expect(a * (problem.answer + b)).toBe(c);
          expect(c).toBeLessThanOrEqual(99);
        } else {
          // a × (x - b) = c, answer is x
          const match = problem.prompt.match(/(\d+) × \(x − (\d+)\) = (\d+)/);

          expect(match).not.toBeNull();

          const a = parseInt(match![1]);
          const b = parseInt(match![2]);
          const c = parseInt(match![3]);

          expect(a * (problem.answer - b)).toBe(c);
          expect(c).toBeLessThanOrEqual(99);
        }
      }
    });

    it('should generate both addition and subtraction bracket equations', () => {
      let hasAddition = false;
      let hasSubtraction = false;
      
      for (let i = 0; i < 50; i++) {
        const problem = generator.next(level);

        if (problem.prompt.includes('(x +')) hasAddition = true;
        if (problem.prompt.includes('(x −')) hasSubtraction = true;

        if (hasAddition && hasSubtraction) break;
      }

      expect(hasAddition).toBe(true);
      expect(hasSubtraction).toBe(true);
    });

    it('should not generate negative answers', () => {
      for (let i = 0; i < 30; i++) {
        const problem = generator.next(level);

        expect(problem.answer).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('Generator state management', () => {
    it('should reset state properly', () => {
      const level: Level = 1;
      
      // Generate some problems
      for (let i = 0; i < 5; i++) {
        generator.next(level);
      }

      // Reset
      generator.reset();

      // Should be able to generate more problems without issues
      const problem = generator.next(level);

      expect(problem).toBeDefined();
      expect(problem.mode).toBe('equation');
    });

    it('should work with different levels in sequence', () => {
      // Level 1
      const l1Problem = generator.next(1);

      expect(l1Problem.level).toBe(1);
      expect(l1Problem.prompt).toMatch(/x \+|− x/);

      // Level 2
      const l2Problem = generator.next(2);

      expect(l2Problem.level).toBe(2);
      expect(l2Problem.prompt).toMatch(/x ×|÷ x/);

      // Level 3
      const l3Problem = generator.next(3);

      expect(l3Problem.level).toBe(3);
      expect(l3Problem.prompt).toMatch(/\(x \+|\(x −/);
    });
  });

  describe('Edge cases', () => {
    it('should handle running out of problems gracefully with fallback', () => {
      const level: Level = 1;
      
      // Generate many problems - should use fallback if needed
      for (let i = 0; i < 100; i++) {
        const problem = generator.next(level);

        expect(problem).toBeDefined();
        expect(problem.mode).toBe('equation');
      }
    });

    it('should always produce valid integer answers for all levels', () => {
      for (const level of [1, 2, 3] as Level[]) {
        generator.reset();
        
        for (let i = 0; i < 20; i++) {
          const problem = generator.next(level);

          expect(Number.isInteger(problem.answer)).toBe(true);
        }
      }
    });
  });
});
