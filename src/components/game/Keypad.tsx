'use client';

import { useState } from 'react';
import styles from './Keypad.module.scss';

interface KeypadProps {
  onNumberInput: (digit: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
  onShowHint?: () => void;
  disabled?: boolean;
  value: string;
  canShowHint?: boolean;
}

export default function Keypad({ 
  onNumberInput, 
  onBackspace, 
  onSubmit, 
  onShowHint,
  disabled = false,
  value,
  canShowHint = false
}: KeypadProps) {
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const handleKeyPress = (key: string, action: () => void) => {
    if (disabled) return;
    
    setPressedKey(key);
    action();
    
    // Remove pressed state after animation
    setTimeout(() => setPressedKey(null), 150);
  };

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', null, '0', 'hint'] as const;

  return (
    <div className={styles.container}>
      <div className={styles.display}>
        <span className={styles.displayValue}>
          {value || '0'}
        </span>
      </div>
      
      <div className={styles.keypad}>
        {/* Number keys */}
        <div className={styles.numbersGrid}>
          {digits.map((digit, index) => {
            if (digit === null) {
              return <div key={`empty-${index}`} className={styles.emptySlot} />;
            }
            
            if (digit === 'hint') {
              return (
                <button
                  key="hint"
                  type="button"
                  className={`${styles.key} ${styles.hintKey} ${
                    pressedKey === 'hint' ? styles.pressed : ''
                  } ${!canShowHint ? styles.hiddenHint : ''}`}
                  onClick={() => handleKeyPress('hint', () => onShowHint?.())}
                  disabled={disabled || !canShowHint}
                  aria-label="Show hint"
                  style={{ opacity: canShowHint ? 1 : 0 }}
                >
                  💡
                </button>
              );
            }
            
            return (
              <button
                key={digit}
                type="button"
                className={`${styles.key} ${styles.numberKey} ${
                  pressedKey === digit ? styles.pressed : ''
                }`}
                onClick={() => handleKeyPress(digit, () => onNumberInput(digit))}
                disabled={disabled}
                aria-label={`Digit ${digit}`}
              >
                {digit}
              </button>
            );
          })}
        </div>
        
        {/* Action keys */}
        <div className={styles.actionsGrid}>
          <button
            type="button"
            className={`${styles.key} ${styles.actionKey} ${styles.backspaceKey} ${
              pressedKey === 'backspace' ? styles.pressed : ''
            }`}
            onClick={() => handleKeyPress('backspace', onBackspace)}
            disabled={disabled || value.trim() === ''}
            aria-label="Backspace"
          >
            <span className={styles.actionIcon}>⌫</span>
            <span className={styles.actionLabel}>Back</span>
          </button>
          
          <button
            type="button"
            className={`${styles.key} ${styles.actionKey} ${styles.submitKey} ${
              pressedKey === 'submit' ? styles.pressed : ''
            }`}
            onClick={() => handleKeyPress('submit', onSubmit)}
            disabled={disabled || value.trim() === ''}
            aria-label="Submit answer"
          >
            <span className={styles.actionIcon}>✓</span>
            <span className={styles.actionLabel}>Submit</span>
          </button>
        </div>
      </div>
    </div>
  );
}
