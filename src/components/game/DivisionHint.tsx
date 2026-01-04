'use client';

import { Problem } from '@/lib/types';
import styles from './DivisionHint.module.scss';

interface DivisionHintProps {
  problem: Problem;
}

// Division hint component - shows division as grouping/sharing
function DivisionArrayHint({ operands }: { operands: number[] }) {
  const [dividend, divisor] = operands;
  const result = dividend / divisor;
  
  // For visualization, show dividend items being split into divisor groups
  const maxVisualize = 81; // Max items to visualize
  const canVisualize = dividend <= maxVisualize && divisor <= 9;
  
  if (!canVisualize) {
    return (
      <div className={styles.simpleHint}>
        <div className={styles.hintText}>
          Think: How many groups of {divisor} make {dividend}?
        </div>
      </div>
    );
  }
  
  // Show as: dividend items split into ? groups of divisor items each
  // Each group has divisor items, result is the number of groups
  const itemsPerGroup = divisor;
  const numberOfGroups = result;
  
  return (
    <div className={styles.arrayHint}>
      <div className={styles.hintText}>
        {dividend} ÷ {divisor} = ?
      </div>
      
      <div className={styles.explanation}>
        {dividend} split into groups of {divisor}:
      </div>
      
      <div className={styles.groupsContainer}>
        {Array.from({ length: numberOfGroups }, (_, groupIndex) => (
          <div key={groupIndex} className={styles.group}>
            <div className={styles.groupItems}>
              {Array.from({ length: itemsPerGroup }, (_, itemIndex) => (
                <span key={itemIndex} className={styles.tile}>
                  {groupIndex % 2 === 0 ? '🟦' : '🟨'}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.countPrompt}>
        How many groups?
      </div>
    </div>
  );
}

export default function DivisionHint({ problem }: DivisionHintProps) {
  if (problem.mode !== 'division' || problem.level !== 1) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.hintIcon}>💡</span>
        <h3 className={styles.title}>Hint</h3>
      </div>
      
      <div className={styles.hints}>
        <DivisionArrayHint operands={problem.operands} />
      </div>
    </div>
  );
}
