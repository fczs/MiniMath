'use client';

import { useState, useEffect, useRef } from 'react';
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
      }, 3500);
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
    const answer = inputValue.trim() === '' ? null : parseInt(inputValue, 10);

    handleSubmitAnswer(answer);
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
          1: { range: 'Single digits (0-9)', example: '8 - 3 = ?' },
          2: { range: 'Two digits (10-99)', example: '52 - 24 = ?' },
          3: { range: 'Three digits (100-999)', example: '678 - 234 = ?' }
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
      <div className={styles.container}>
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
                <br />
                <span className={styles.levelExample}>Example: {levelDescriptions[1].example}</span>
              </div>
              {mode === 'addition' && (
                <div className={styles.levelFeature}>
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
                <br />
                <span className={styles.levelExample}>Example: {levelDescriptions[2].example}</span>
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
                <br />
                <span className={styles.levelExample}>Example: {levelDescriptions[3].example}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Complete phase
  if (gamePhase === 'complete') {
    return (
      <div className={styles.container}>
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

  return (
    <div className={styles.container}>
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
              <ProblemView
                problem={state.currentProblem}
                currentIndex={state.currentIndex}
                totalProblems={state.totalProblems}
                gameState={state}
                onNext={handleNextProblem}
                onSkip={handleSkipProblem}
                useKeypad={useKeypad}
                onToggleInputMode={setUseKeypad}
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
          <HintDisplay
            problem={state.currentProblem}
            show={true}
          />
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
