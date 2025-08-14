'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './AnswerInput.module.scss';

interface AnswerInputProps {
  onSubmit: (answer: number | null) => void;
  disabled?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}

export default function AnswerInput({ 
  onSubmit, 
  disabled = false, 
  placeholder = "Your answer",
  autoFocus = true 
}: AnswerInputProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [autoFocus, disabled]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Only allow digits, minus sign at start, and empty string
    const regex = /^-?\d*$/;

    if (regex.test(inputValue)) {
      setValue(inputValue);
    }
  };

  const handleSubmit = () => {
    const trimmed = value.trim();
    
    if (trimmed === '') {
      onSubmit(null);
    } else {
      const numValue = parseInt(trimmed, 10);

      if (!isNaN(numValue)) {
        onSubmit(numValue);
      } else {
        onSubmit(null);
      }
    }
    
    setValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !disabled) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={styles.container}>
      <label htmlFor="answer-input" className={styles.label}>
        Your Answer
      </label>
      
      <div className={styles.inputContainer}>
        <input
          ref={inputRef}
          id="answer-input"
          type="text"
          inputMode="numeric"
          value={value}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className={styles.input}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        />
        
        <button
          type="button"
          onClick={handleSubmit}
          disabled={disabled}
          className={styles.submitButton}
          aria-label="Submit answer"
        >
          <span className={styles.submitIcon}>✓</span>
        </button>
      </div>
      
      <div className={styles.hint}>
        Press Enter or tap ✓ to submit
      </div>
    </div>
  );
}
