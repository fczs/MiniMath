import { getModeConfig, getAvailableModes, getImplementedModes, MODE_REGISTRY } from '../registry';
import { Mode } from '../../types';

describe('Mode Registry', () => {
  describe('getModeConfig', () => {
    it('returns config for addition', () => {
      const config = getModeConfig('addition');
      
      expect(config.id).toBe('addition');
      expect(config.displayName).toBe('Addition');
      expect(config.emoji).toBe('➕');
      expect(config.generator).toBeDefined();
    });

    it('returns config for subtraction', () => {
      const config = getModeConfig('subtraction');
      
      expect(config.id).toBe('subtraction');
      expect(config.displayName).toBe('Subtraction');
      expect(config.emoji).toBe('➖');
      expect(config.generator).toBeDefined();
    });

    it('returns config for multiplication', () => {
      const config = getModeConfig('multiplication');
      
      expect(config.id).toBe('multiplication');
      expect(config.displayName).toBe('Multiplication');
      expect(config.emoji).toBe('✖️');
      expect(config.generator).toBeDefined();
    });

    it('returns config for division', () => {
      const config = getModeConfig('division');
      
      expect(config.id).toBe('division');
      expect(config.displayName).toBe('Division');
      expect(config.emoji).toBe('➗');
      expect(config.generator).toBeDefined();
    });

    it('returns config for mixed', () => {
      const config = getModeConfig('mixed');
      
      expect(config.id).toBe('mixed');
      expect(config.displayName).toBe('Mixed');
      expect(config.emoji).toBe('🎲');
      expect(config.generator).toBeDefined();
      expect(config.hints).toBeUndefined(); // No hints in mixed mode
    });

    it('throws error for invalid mode', () => {
      expect(() => getModeConfig('invalid' as Mode)).toThrow('Mode configuration not found');
    });
  });

  describe('getAvailableModes', () => {
    it('returns all modes', () => {
      const modes = getAvailableModes();
      
      expect(modes).toHaveLength(6);
      expect(modes.map(m => m.id)).toEqual(
        expect.arrayContaining(['addition', 'subtraction', 'multiplication', 'division', 'mixed', 'equation'])
      );
    });
  });

  describe('getImplementedModes', () => {
    it('returns only implemented modes', () => {
      const modes = getImplementedModes();
      
      expect(modes).toHaveLength(6);
      expect(modes.map(m => m.id)).toEqual(['addition', 'subtraction', 'multiplication', 'division', 'mixed', 'equation']);
    });
  });

  describe('MODE_REGISTRY', () => {
    it('has all expected modes', () => {
      const expectedModes: Mode[] = ['addition', 'subtraction', 'multiplication', 'division', 'mixed', 'equation'];
      
      expectedModes.forEach(mode => {
        expect(MODE_REGISTRY[mode]).toBeDefined();
        expect(MODE_REGISTRY[mode].id).toBe(mode);
        expect(MODE_REGISTRY[mode].displayName).toBeDefined();
        expect(MODE_REGISTRY[mode].emoji).toBeDefined();
        expect(MODE_REGISTRY[mode].generator).toBeDefined();
      });
    });

    it('has hints configuration for addition', () => {
      const additionConfig = MODE_REGISTRY.addition;
      
      expect(additionConfig.hints).toBeDefined();
      expect(additionConfig.hints?.eligible).toBeDefined();
      
      // Test hint eligibility function
      const level1Problem = {
        id: 'test',
        mode: 'addition' as const,
        level: 1 as const,
        prompt: '2 + 3 = ?',
        operands: [2, 3],
        answer: 5,
      };
      
      const level2Problem = { ...level1Problem, level: 2 as const };
      
      expect(additionConfig.hints?.eligible(level1Problem)).toBe(true);
      expect(additionConfig.hints?.eligible(level2Problem)).toBe(false);
    });

    it('has rules configuration', () => {
      Object.values(MODE_REGISTRY).forEach(config => {
        expect(config.rules).toBeDefined();
        expect(typeof config.rules?.allowNegatives).toBe('boolean');
        expect(typeof config.rules?.integerOnly).toBe('boolean');
      });
    });
  });
});
