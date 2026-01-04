'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SessionStats, Mode } from '@/lib/types';
import { getLastSession } from '@/lib/engine/game';
import { getLastMode } from '@/lib/persist/local';
import styles from './page.module.scss';

// Achievement calculations
const getAchievements = (stats: SessionStats) => {
  const achievements = [];
  
  if (stats.accuracy >= 80) {
    achievements.push({
      icon: '🎯',
      title: 'Great Accuracy!',
      description: `Scored ${stats.accuracy}% correct`
    });
  }
  
  if (stats.avgTimeMs > 0 && stats.avgTimeMs < 20000) {
    achievements.push({
      icon: '⚡',
      title: 'Speed Star',
      description: 'Average time under 20 seconds'
    });
  }
  
  if (stats.bestStreak >= 5) {
    achievements.push({
      icon: '🔥',
      title: 'Hot Streak',
      description: `Got ${stats.bestStreak} questions right in a row!`
    });
  }
  
  if (stats.accuracy === 100) {
    achievements.push({
      icon: '🏆',
      title: 'Perfect Score!',
      description: 'Got every question correct!'
    });
  }
  
  if (achievements.length === 0) {
    achievements.push({
      icon: '🌟',
      title: 'Keep Practicing!',
      description: 'Every attempt makes you better!'
    });
  }
  
  return achievements;
};

const formatTime = (milliseconds: number): string => {
  if (milliseconds === 0) return '0s';
  
  const seconds = Math.round(milliseconds / 1000);

  if (seconds < 60) return `${seconds}s`;
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}m ${remainingSeconds}s`;
};

// Get mode display name
const getModeDisplayName = (mode: Mode): string => {
  switch (mode) {
    case 'addition':
      return 'Addition';
    case 'subtraction':
      return 'Subtraction';
    case 'multiplication':
      return 'Multiplication';
    case 'division':
      return 'Division';
    case 'mixed':
      return 'Mixed';
    case 'equation':
      return 'Equation';
    default:
      return 'Math';
  }
};

export default function ResultsPage() {
  const [sessionStats, setSessionStats] = useState<SessionStats | null>(null);
  const [lastMode, setLastMode] = useState<Mode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stats = getLastSession();
    const mode = getLastMode();

    setSessionStats(stats);
    setLastMode(mode);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.loadingIcon}>⏳</div>
          <p>Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!sessionStats) {
    return (
      <div className={styles.container}>
        <div className={styles.noData}>
          <div className={styles.noDataIcon}>📊</div>
          <h1 className={styles.noDataTitle}>No Session Data</h1>
          <p className={styles.noDataText}>
            It looks like you haven't completed a math session yet.
            Ready to start your first game?
          </p>
          <Link href="/" className={styles.primaryButton}>
            Start Playing
          </Link>
        </div>
      </div>
    );
  }

  const achievements = getAchievements(sessionStats);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.celebration}>
          <div className={styles.celebrationIcon} aria-hidden="true">
            🎉
          </div>
          <h1 className={styles.title}>Awesome job!</h1>
          <p className={styles.subtitle}>
            Here's how you did in your latest session
          </p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} aria-hidden="true">📊</div>
            <div className={styles.statValue}>{sessionStats.accuracy}%</div>
            <div className={styles.statLabel}>Accuracy</div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon} aria-hidden="true">✅</div>
            <div className={styles.statValue}>
              {sessionStats.correct}/{sessionStats.total}
            </div>
            <div className={styles.statLabel}>Questions Correct</div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon} aria-hidden="true">⏱️</div>
            <div className={styles.statValue}>{formatTime(sessionStats.avgTimeMs)}</div>
            <div className={styles.statLabel}>Avg Time</div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon} aria-hidden="true">🔥</div>
            <div className={styles.statValue}>{sessionStats.bestStreak}</div>
            <div className={styles.statLabel}>Best Streak</div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Your Achievements</h2>
          <div className={styles.achievementsGrid}>
            {achievements.map((achievement, index) => (
              <div key={index} className={styles.achievementCard}>
                <div className={styles.achievementIcon} aria-hidden="true">
                  {achievement.icon}
                </div>
                <h3 className={styles.achievementTitle}>{achievement.title}</h3>
                <p className={styles.achievementDescription}>
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {sessionStats.mistakes.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Review Your Mistakes</h2>
            <div className={styles.mistakesCard}>
              {sessionStats.mistakes.map((mistake, index) => (
                <div key={index} className={styles.mistakeItem}>
                  <div className={styles.mistakePrompt}>
                    {mistake.problem.prompt}
                  </div>
                  <div className={styles.mistakeAnswers}>
                    <div className={styles.mistakeAnswer}>
                      <span className={styles.mistakeLabel}>Your answer:</span>
                      <span className={styles.mistakeValue}>
                        {mistake.userAnswer ?? 'Skipped'}
                      </span>
                    </div>
                    <div className={styles.mistakeAnswer}>
                      <span className={styles.mistakeLabel}>Correct answer:</span>
                      <span className={styles.mistakeValue}>
                        {mistake.problem.answer}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Session Summary</h2>
          <div className={styles.summaryCard}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Total questions:</span>
              <span className={styles.summaryValue}>{sessionStats.total}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Correct answers:</span>
              <span className={styles.summaryValue}>{sessionStats.correct}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Accuracy:</span>
              <span className={styles.summaryValue}>{sessionStats.accuracy}%</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Best streak:</span>
              <span className={styles.summaryValue}>{sessionStats.bestStreak}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Average time:</span>
              <span className={styles.summaryValue}>{formatTime(sessionStats.avgTimeMs)}</span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Link href="/" className={styles.primaryButton}>
            Try Another Mode
          </Link>
          <Link 
            href={lastMode ? `/play/${lastMode}` : '/play/addition'} 
            className={styles.secondaryButton}
          >
            Play {lastMode ? getModeDisplayName(lastMode) : 'Addition'} Again
          </Link>
        </div>
      </div>
    </div>
  );
}
