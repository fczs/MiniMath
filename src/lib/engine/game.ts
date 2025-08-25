import { useReducer, useCallback } from 'react';
import { GameState, GameAction, Problem, Result, SessionStats, Level, Mode, Generator } from '../types';
import { getModeConfig } from '../modes/registry';
import { saveLastSession } from '../persist/local';

const TOTAL_PROBLEMS = 10;
const MAX_ATTEMPTS = 2;

// Initial state factory
const createInitialState = (): GameState => ({
  currentProblem: null,
  nextProblem: null,
  currentIndex: 0,
  totalProblems: TOTAL_PROBLEMS,
  level: 1,
  mode: 'addition',
  results: [],
  problems: [],
  sessionStats: null,
  problemStartTime: null,
  isComplete: false,
  currentAttempt: 1,
  maxAttempts: MAX_ATTEMPTS,
  showHint: false,
  feedback: {
    type: null,
    message: '',
  },
  generator: null,
});

// Feedback messages
const getFeedbackMessage = (type: string, answer?: number): string => {
  switch (type) {
    case 'correct': {
      const correctMessages = [
        'Great job! 🎉',
        'Yes—nice work!',
        'Awesome! 🌟',
        'Perfect! ⭐',
        'Excellent! 🎯',
      ];

      return correctMessages[Math.floor(Math.random() * correctMessages.length)];
    }
    
    case 'retry':
      return 'Almost there—try once more!';
    
    case 'revealed':
      return `The answer is ${answer}. You'll get it next time!`;
    
    case 'incorrect':
      return 'Not quite right, but keep trying!';
    
    default:
      return '';
  }
};

