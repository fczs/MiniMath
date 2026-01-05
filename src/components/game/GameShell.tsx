'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGame } from '@/lib/engine/game';
import { Level, Mode } from '@/lib/types';
import { getModeConfig } from '@/lib/modes/registry';
import { getKeypadMode, saveKeypadMode } from '@/lib/persist/local';
import ProblemView from './ProblemView';
import AnswerInput from './AnswerInput';
import Keypad from './Keypad';
import FeedbackBanner from './FeedbackBanner';
import HintDisplay from './HintDisplay';
import Modal from '../ui/Modal';
import styles from './GameShell.module.scss';

type GamePhase = 'setup' | 'playing' | 'complete';

const getLevelName = (level: Level): string => {
  switch (level) {
    case 1:
      return 'Beginner';
    case 2:
      return 'Intermediate';
    case 3:
      return 'Advanced';
    default:
      return 'Level';
  }
};

interface GameShellProps {
  mode: Mode;
}

export default function GameShell({ mode }: GameShellProps) {
  const router = useRouter();
  const { state, actions } = useGame();
  const [gamePhase, setGamePhase] = useState<GamePhase>('setup');
  const [selectedLevel, setSelectedLevel] = useState<Level>(1);
  const [inputValue, setInputValue] = useState('');
  const [useKeypad, setUseKeypad] = useState(getKeypadMode);
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);
  const autoNextTimerRef = useRef<NodeJS.Timeout | null>(null);

  const modeConfig = getModeConfig(mode);

  // Handle game completion
  useEffect(() => {
    if (state.isComplete && state.sessionStats) {
      setGamePhase('complete');
      // Navigate to results page with a small delay
      setTimeout(() => {
        router.push('/results');
      }, 2000);
    }
  }, [state.isComplete, state.sessionStats, router]);

  // Save keypad preference to localStorage when it changes
  useEffect(() => {
    saveKeypadMode(useKeypad);
  }, [useKeypad]);

  // Clear auto-next timer helper function
  const clearAutoNextTimer = () => {
    if (autoNextTimerRef.current) {
      clearTimeout(autoNextTimerRef.current);
      autoNextTimerRef.current = null;
    }
  };

  // Auto-advance to next problem after correct answer or skip
  useEffect(() => {
    clearAutoNextTimer(); // Clear any existing timer
    
    const feedback = state.feedback;
    const shouldAutoAdvance = feedback.type === 'correct' || feedback.type === 'revealed';
    
    if (shouldAutoAdvance && gamePhase === 'playing') {
      autoNextTimerRef.current = setTimeout(() => {
        actions.nextProblem();
        setInputValue('');
        setIsHintModalOpen(false);
      }, 2000);
    }
    
    return clearAutoNextTimer; // Cleanup on unmount or dependency change
  }, [state.feedback, gamePhase, actions]);

  const handleStartGame = (level: Level) => {
    setSelectedLevel(level);
    setGamePhase('playing');
    actions.startGame(level, mode);
  };

  const handleSubmitAnswer = (answer: number | null) => {
    actions.submitAnswer(answer);
    setInputValue('');
  };

  const handleKeypadNumber = (digit: string) => {
    setInputValue(prev => prev + digit);
  };

  const handleKeypadBackspace = () => {
    setInputValue(prev => prev.slice(0, -1));
  };

  const handleKeypadSubmit = () => {
    if (inputValue.trim() === '') {
      handleSubmitAnswer(null);

      return;
    }

    // Convert mathematical minus sign (U+2212) to regular minus sign for parsing
    const normalizedInput = inputValue.replace(/−/g, '-');
    const answer = parseInt(normalizedInput, 10);

    handleSubmitAnswer(isNaN(answer) ? null : answer);
  };

  const handleNextProblem = () => {
    clearAutoNextTimer(); // Clear auto-next timer when manually advancing
    actions.nextProblem();
    setInputValue('');
    setIsHintModalOpen(false);
  };

  const handleSkipProblem = () => {
    clearAutoNextTimer(); // Clear any existing timer
    actions.skipProblem();
    setInputValue('');
    setIsHintModalOpen(false);
  };

  const handleShowHint = () => {
    setIsHintModalOpen(true);
    actions.showHint();
  };

  const handleCloseHint = () => {
    setIsHintModalOpen(false);
  };

  // Get level descriptions based on mode
  const getLevelDescriptions = (mode: Mode) => {
    switch (mode) {
      case 'addition':
        return {
          1: { range: 'Single digits (0-9)', example: '5 + 3 = ?' },
          2: { range: 'Two digits (10-99)', example: '34 + 27 = ?' },
          3: { range: 'Three digits (100-999)', example: '456 + 789 = ?' }
        };
      case 'subtraction':
        return {
          1: { range: 'Single digits (0-9)', example: '8 − 3 = ?' },
          2: { range: 'Two digits (10-99)', example: '52 − 24 = ?' },
          3: { range: 'Mixed range (0-99)', example: '25 − 67 = ?' }
        };
      case 'multiplication':
        return {
          1: { range: 'Single digits (0-9)', example: '4 × 7 = ?' },
          2: { range: 'Multiples of 10 mix', example: '4 × 50 = ?' },
          3: { range: 'Mixed range', example: '6 × 47 = ?' }
        };
      case 'division':
        return {
          1: { range: 'Multiplication table', example: '24 ÷ 6 = ?' },
          2: { range: 'Dividing tens', example: '400 ÷ 20 = ?' },
          3: { range: 'Three-digit ÷ one-digit', example: '126 ÷ 3 = ?' }
        };
      case 'mixed':
        return {
          1: { range: 'Single digits', example: '' },
          2: { range: 'Two digits & tens', example: '' },
          3: { range: 'Advanced mix', example: '' }
        };
      case 'equation':
        return {
          1: { range: 'Addition & subtraction', example: 'x + 5 = 12' },
          2: { range: 'Multiplication & division', example: 'x × 4 = 20' },
          3: { range: 'Brackets', example: '3 × (x + 2) = 15' }
        };
      default:
        return {
          1: { range: 'Single digits', example: 'Level 1' },
          2: { range: 'Two digits', example: 'Level 2' },
          3: { range: 'Three digits', example: 'Level 3' }
        };
    }
  };

  const levelDescriptions = getLevelDescriptions(mode);

  // Setup phase - level selection
  if (gamePhase === 'setup') {
    return (
      <div 
        className={styles.container}
        style={{ '--mode-color': getModeColor(mode) } as React.CSSProperties}
      >
        <div className={styles.header}>
          <Link href="/" className={styles.backButton}>
            <span aria-hidden="true">←</span>
            Back to Modes
          </Link>
          
          <div className={styles.modeInfo}>
            <div className={styles.titleContainer}>
              <h1 className={styles.modeTitle}>
                {modeConfig.displayName} Game
              </h1>
              <p className={styles.modeDescription}>
                {getGameDescription(mode)}
              </p>
            </div>
            <div className={styles.modeIcon} aria-hidden="true">
              <div className={styles.modeIconBright}>
                {modeConfig.emoji}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.setupArea}>
          <h2 className={styles.setupTitle}>Choose Your Level</h2>
          <div className={styles.levelGrid}>
            <button
              type="button"
              onClick={() => handleStartGame(1)}
              className={styles.levelCard}
            >
              <div className={styles.levelNumber}>1</div>
              <div className={styles.levelTitle}>Beginner</div>
              <div className={styles.levelDescription}>
                {levelDescriptions[1].range}
                {levelDescriptions[1].example && (
                  <>
                    <br />
                    <span className={styles.levelExample}>Example: {levelDescriptions[1].example}</span>
                  </>
                )}
              </div>
              {(mode === 'addition' || mode === 'subtraction' || mode === 'multiplication' || mode === 'division') && (
                <div className={`${styles.levelFeature} ${styles.levelFeatureHints}`}>
                  ✨ Includes helpful hints!
                </div>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => handleStartGame(2)}
              className={styles.levelCard}
            >
              <div className={styles.levelNumber}>2</div>
              <div className={styles.levelTitle}>Intermediate</div>
              <div className={styles.levelDescription}>
                {levelDescriptions[2].range}
                {levelDescriptions[2].example && (
                  <>
                    <br />
                    <span className={styles.levelExample}>Example: {levelDescriptions[2].example}</span>
                  </>
                )}
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => handleStartGame(3)}
              className={styles.levelCard}
            >
              <div className={styles.levelNumber}>3</div>
              <div className={styles.levelTitle}>Advanced</div>
              <div className={styles.levelDescription}>
                {levelDescriptions[3].range}
                {levelDescriptions[3].example && (
                  <>
                    <br />
                    <span className={styles.levelExample}>
                      Example:{mode === 'equation' ? <br /> : ' '}{levelDescriptions[3].example}
                    </span>
                  </>
                )}
              </div>
              {mode === 'subtraction' && (
                <div className={`${styles.levelFeature} ${styles.levelFeatureNegative}`}>
                  🎯 Negative results!
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Complete phase
  if (gamePhase === 'complete') {
    return (
      <div 
        className={styles.container}
        style={{ '--mode-color': getModeColor(mode) } as React.CSSProperties}
      >
        <div className={styles.completeArea}>
          <div className={styles.completeIcon}>🎉</div>
          <h2 className={styles.completeTitle}>Session Complete!</h2>
          <p className={styles.completeText}>
            Great work! Taking you to your results...
          </p>
          <div className={styles.completeStats}>
            {state.sessionStats && (
              <>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{state.sessionStats.accuracy}%</span>
                  <span className={styles.statLabel}>Accuracy</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{state.sessionStats.correct}</span>
                  <span className={styles.statLabel}>Correct</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{state.sessionStats.bestStreak}</span>
                  <span className={styles.statLabel}>Best Streak</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Playing phase
  const showFeedback = Boolean(state.feedback.type && state.feedback.message);
  const isInputDisabled = showFeedback && state.feedback.type !== 'incorrect';
  const canShowHint = modeConfig.hints?.eligible(state.currentProblem!) && state.level === 1 && state.currentAttempt > 1;
  
  // Show minus key for Level 3 subtraction only
  // Show minus key for Level 3 subtraction or Level 3 mixed (which may include negative subtraction)
  const showMinusKey = (mode === 'subtraction' || mode === 'mixed') && selectedLevel === 3;

  return (
    <div 
      className={styles.container}
      style={{ '--mode-color': getModeColor(mode) } as React.CSSProperties}
    >
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          <span aria-hidden="true">←</span>
          Back to Modes
        </Link>
        
        <div className={styles.modeInfo}>
          <div className={styles.titleContainer}>
            <h1 className={styles.modeTitle}>
              {modeConfig.displayName} Game<br />{getLevelName(selectedLevel)}
            </h1>
          </div>
          <div className={styles.modeIcon} aria-hidden="true">
            <div className={styles.modeIconBright}>
              {modeConfig.emoji}
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.gameArea} ${useKeypad ? styles.keypadLayout : styles.inputLayout}`}>
        {state.currentProblem && (
          <>
            <div className={styles.leftColumn}>
              <div className={styles.inputModeToggle}>
                <label className={styles.toggleLabel} onClick={() => setUseKeypad(false)}>
                  <span className={`${styles.toggleOption} ${!useKeypad ? styles.active : ''}`}>✏️</span>
                </label>
                
                <div className={styles.toggleSwitch}>
                  <input
                    type="checkbox"
                    checked={useKeypad}
                    onChange={(e) => setUseKeypad(e.target.checked)}
                    className={styles.toggleInput}
                    id="keypad-mode"
                  />
                  <label htmlFor="keypad-mode" className={styles.switchLabel}>
                    <span className={styles.switchHandle}></span>
                  </label>
                </div>
                
                <label className={styles.toggleLabel} onClick={() => setUseKeypad(true)}>
                  <span className={`${styles.toggleOption} ${useKeypad ? styles.active : ''}`}>🔢</span>
                </label>
              </div>

              <ProblemView
                problem={state.currentProblem}
                currentIndex={state.currentIndex}
                totalProblems={state.totalProblems}
                gameState={state}
                onNext={handleNextProblem}
                onSkip={handleSkipProblem}
              />
              
              <FeedbackBanner
                feedback={state.feedback}
                show={showFeedback}
              />
              
              {!useKeypad && (
                <div className={styles.inputSection}>
                  <AnswerInput
                    onSubmit={handleSubmitAnswer}
                    disabled={isInputDisabled}
                    autoFocus={!isInputDisabled}
                    onShowHint={handleShowHint}
                    canShowHint={canShowHint}
                  />
                </div>
              )}
            </div>
            
            {useKeypad && (
              <div className={styles.rightColumn}>
                <div className={styles.inputSection}>
                  <Keypad
                    value={inputValue}
                    onNumberInput={handleKeypadNumber}
                    onBackspace={handleKeypadBackspace}
                    onSubmit={handleKeypadSubmit}
                    onShowHint={handleShowHint}
                    disabled={isInputDisabled}
                    canShowHint={canShowHint}
                    showMinusKey={showMinusKey}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Hint Modal */}
      <Modal
        isOpen={isHintModalOpen}
        onClose={handleCloseHint}
      >
        {state.currentProblem && (
          <>
            {/* Use mode-specific hint component if available */}
            {modeConfig.hints?.component ? (
              <Suspense fallback={<div>Loading hint...</div>}>
                <modeConfig.hints.component
                  problem={state.currentProblem}
                />
              </Suspense>
            ) : (
              <HintDisplay
                problem={state.currentProblem}
                show={true}
              />
            )}
          </>
        )}
      </Modal>
    </div>
  );
}

// Helper function to get game description by mode
function getGameDescription(mode: Mode): string {
  switch (mode) {
    case 'addition':
      return 'Put numbers together to find the sum!';
    case 'subtraction':
      return 'Take numbers away to find the difference!';
    case 'multiplication':
      return 'Find how many in groups of numbers!';
    case 'division':
      return 'Share numbers equally into groups!';
    case 'mixed':
      return 'Practice all operations together!';
    case 'equation':
      return 'Balance the equation scale!';
    default:
      return 'Practice math problems!';
  }
}

// Helper function to get mode colors 
function getModeColor(mode: Mode): string {
  const modeColors = {
    addition: 'var(--color-fun-green)',
    subtraction: 'var(--color-fun-blue)',
    multiplication: 'var(--color-fun-red)',
    division: 'var(--color-fun-yellow)',
    mixed: 'var(--color-fun-mint)',
    equation: 'var(--color-fun-purple)',
  };
  
  return modeColors[mode] || 'var(--color-primary-500)';
}
