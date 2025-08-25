import React from 'react';
import { Mode, Problem, Generator } from '../types';
import { AdditionGenerator, SubtractionGenerator } from '../generators';

// Lazy import hint components to avoid circular dependencies
const SubtractionHint = React.lazy(() => import('../../components/game/SubtractionHint'));

export type ModeConfig = {
  id: Mode;
  displayName: string;
  emoji: string;
  generator: Generator;
  hints?: { 
    eligible: (p: Problem) => boolean; 
    component?: React.ComponentType<{ problem: Problem }> 
  };
  visuals?: { 
    component?: React.ComponentType<{ problem: Problem }> 
  };
  rules?: { 
    allowNegatives?: boolean; 
    integerOnly?: boolean 
  };
};

// Default hint eligibility for addition (Level 1, attempt > 1)
const additionHintEligible = (problem: Problem): boolean => {
  return problem.level === 1; // Hint availability is controlled by attempt count in the game engine
};

export const MODE_REGISTRY: Record<Mode, ModeConfig> = {
  addition: {
    id: 'addition',
    displayName: 'Addition',
    emoji: '➕',
    generator: new AdditionGenerator(),
    hints: {
      eligible: additionHintEligible,
      // component will be imported lazily to avoid circular dependencies
    },
    rules: {
      allowNegatives: false,
      integerOnly: true,
    },
  },
  subtraction: {
    id: 'subtraction',
    displayName: 'Subtraction',
    emoji: '➖',
    generator: new SubtractionGenerator(),
    hints: {
      eligible: (problem: Problem) => problem.level === 1, // Only for Beginner level
      component: SubtractionHint,
    },
    rules: {
      allowNegatives: false, // Levels 1 & 2 are non-negative, Level 3 is handled by generator
      integerOnly: true,
    },
  },
  // Placeholders for future modes
  multiplication: {
    id: 'multiplication',
    displayName: 'Multiplication',
    emoji: '✖️',
    generator: new AdditionGenerator(), // Temporary placeholder
    rules: {
      allowNegatives: false,
      integerOnly: true,
    },
  },
  division: {
    id: 'division',
    displayName: 'Division',
    emoji: '➗',
    generator: new AdditionGenerator(), // Temporary placeholder
    rules: {
      allowNegatives: false,
      integerOnly: true,
    },
  },
  mixed: {
    id: 'mixed',
    displayName: 'Mixed',
    emoji: '🎲',
    generator: new AdditionGenerator(), // Temporary placeholder
    rules: {
      allowNegatives: false,
      integerOnly: true,
    },
  },
  equation: {
    id: 'equation',
    displayName: 'Equations',
    emoji: '⚖️',
    generator: new AdditionGenerator(), // Temporary placeholder
    rules: {
      allowNegatives: false,
      integerOnly: true,
    },
  },
};

/**
 * Get mode configuration by mode ID
 */
export const getModeConfig = (mode: Mode): ModeConfig => {
  const config = MODE_REGISTRY[mode];

  if (!config) {
    throw new Error(`Mode configuration not found for: ${mode}`);
  }

  return config;
};

/**
 * Get all available modes
 */
export const getAvailableModes = (): ModeConfig[] => {
  return Object.values(MODE_REGISTRY);
};

/**
 * Get implemented modes (modes that have real generators, not placeholders)
 */
export const getImplementedModes = (): ModeConfig[] => {
  return [MODE_REGISTRY.addition, MODE_REGISTRY.subtraction];
};
