// Core types for MiniMath game system

export type Level = 1 | 2 | 3;

export type Mode = "addition" | "subtraction" | "multiplication" | "division" | "mixed" | "equation";

export interface Problem {
  id: string;
  mode: Mode;
  level: Level;
  prompt: string;
  operands: number[];
  answer: number;
  meta?: Record<string, unknown>;
}

export interface Result {
  correct: boolean;
  userAnswer: number | null;
  timeMs: number;
}

export interface SessionStats {
  total: number;
  correct: number;
  accuracy: number;
  bestStreak: number;
  avgTimeMs: number;
  mistakes: Array<{
    problem: Problem;
    userAnswer: number | null;
  }>;
}

export interface Generator {
  next(level: Level, sessionCtx?: object): Problem;
  reset(): void;
}

// Game state types
export interface GameState {
  currentProblem: Problem | null;
  nextProblem: Problem | null;
  currentIndex: number;
  totalProblems: number;
  level: Level;
  mode: Mode;
  results: Result[];
  problems: Problem[]; // Track all problems for mistakes calculation
  sessionStats: SessionStats | null;
  problemStartTime: number | null;
  isComplete: boolean;
  currentAttempt: number; // 1 or 2
  maxAttempts: number;
  showHint: boolean;
  feedback: {
    type: 'correct' | 'incorrect' | 'retry' | 'revealed' | null;
    message: string;
  };
  generator: Generator | null;
}

export type GameAction = 
  | { type: 'START_GAME'; payload: { level: Level; mode: Mode } }
  | { type: 'SUBMIT_ANSWER'; payload: { answer: number | null } }
  | { type: 'SKIP_PROBLEM' }
  | { type: 'NEXT_PROBLEM' }
  | { type: 'SHOW_HINT' }
  | { type: 'RETRY_PROBLEM' }
  | { type: 'COMPLETE_SESSION' };

// Hint types
export type HintType = 'emoji-tiles' | 'number-line';

export interface EmojiTilesHint {
  type: 'emoji-tiles';
  groups: Array<{
    emoji: string;
    count: number;
  }>;
  total: number;
}

export interface NumberLineHint {
  type: 'number-line';
  start: number;
  steps: number[];
  end: number;
}

export type Hint = EmojiTilesHint | NumberLineHint;
