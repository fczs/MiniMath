'use client';

import { Problem } from '@/lib/types';
import styles from './MultiplicationHint.module.scss';

interface MultiplicationHintProps {
  problem: Problem;
}

// Multiplication array hint component - shows multiplication as rows × columns grid
function MultiplicationArrayHint({ operands }: { operands: number[] }) {
  const [rows, cols] = operands;
  
  // For very large products, limit visualization
  const maxTotal = 81; // 9×9 max
  const shouldShowArray = rows * cols <= maxTotal && rows <= 9 && cols <= 9;
  
  if (!shouldShowArray) {
    return (
      <div className={styles.simpleHint}>
        <div className={styles.hintText}>
          Think: {rows} groups of {cols}
        </div>
      </div>
    );
  }
  
  return (
    <div className={styles.arrayHint}>
      <div className={styles.hintText}>
        {rows} × {cols} = ?
      </div>
      
      <div className={styles.arrayContainer}>
        {/* Row labels on the left */}
        <div className={styles.rowLabels}>
          {Array.from({ length: rows }, (_, i) => (
            <div key={i} className={styles.rowLabel}>
              {i + 1}
            </div>
          ))}
        </div>
        
        {/* The array grid */}
        <div className={styles.arrayGrid}>
          {/* Column labels on top */}
          <div className={styles.columnLabels}>
            {Array.from({ length: cols }, (_, i) => (
              <div key={i} className={styles.columnLabel}>
                {i + 1}
              </div>
            ))}
          </div>
          
          {/* Grid of tiles */}
          <div 
            className={styles.grid}
            style={{ 
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gridTemplateRows: `repeat(${rows}, 1fr)`
            }}
          >
            {Array.from({ length: rows * cols }, (_, i) => {
              const row = Math.floor(i / cols);
              // Alternate colors by row to show grouping
              const isEvenRow = row % 2 === 0;

              return (
                <span 
                  key={i} 
                  className={`${styles.gridTile} ${isEvenRow ? styles.tileBlue : styles.tileYellow}`}
                >
                  {isEvenRow ? '🟦' : '🟨'}
                </span>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className={styles.countPrompt}>
        Count all the tiles!
      </div>
    </div>
  );
}

export default function MultiplicationHint({ problem }: MultiplicationHintProps) {
  if (problem.mode !== 'multiplication' || problem.level !== 1) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.hintIcon}>💡</span>
        <h3 className={styles.title}>Hint</h3>
      </div>
      
      <div className={styles.hints}>
        <MultiplicationArrayHint operands={problem.operands} />
      </div>
    </div>
  );
}
