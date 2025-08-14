import { Problem } from '@/lib/types';
import styles from './ProblemView.module.scss';

interface ProblemViewProps {
  problem: Problem;
  currentIndex: number;
  totalProblems: number;
}

export default function ProblemView({ problem, currentIndex, totalProblems }: ProblemViewProps) {
  return (
    <div className={styles.container}>
      <div className={styles.progress}>
        <span className={styles.progressText}>
          Problem {currentIndex + 1} of {totalProblems}
        </span>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ width: `${((currentIndex + 1) / totalProblems) * 100}%` }}
          />
        </div>
      </div>
      
      <div className={styles.problemContainer}>
        <div className={styles.prompt}>
          {problem.prompt}
        </div>
        
        <div className={styles.metadata}>
          <span className={styles.mode}>
            {problem.mode.charAt(0).toUpperCase() + problem.mode.slice(1)}
          </span>
          <span className={styles.level}>
            Level {problem.level}
          </span>
        </div>
      </div>
    </div>
  );
}
