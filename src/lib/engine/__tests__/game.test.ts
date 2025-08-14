/**
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react';
import { useGame } from '../game';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useGame hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useGame());
    
    expect(result.current.state.currentProblem).toBeNull();
    expect(result.current.state.currentIndex).toBe(0);
    expect(result.current.state.totalProblems).toBe(10);
    expect(result.current.state.results).toEqual([]);
    expect(result.current.state.isComplete).toBe(false);
    expect(result.current.state.currentAttempt).toBe(1);
    expect(result.current.state.maxAttempts).toBe(2);
  });

  it('should start a game correctly', () => {
    const { result } = renderHook(() => useGame());
    
    act(() => {
      result.current.actions.startGame(1, 'addition');
    });
    
    expect(result.current.state.level).toBe(1);
    expect(result.current.state.mode).toBe('addition');
    expect(result.current.state.currentProblem).not.toBeNull();
    expect(result.current.state.nextProblem).not.toBeNull();
    expect(result.current.state.problemStartTime).not.toBeNull();
  });

  it('should handle correct answer submission', () => {
    const { result } = renderHook(() => useGame());
    
    act(() => {
      result.current.actions.startGame(1, 'addition');
    });
    
    const problem = result.current.state.currentProblem!;
    const correctAnswer = problem.answer;
    
    act(() => {
      result.current.actions.submitAnswer(correctAnswer);
    });
    
    expect(result.current.state.feedback.type).toBe('correct');
    expect(result.current.state.results).toHaveLength(1);
    expect(result.current.state.results[0].correct).toBe(true);
    expect(result.current.state.results[0].userAnswer).toBe(correctAnswer);
    expect(result.current.state.currentAttempt).toBe(1); // Reset for next problem
  });

  it('should handle incorrect answer with retry opportunity', () => {
    const { result } = renderHook(() => useGame());
    
    act(() => {
      result.current.actions.startGame(1, 'addition');
    });
    
    const problem = result.current.state.currentProblem!;
    const wrongAnswer = problem.answer + 999; // Definitely wrong
    
    act(() => {
      result.current.actions.submitAnswer(wrongAnswer);
    });
    
    expect(result.current.state.feedback.type).toBe('retry');
    expect(result.current.state.currentAttempt).toBe(2);
    expect(result.current.state.showHint).toBe(true); // Level 1 should show hint
    expect(result.current.state.results).toHaveLength(0); // No result recorded yet
  });

  it('should reveal answer after second wrong attempt', () => {
    const { result } = renderHook(() => useGame());
    
    act(() => {
      result.current.actions.startGame(1, 'addition');
    });
    
    const problem = result.current.state.currentProblem!;
    const wrongAnswer = problem.answer + 999;
    
    // First wrong attempt
    act(() => {
      result.current.actions.submitAnswer(wrongAnswer);
    });
    
    // Second wrong attempt
    act(() => {
      result.current.actions.submitAnswer(wrongAnswer);
    });
    
    expect(result.current.state.feedback.type).toBe('revealed');
    expect(result.current.state.results).toHaveLength(1);
    expect(result.current.state.results[0].correct).toBe(false);
    expect(result.current.state.results[0].userAnswer).toBe(wrongAnswer);
    expect(result.current.state.currentAttempt).toBe(1); // Reset for next problem
  });

  it('should handle skip problem action', () => {
    const { result } = renderHook(() => useGame());
    
    act(() => {
      result.current.actions.startGame(1, 'addition');
    });
    
    const problem = result.current.state.currentProblem!;
    
    act(() => {
      result.current.actions.skipProblem();
    });
    
    expect(result.current.state.feedback.type).toBe('revealed');
    expect(result.current.state.feedback.message).toContain(problem.answer.toString());
    expect(result.current.state.results).toHaveLength(1);
    expect(result.current.state.results[0].correct).toBe(false);
    expect(result.current.state.results[0].userAnswer).toBeNull();
  });

  it('should advance to next problem', () => {
    const { result } = renderHook(() => useGame());
    
    act(() => {
      result.current.actions.startGame(1, 'addition');
    });
    
    const initialIndex = result.current.state.currentIndex;
    
    // Submit correct answer
    act(() => {
      result.current.actions.submitAnswer(result.current.state.currentProblem!.answer);
    });
    
    // Go to next problem
    act(() => {
      result.current.actions.nextProblem();
    });
    
    expect(result.current.state.currentIndex).toBe(initialIndex + 1);
    expect(result.current.state.feedback.type).toBeNull();
    expect(result.current.state.showHint).toBe(false);
  });

  it('should show hint only for level 1 after wrong attempt', () => {
    // Test Level 1 - should show hint
    const { result: result1 } = renderHook(() => useGame());
    
    act(() => {
      result1.current.actions.startGame(1, 'addition');
    });
    
    act(() => {
      result1.current.actions.submitAnswer(999); // Wrong answer
    });
    
    expect(result1.current.state.showHint).toBe(true);
    
    // Test Level 2 - should not show hint
    const { result: result2 } = renderHook(() => useGame());
    
    act(() => {
      result2.current.actions.startGame(2, 'addition');
    });
    
    act(() => {
      result2.current.actions.submitAnswer(999); // Wrong answer
    });
    
    expect(result2.current.state.showHint).toBe(false);
  });

  it('should save session stats to localStorage on completion', () => {
    const { result } = renderHook(() => useGame());
    
    act(() => {
      result.current.actions.startGame(1, 'addition');
    });
    
    // Complete one problem
    act(() => {
      result.current.actions.submitAnswer(result.current.state.currentProblem!.answer);
    });
    
    act(() => {
      result.current.actions.completeSession();
    });
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'minimath:last-session',
      expect.stringContaining('"total":1')
    );

    expect(result.current.state.isComplete).toBe(true);
    expect(result.current.state.sessionStats).not.toBeNull();
  });
});
