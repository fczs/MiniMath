import { GameState } from '@/lib/types';
import styles from './GameControls.module.scss';

interface GameControlsProps {
  gameState: GameState;
  onNext: () => void;
  onSkip: () => void;
  onShowHint: () => void;
  onRetry: () => void;
}

export default function GameControls({
  gameState,
  onNext,
  onSkip,
  onShowHint,
  onRetry,
}: GameControlsProps) {
  const { feedback, currentAttempt, maxAttempts, showHint, level } = gameState;
  const canShowHint = level === 1 && currentAttempt > 1 && !showHint;
  const showNextButton = feedback.type === 'correct' || feedback.type === 'revealed';
  const showRetryButton = feedback.type === 'retry';

  return (
    <div className={styles.container}>
      <div className={styles.primaryActions}>
        {showNextButton && (
          <button
            type="button"
            onClick={onNext}
            className={`${styles.button} ${styles.primaryButton}`}
          >
            <span className={styles.buttonIcon}>→</span>
            Next Problem
          </button>
        )}
        
        {showRetryButton && (
          <button
            type="button"
            onClick={onRetry}
            className={`${styles.button} ${styles.primaryButton}`}
          >
            <span className={styles.buttonIcon}>🔄</span>
            Try Again
          </button>
        )}
      </div>
      
      <div className={styles.secondaryActions}>
        {canShowHint && (
          <button
            type="button"
            onClick={onShowHint}
            className={`${styles.button} ${styles.hintButton}`}
          >
            <span className={styles.buttonIcon}>💡</span>
            Show Hint
          </button>
        )}
        
        {!showNextButton && (
          <button
            type="button"
            onClick={onSkip}
            className={`${styles.button} ${styles.skipButton}`}
          >
            <span className={styles.buttonIcon}>⏭️</span>
            Skip
          </button>
        )}
      </div>
      
      {currentAttempt > 1 && currentAttempt <= maxAttempts && (
        <div className={styles.attemptInfo}>
          <span className={styles.attemptText}>
            Attempt {currentAttempt} of {maxAttempts}
          </span>
        </div>
      )}
    </div>
  );
}
