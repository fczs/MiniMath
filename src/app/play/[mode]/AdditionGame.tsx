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
import GameControls from '@/components/game/GameControls';
import styles from './AdditionGame.module.scss';

type GamePhase = 'setup' | 'playing' | 'complete';

export default function AdditionGame() {
  const router = useRouter();
  const { state, actions } = useGame();
  const [gamePhase, setGamePhase] = useState<GamePhase>('setup');
  const [selectedLevel, setSelectedLevel] = useState<Level>(1);
  const [inputValue, setInputValue] = useState('');
  const [useKeypad, setUseKeypad] = useState(true);

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
  };

  const handleSkipProblem = () => {
    actions.skipProblem();
    setInputValue('');
  };

  const handleShowHint = () => {
    actions.showHint();
  };

  const handleRetryProblem = () => {
    actions.retryProblem();
    setInputValue('');
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
            <div className={styles.modeIcon} aria-hidden="true">
              <div className={styles.modeIconBright}>
                ➕
              </div>
            </div>
            <div>
              <h1 className={styles.modeTitle}>
                Addition Game
              </h1>
              <p className={styles.modeDescription}>
                Put numbers together to find the sum!
              </p>
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
          
          <div className={styles.inputToggle}>
            <label className={styles.toggleLabel}>
              <input
                type="checkbox"
                checked={useKeypad}
                onChange={(e) => setUseKeypad(e.target.checked)}
                className={styles.toggleInput}
              />
              <span className={styles.toggleText}>
                Use on-screen keypad
              </span>
            </label>
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          <span aria-hidden="true">←</span>
          Back to Modes
        </Link>
        
        <div className={styles.modeInfo}>
          <div className={styles.modeIcon} aria-hidden="true">
            <div className={styles.modeIconBright}>
              ➕
            </div>
          </div>
          <div>
            <h1 className={styles.modeTitle}>
              Addition Game - Level {selectedLevel}
            </h1>
          </div>
        </div>
      </div>

      <div className={styles.gameArea}>
        {state.currentProblem && (
          <>
            <ProblemView
              problem={state.currentProblem}
              currentIndex={state.currentIndex}
              totalProblems={state.totalProblems}
            />
            
            <FeedbackBanner
              feedback={state.feedback}
              show={showFeedback}
            />
            
            {state.showHint && (
              <HintDisplay
                problem={state.currentProblem}
                show={state.showHint}
              />
            )}
            
            <div className={styles.inputSection}>
              {useKeypad ? (
                <Keypad
                  value={inputValue}
                  onNumberInput={handleKeypadNumber}
                  onBackspace={handleKeypadBackspace}
                  onSubmit={handleKeypadSubmit}
                  disabled={showFeedback}
                />
              ) : (
                <AnswerInput
                  onSubmit={handleSubmitAnswer}
                  disabled={showFeedback}
                  autoFocus={!showFeedback}
                />
              )}
            </div>
            
            <GameControls
              gameState={state}
              onNext={handleNextProblem}
              onSkip={handleSkipProblem}
              onShowHint={handleShowHint}
              onRetry={handleRetryProblem}
            />
          </>
        )}
      </div>
    </div>
  );
}
