'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGame } from '@/lib/engine/game';
import { Level } from '@/lib/types';
import ProblemView from '@/components/game/ProblemView';
import AnswerInput from '@/components/game/AnswerInput';
import Keypad from '@/components/game/Keypad';
import FeedbackBanner from '@/components/game/FeedbackBanner';
import HintDisplay from '@/components/game/HintDisplay';
import Modal from '@/components/ui/Modal';
import styles from './AdditionGame.module.scss';

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

export default function AdditionGame() {
  const router = useRouter();
  const { state, actions } = useGame();
  const [gamePhase, setGamePhase] = useState<GamePhase>('setup');
  const [selectedLevel, setSelectedLevel] = useState<Level>(1);
  const [inputValue, setInputValue] = useState('');
  const [useKeypad, setUseKeypad] = useState(true);
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);

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

  const handleStartGame = (level: Level) => {
    setSelectedLevel(level);
    setGamePhase('playing');
    actions.startGame(level, 'addition');
  };

  const handleSubmitAnswer = (answer: number | null) => {
    actions.submitAnswer(answer);
    setInputValue('');
    // Don't close modal on submit - let user see feedback first
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
    actions.nextProblem();
    setInputValue('');
    setIsHintModalOpen(false);
  };

  const handleSkipProblem = () => {
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
                Addition Game
              </h1>
              <p className={styles.modeDescription}>
                Put numbers together to find the sum!
              </p>
            </div>
            <div className={styles.modeIcon} aria-hidden="true">
              <div className={styles.modeIconBright}>
                ➕
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
                Single digits (0-9)
                <br />
                <span className={styles.levelExample}>Example: 5 + 3 = ?</span>
              </div>
              <div className={styles.levelFeature}>
                ✨ Includes helpful hints!
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => handleStartGame(2)}
              className={styles.levelCard}
            >
              <div className={styles.levelNumber}>2</div>
              <div className={styles.levelTitle}>Intermediate</div>
              <div className={styles.levelDescription}>
                Two digits (10-99)
                <br />
                <span className={styles.levelExample}>Example: 34 + 27 = ?</span>
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
                Three digits (100-999)
                <br />
                <span className={styles.levelExample}>Example: 456 + 789 = ?</span>
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
  const canShowHint = state.level === 1 && state.currentAttempt > 1;

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
              Addition Game<br />{getLevelName(selectedLevel)}
            </h1>
          </div>
          <div className={styles.modeIcon} aria-hidden="true">
            <div className={styles.modeIconBright}>
              ➕
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
