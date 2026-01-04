'use client';

import { Problem } from '@/lib/types';
import styles from './SubtractionHint.module.scss';

interface SubtractionHintProps {
  problem: Problem;
}

// Subtraction tiles hint component
function SubtractionTilesHint({ operands }: { operands: number[] }) {
  const [a, b] = operands;
  
  // Use take-away tiles visualization for simplicity and kid-friendliness
  const tiles = Array.from({ length: a }, (_, i) => i);
  const crossedOut = tiles.slice(0, b);
  const remaining = tiles.slice(b);
  
  return (
    <div className={styles.emojiTiles}>
      <div className={styles.tilesTitle}>Count the tiles:</div>
      
      <div className={styles.tilesContainer}>
        {/* Start with all tiles */}
        <div className={styles.tilesGroup}>
          <div className={styles.tilesGroupLabel}>{a}</div>
          <div className={styles.tiles}>
            {Array.from({ length: a }, (_, i) => (
              <span key={i} className={styles.tile}>
                🟦
              </span>
            ))}
          </div>
        </div>
        
        <div className={styles.minus}>−</div>
        
        {/* Take away tiles */}
        <div className={styles.tilesGroup}>
          <div className={styles.tilesGroupLabel}>{b}</div>
          <div className={styles.tiles}>
            {Array.from({ length: b }, (_, i) => (
              <span key={i} className={styles.tile}>
                🔳
              </span>
            ))}
          </div>
        </div>
        
        <div className={styles.equals}>=</div>
        
        {/* Result visualization */}
        <div className={styles.tilesGroup}>
          <div className={styles.tilesGroupLabel}>?</div>
          <div className={styles.tiles}>
            {/* Crossed out tiles */}
            {crossedOut.map((_, index) => (
              <div key={`crossed-${index}`} className={styles.tileCrossed} aria-label="Taken away">
                <span className={styles.tileEmoji}>🔳</span>
                <span className={styles.crossmark}>✗</span>
              </div>
            ))}
            
            {/* Remaining tiles */}
            {remaining.map((_, index) => (
              <span key={`remaining-${index}`} className={styles.tile} aria-label="Remaining">
                🟦
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SubtractionHint({ problem }: SubtractionHintProps) {
  if (problem.mode !== 'subtraction' || problem.level !== 1) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.hintIcon}>💡</span>
        <h3 className={styles.title}>Hint</h3>
      </div>
      
      <div className={styles.hints}>
        <SubtractionTilesHint operands={problem.operands} />
      </div>
    </div>
  );
}
