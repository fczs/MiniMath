import { SessionStats, Mode, Level } from '../types';

// Storage keys - maintain existing keys for compatibility
export const STORAGE_KEYS = {
  LAST_SESSION: 'minimath:last-session',
  LAST_MODE: 'minimath:last-mode', 
  LAST_LEVEL: 'minimath:last-level',
  THEME: 'theme', // Keep existing theme key
  KEYPAD_MODE: 'minimath-keypad-mode', // Keep existing keypad key
} as const;

/**
 * Session persistence
 */
export const saveLastSession = (stats: SessionStats): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_SESSION, JSON.stringify(stats));
  } catch (error) {
    console.warn('Failed to save session stats:', error);
  }
};

export const getLastSession = (): SessionStats | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LAST_SESSION);

    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn('Failed to load last session:', error);

    return null;
  }
};

/**
 * Mode/Level preferences
 */
export const saveLastMode = (mode: Mode): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_MODE, mode);
  } catch (error) {
    console.warn('Failed to save last mode:', error);
  }
};

export const getLastMode = (): Mode | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LAST_MODE);

    return stored as Mode || null;
  } catch (error) {
    console.warn('Failed to load last mode:', error);

    return null;
  }
};

export const saveLastLevel = (level: Level): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_LEVEL, level.toString());
  } catch (error) {
    console.warn('Failed to save last level:', error);
  }
};

export const getLastLevel = (): Level | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LAST_LEVEL);
    const parsed = stored ? parseInt(stored, 10) : null;

    return (parsed === 1 || parsed === 2 || parsed === 3) ? parsed : null;
  } catch (error) {
    console.warn('Failed to load last level:', error);

    return null;
  }
};

/**
 * Theme persistence (maintain existing behavior)
 */
export const saveTheme = (theme: 'light' | 'dark'): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (error) {
    console.warn('Failed to save theme:', error);
  }
};

export const getTheme = (): 'light' | 'dark' | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.THEME);

    return (stored === 'light' || stored === 'dark') ? stored : null;
  } catch (error) {
    console.warn('Failed to load theme:', error);

    return null;
  }
};

/**
 * Keypad mode persistence (maintain existing behavior)
 */
export const saveKeypadMode = (useKeypad: boolean): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.KEYPAD_MODE, useKeypad.toString());
  } catch (error) {
    console.warn('Failed to save keypad mode:', error);
  }
};

export const getKeypadMode = (): boolean => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.KEYPAD_MODE);

    return stored === null ? true : stored === 'true'; // Default to true if not set
  } catch (error) {
    console.warn('Failed to load keypad mode:', error);

    return true;
  }
};

/**
 * Clear all stored data (useful for testing/reset)
 */
export const clearAllData = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.warn('Failed to clear stored data:', error);
  }
};
