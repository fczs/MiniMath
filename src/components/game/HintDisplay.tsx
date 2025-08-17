'use client';

import { Problem } from '@/lib/types';
import styles from './HintDisplay.module.scss';

interface HintDisplayProps {
  problem: Problem;
  show: boolean;
}

// Emoji tiles hint component
function EmojiTilesHint({ operands }: { operands: number[] }) {
  const [a, b] = operands;
  const emojis = ['🟦', '🟨']; // Blue and yellow squares
  
  return (
    <div className={styles.emojiTiles}>
      <div className={styles.tilesTitle}>Count the tiles:</div>
      
      <div className={styles.tilesContainer}>
        {/* First group */}
        <div className={styles.tilesGroup}>
          <div className={styles.tilesGroupLabel}>{a}</div>
          <div className={styles.tiles}>
            {Array.from({ length: a }, (_, i) => (
              <span key={i} className={styles.tile}>
                {emojis[0]}
              </span>
            ))}
          </div>
        </div>
        
        <div className={styles.plus}>+</div>
        
        {/* Second group */}
        <div className={styles.tilesGroup}>
          <div className={styles.tilesGroupLabel}>{b}</div>
          <div className={styles.tiles}>
            {Array.from({ length: b }, (_, i) => (
              <span key={i} className={styles.tile}>
                {emojis[1]}
              </span>
            ))}
          </div>
        </div>
        
        <div className={styles.equals}>=</div>
        
        {/* Total */}
        <div className={styles.tilesGroup}>
          <div className={styles.tilesGroupLabel}>?</div>
          <div className={styles.tiles}>
            {Array.from({ length: a }, (_, i) => (
              <span key={`total-a-${i}`} className={styles.tile}>
                {emojis[0]}
              </span>
            ))}
            {Array.from({ length: b }, (_, i) => (
              <span key={`total-b-${i}`} className={styles.tile}>
                {emojis[1]}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function HintDisplay({ problem, show }: HintDisplayProps) {
  if (!show || problem.level !== 1 || problem.mode !== 'addition') {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.hintIcon}>💡</span>
        <h3 className={styles.title}>Hint</h3>
      </div>
      
      <div className={styles.hints}>
        <EmojiTilesHint operands={problem.operands} />
      </div>
    </div>
  );
}
