'use client';

import { useState } from 'react';
import styles from './Keypad.module.scss';

interface KeypadProps {
  onNumberInput: (digit: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
  disabled?: boolean;
  value: string;
}

export default function Keypad({ 
  onNumberInput, 
  onBackspace, 
  onSubmit, 
  disabled = false,
  value 
}: KeypadProps) {
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const handleKeyPress = (key: string, action: () => void) => {
    if (disabled) return;
    
    setPressedKey(key);
    action();
    
    // Remove pressed state after animation
    setTimeout(() => setPressedKey(null), 150);
  };

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

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
          {digits.map((digit) => (
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
          ))}
        </div>
        
        {/* Action keys */}
        <div className={styles.actionsGrid}>
          <button
            type="button"
            className={`${styles.key} ${styles.actionKey} ${styles.backspaceKey} ${
              pressedKey === 'backspace' ? styles.pressed : ''
            }`}
            onClick={() => handleKeyPress('backspace', onBackspace)}
            disabled={disabled}
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
            disabled={disabled}
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
