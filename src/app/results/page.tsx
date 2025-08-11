import Link from 'next/link';
import { Metadata } from 'next';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'Session Summary - MiniMath',
  description: 'View your math learning progress and achievements in MiniMath.',
};

// Mock data for demonstration
const mockResults = {
  mode: 'Addition',
  accuracy: 85,
  totalQuestions: 20,
  correct: 17,
  incorrect: 3,
  timeSpent: '5m 32s',
  longestStreak: 8,
  averageTime: '16s',
  difficulty: '2-digit numbers'
};

const achievements = [
  { icon: '🎯', title: 'Great Accuracy!', description: 'Scored over 80% correct' },
  { icon: '⚡', title: 'Speed Star', description: 'Average time under 20 seconds' },
  { icon: '🔥', title: 'Hot Streak', description: 'Got 8 questions right in a row!' },
];

export default function ResultsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.celebration}>
          <div className={styles.celebrationIcon} aria-hidden="true">
            🎉
          </div>
          <h1 className={styles.title}>Awesome job!</h1>
          <p className={styles.subtitle}>
            Here's how you did in your {mockResults.mode} session
          </p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} aria-hidden="true">📊</div>
            <div className={styles.statValue}>{mockResults.accuracy}%</div>
            <div className={styles.statLabel}>Accuracy</div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon} aria-hidden="true">✅</div>
            <div className={styles.statValue}>
              {mockResults.correct}/{mockResults.totalQuestions}
            </div>
            <div className={styles.statLabel}>Questions Correct</div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon} aria-hidden="true">⏱️</div>
            <div className={styles.statValue}>{mockResults.timeSpent}</div>
            <div className={styles.statLabel}>Time Spent</div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon} aria-hidden="true">🔥</div>
            <div className={styles.statValue}>{mockResults.longestStreak}</div>
            <div className={styles.statLabel}>Longest Streak</div>
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

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Session Summary</h2>
          <div className={styles.summaryCard}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Mode:</span>
              <span className={styles.summaryValue}>{mockResults.mode}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Difficulty:</span>
              <span className={styles.summaryValue}>{mockResults.difficulty}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Average time per question:</span>
              <span className={styles.summaryValue}>{mockResults.averageTime}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Questions answered:</span>
              <span className={styles.summaryValue}>{mockResults.totalQuestions}</span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Link href="/" className={styles.primaryButton}>
            Try Another Mode
          </Link>
          <button className={styles.secondaryButton} type="button">
            Play Again
          </button>
        </div>

        <div className={styles.placeholder}>
          <h3 className={styles.placeholderTitle}>
            Placeholder: Session Summary
          </h3>
          <p className={styles.placeholderText}>
            This page shows mock data for demonstration. In the full implementation, 
            this will display real statistics from the player's game session, 
            including accuracy, time spent, streak information, and personalized feedback.
          </p>
        </div>
      </div>
    </div>
  );
}