// Session stats calculator
const calculateSessionStats = (results: Result[], problems: Problem[]): SessionStats => {
  const correct = results.filter(r => r.correct).length;
  const total = results.length;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  
  // Calculate best streak
  let bestStreak = 0;
  let currentStreak = 0;

  for (const result of results) {
    if (result.correct) {
      currentStreak++;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }
  
  // Calculate average time (only for correct answers)
  const correctResults = results.filter(r => r.correct);
  const avgTimeMs = correctResults.length > 0 
    ? Math.round(correctResults.reduce((sum, r) => sum + r.timeMs, 0) / correctResults.length)
    : 0;
  
  // Collect mistakes
  const mistakes: SessionStats['mistakes'] = [];

  results.forEach((result, index) => {
    if (!result.correct && problems[index]) {
      mistakes.push({
        problem: problems[index],
        userAnswer: result.userAnswer,
      });
    }
  });
  
  return {
    total,
    correct,
    accuracy,
    bestStreak,
    avgTimeMs,
    mistakes,
  };
};

// Game reducer
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME': {
      const { level, mode } = action.payload;
      const generator = getGenerator(mode);

      generator.reset();
      
      const currentProblem = generator.next(level);
      const nextProblem = generator.next(level);
      
      return {
        ...createInitialState(),
        level,
        mode,
        generator,
        currentProblem,
        nextProblem,
        problems: [currentProblem],
        problemStartTime: Date.now(),
      };
    }
    
    case 'SUBMIT_ANSWER': {
      const { answer } = action.payload;
      const { currentProblem, problemStartTime, currentAttempt, results } = state;
      
      if (!currentProblem || !problemStartTime) return state;
      
      const timeMs = Date.now() - problemStartTime;
      const correct = answer === currentProblem.answer;
      
      if (correct) {
        // Correct answer
        const result: Result = { correct: true, userAnswer: answer, timeMs };
        const newResults = [...results, result];
        
        return {
          ...state,
          results: newResults,
          feedback: {
            type: 'correct',
            message: getFeedbackMessage('correct'),
          },
          currentAttempt: 1,
          showHint: false,
        };
      } else {
        // Wrong answer
        if (currentAttempt < MAX_ATTEMPTS) {
          // First wrong attempt - allow continuing (hint button will appear for Level 1)
          return {
            ...state,
            currentAttempt: currentAttempt + 1,
            showHint: false, // Don't auto-show hint, let user click button
            feedback: {
              type: 'incorrect',
              message: getFeedbackMessage('incorrect'),
            },
          };
        } else {
          // Second wrong attempt - reveal answer
          const result: Result = { correct: false, userAnswer: answer, timeMs };
          const newResults = [...results, result];
          
          return {
            ...state,
            results: newResults,
            feedback: {
              type: 'revealed',
              message: getFeedbackMessage('revealed', currentProblem.answer),
            },
            currentAttempt: 1,
            showHint: false,
          };
        }
      }
    }
    
    case 'SKIP_PROBLEM': {
      const { currentProblem, problemStartTime, results } = state;
      
      if (!currentProblem || !problemStartTime) return state;
      
      const timeMs = Date.now() - problemStartTime;
      const result: Result = { correct: false, userAnswer: null, timeMs };
      const newResults = [...results, result];
      
      return {
        ...state,
        results: newResults,
        feedback: {
          type: 'revealed',
          message: getFeedbackMessage('revealed', currentProblem.answer),
        },
        currentAttempt: 1,
        showHint: false,
      };
    }
    
    case 'NEXT_PROBLEM': {
      const { nextProblem, currentIndex, level, generator, results } = state;
      
      if (currentIndex + 1 >= TOTAL_PROBLEMS) {
        // Session complete
        const sessionStats = calculateSessionStats(results, state.problems);
        
        // Save to localStorage
        saveLastSession(sessionStats);
        
        return {
          ...state,
          isComplete: true,
          sessionStats,
          feedback: { type: null, message: '' },
        };
      }
      
      // Generate next problem using existing generator
      if (!generator) {
        throw new Error('Generator not found in state');
      }
      
      const newNextProblem = generator.next(level);
      
      return {
        ...state,
        currentProblem: nextProblem,
        nextProblem: newNextProblem,
        problems: [...state.problems, nextProblem].filter(Boolean) as Problem[],
        currentIndex: currentIndex + 1,
        problemStartTime: Date.now(),
        currentAttempt: 1,
        showHint: false,
        feedback: { type: null, message: '' },
      };
    }
    
    case 'SHOW_HINT': {
      return {
        ...state,
        showHint: true,
      };
    }
    
    case 'RETRY_PROBLEM': {
      return {
        ...state,
        problemStartTime: Date.now(),
        feedback: { type: null, message: '' },
      };
    }
    
    case 'COMPLETE_SESSION': {
      const sessionStats = calculateSessionStats(state.results, state.problems);
      
      saveLastSession(sessionStats);
      
      return {
        ...state,
        isComplete: true,
        sessionStats,
      };
    }
    
    default:
      return state;
  }
};

// Generator factory - use mode registry
const getGenerator = (mode: Mode): Generator => {
  const modeConfig = getModeConfig(mode);

  return modeConfig.generator;
};

// Custom hook for game state management
export const useGame = () => {
  const [state, dispatch] = useReducer(gameReducer, createInitialState());
  
  const startGame = useCallback((level: Level, mode: Mode) => {
    dispatch({ type: 'START_GAME', payload: { level, mode } });
  }, []);
  
  const submitAnswer = useCallback((answer: number | null) => {
    dispatch({ type: 'SUBMIT_ANSWER', payload: { answer } });
  }, []);
  
  const skipProblem = useCallback(() => {
    dispatch({ type: 'SKIP_PROBLEM' });
  }, []);
  
  const nextProblem = useCallback(() => {
    dispatch({ type: 'NEXT_PROBLEM' });
  }, []);
  
  const showHint = useCallback(() => {
    dispatch({ type: 'SHOW_HINT' });
  }, []);
  
  const retryProblem = useCallback(() => {
    dispatch({ type: 'RETRY_PROBLEM' });
  }, []);
  
  const completeSession = useCallback(() => {
    dispatch({ type: 'COMPLETE_SESSION' });
  }, []);
  
  return {
    state,
    actions: {
      startGame,
      submitAnswer,
      skipProblem,
      nextProblem,
      showHint,
      retryProblem,
      completeSession,
    },
  };
};

// Re-export from persistence layer for convenience
export { getLastSession } from '../persist/local';
