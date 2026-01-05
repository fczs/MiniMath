import { Problem, GameState } from '@/lib/types';
import styles from './ProblemView.module.scss';

interface ProblemViewProps {
  problem: Problem;
  currentIndex: number;
  totalProblems: number;
  gameState: GameState;
  onNext: () => void;
  onSkip: () => void;
}

export default function ProblemView({ problem, currentIndex, totalProblems, gameState, onNext, onSkip }: ProblemViewProps) {
  const { feedback } = gameState;
  const showNextButton = feedback.type === 'correct' || feedback.type === 'revealed';

  return (
    <div className={styles.container}>
      <div className={styles.progress}>
        <div className={styles.progressHeader}>
        <span className={styles.progressText}>
          Problem {currentIndex + 1} of {totalProblems}
        </span>
        <div className={styles.actionButtons}>
          {showNextButton ? (
            <button
              type="button"
              onClick={onNext}
              className={`${styles.actionButton} ${styles.nextButton}`}
            >
              <span className={styles.buttonIcon}>→</span>
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={onSkip}
              className={`${styles.actionButton} ${styles.skipButton}`}
            >
              <span className={styles.buttonIcon}>⏭️</span>
              Skip
            </button>
          )}
        </div>
        </div>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ width: `${((currentIndex + 1) / totalProblems) * 100}%` }}
          />
        </div>
      </div>
      
      <div className={styles.prompt}>
          {problem.prompt}
      </div>
    </div>
  );
}
