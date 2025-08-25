'use client';

import { Problem } from '@/lib/types';
import styles from './SubtractionHint.module.scss';

interface SubtractionHintProps {
  problem: Problem;
}

export default function SubtractionHint({ problem }: SubtractionHintProps) {
  if (problem.mode !== 'subtraction' || problem.level !== 1) {
    return null;
  }

  const [a, b] = problem.operands;
  const result = a - b;

  // Use take-away tiles visualization for simplicity and kid-friendliness
  const tiles = Array.from({ length: a }, (_, i) => i);
  const crossedOut = tiles.slice(0, b);
  const remaining = tiles.slice(b);

  return (
    <div className={styles.container}>
      <div className={styles.title}>Let's solve {a} − {b} together!</div>
      
      <div className={styles.visualization}>
        <div className={styles.explanation}>
          Start with <strong>{a} tiles</strong>, then take away <strong>{b} tiles</strong>:
        </div>
        
        <div className={styles.tilesContainer}>
          <div className={styles.tilesRow}>
            {/* Crossed out tiles */}
            {crossedOut.map((_, index) => (
              <div key={`crossed-${index}`} className={styles.tileCrossed} aria-label="Taken away">
                <span className={styles.tileEmoji}>🔳</span>
                <span className={styles.crossmark}>✗</span>
              </div>
            ))}
            
            {/* Remaining tiles */}
            {remaining.map((_, index) => (
              <div key={`remaining-${index}`} className={styles.tile} aria-label="Remaining">
                <span className={styles.tileEmoji}>🟦</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.result}>
          <div className={styles.calculation}>
            {a} − {b} = <strong className={styles.answer}>{result}</strong>
          </div>
          <div className={styles.explanation}>
            We have <strong>{result}</strong> tiles left!
          </div>
        </div>
      </div>
    </div>
  );
}
