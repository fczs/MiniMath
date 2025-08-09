'use client';

import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';

function getSystemPrefersDark(): boolean {
  if (typeof window === 'undefined') return false;

  return (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Initialize from localStorage or system preference
  useEffect(() => {
    const stored =
      typeof window !== 'undefined'
        ? window.localStorage.getItem('theme')
        : null;
    const initialDark = stored ? stored === 'dark' : getSystemPrefersDark();

    setIsDark(initialDark);
    document.documentElement.classList.toggle('dark', initialDark);
  }, []);

  // Persist and apply class on change
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
  }, [isDark]);

  // Listen to system preference changes and respect when user didn't explicitly choose
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      const stored = window.localStorage.getItem('theme');

      if (!stored) {
        setIsDark(media.matches);
      }
    };

    media.addEventListener('change', onChange);

    return () => media.removeEventListener('change', onChange);
  }, []);

  return (
    <button
      type="button"
      aria-pressed={isDark}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={() => setIsDark((v) => !v)}
      className="h-11 min-h-11 w-11 min-w-11 xs:w-12 xs:h-12 inline-flex items-center justify-center rounded-full border border-black/10 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-foreground"
    >
      <span className="sr-only">{isDark ? 'Light theme' : 'Dark theme'}</span>
      {isDark ? (
        <SunIcon className="h-5 w-5" aria-hidden />
      ) : (
        <MoonIcon className="h-5 w-5" aria-hidden />
      )}
    </button>
  );
}
