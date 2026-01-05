import { MixedGenerator } from '../mixed';
import { Level, Mode } from '../../types';

describe('MixedGenerator', () => {
  let generator: MixedGenerator;

  beforeEach(() => {
    generator = new MixedGenerator();
  });

  describe('Problem generation', () => {
    it('should generate problems from different modes', () => {
      const modes = new Set<Mode>();
      
      // Generate many problems to get variety
      for (let i = 0; i < 100; i++) {
        generator.reset();
        const problem = generator.next(1);

        modes.add(problem.mode);
      }
      
      // Should have problems from multiple modes
      expect(modes.size).toBeGreaterThan(1);
      
      // All modes should be from the 4 basic operations
      const validModes: Mode[] = ['addition', 'subtraction', 'multiplication', 'division'];

      modes.forEach(mode => {
        expect(validModes).toContain(mode);
      });
    });

    it('should generate all 4 operation types over many attempts', () => {
      const modes = new Set<Mode>();
      
      // Generate many problems
      for (let i = 0; i < 200; i++) {
        generator.reset();
        const problem = generator.next(1);

        modes.add(problem.mode);
      }
      
      // Should eventually get all 4 modes
      expect(modes.has('addition')).toBe(true);
      expect(modes.has('subtraction')).toBe(true);
      expect(modes.has('multiplication')).toBe(true);
      expect(modes.has('division')).toBe(true);
    });
  });

  describe('Level handling', () => {
    const levels: Level[] = [1, 2, 3];

    levels.forEach(level => {
      it(`should generate valid problems for level ${level}`, () => {
        for (let i = 0; i < 20; i++) {
          const problem = generator.next(level);
          
          expect(problem.level).toBe(level);
          expect(problem.prompt).toBeDefined();
          expect(problem.answer).toBeDefined();
          expect(problem.operands.length).toBe(2);
          expect(Number.isInteger(problem.answer)).toBe(true);
        }
      });
    });
  });

  describe('Problem validity', () => {
    it('should generate valid addition problems', () => {
      // Keep generating until we get an addition problem
      let problem;

      for (let i = 0; i < 100; i++) {
        generator.reset();
        problem = generator.next(1);

        if (problem.mode === 'addition') break;
      }
      
      if (problem && problem.mode === 'addition') {
        expect(problem.answer).toBe(problem.operands[0] + problem.operands[1]);
        expect(problem.prompt).toContain('+');
      }
    });

    it('should generate valid subtraction problems', () => {
      let problem;

      for (let i = 0; i < 100; i++) {
        generator.reset();
        problem = generator.next(1);

        if (problem.mode === 'subtraction') break;
      }
      
      if (problem && problem.mode === 'subtraction') {
        expect(problem.answer).toBe(problem.operands[0] - problem.operands[1]);
        expect(problem.prompt).toContain('−');
      }
    });

    it('should generate valid multiplication problems', () => {
      let problem;

      for (let i = 0; i < 100; i++) {
        generator.reset();
        problem = generator.next(1);

        if (problem.mode === 'multiplication') break;
      }
      
      if (problem && problem.mode === 'multiplication') {
        expect(problem.answer).toBe(problem.operands[0] * problem.operands[1]);
        expect(problem.prompt).toContain('×');
      }
    });

    it('should generate valid division problems', () => {
      let problem;

      for (let i = 0; i < 100; i++) {
        generator.reset();
        problem = generator.next(1);

        if (problem.mode === 'division') break;
      }
      
      if (problem && problem.mode === 'division') {
        expect(problem.answer).toBe(problem.operands[0] / problem.operands[1]);
        expect(problem.prompt).toContain('÷');
        expect(problem.operands[1]).not.toBe(0); // No division by zero
      }
    });
  });

  describe('Generator state management', () => {
    it('should reset all sub-generators', () => {
      const level: Level = 1;
      
      // Generate some problems
      for (let i = 0; i < 5; i++) {
        generator.next(level);
      }
      
      // Reset should not throw
      expect(() => generator.reset()).not.toThrow();
      
      // Should be able to generate after reset
      const problem = generator.next(level);

      expect(problem).toBeDefined();
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

  describe('No hints in mixed mode', () => {
    it('should generate problems without hint dependency', () => {
      // Mixed mode should work without hints
      // Just verify problems are generated correctly
      const problem = generator.next(1);

      expect(problem).toBeDefined();
      expect(problem.level).toBe(1);
    });
  });
});
