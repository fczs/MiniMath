import Link from 'next/link';
import { getAvailableModes } from '@/lib/modes/registry';
import styles from './page.module.scss';

interface ModeCard {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

// Legacy color mapping to preserve existing UI colors
const legacyModeColors = {
  addition: 'var(--color-fun-green)',
  subtraction: 'var(--color-fun-blue)',
  multiplication: 'var(--color-fun-red)',
  division: 'var(--color-fun-yellow)',
  mixed: 'var(--color-fun-mint)',
  equation: 'var(--color-fun-purple)',
} as const;

// Legacy descriptions to preserve existing copy
const legacyDescriptions = {
  addition: 'Put numbers together!',
  subtraction: 'Take numbers away!',
  multiplication: 'Groups of numbers!',
  division: 'Share equally!',
  mixed: 'Mix it all up!',
  equation: 'Balance the scale!',
} as const;

// Convert mode registry to ModeCard format for display
const mathModes: ModeCard[] = getAvailableModes().map(config => ({
  id: config.id,
  name: config.displayName,
  icon: config.emoji,
  color: legacyModeColors[config.id] || 'var(--color-primary-500)',
  description: legacyDescriptions[config.id] || 'Coming soon!',
}));

export default function HomePage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.hero}>
          <h1 className={styles.title}>
            Welcome to <span className={styles.titleAccent}>MiniMath</span>! 🎉
          </h1>
          <p className={styles.subtitle}>
            Choose your math adventure and have fun learning!
          </p>
        </div>

        <section className={styles.modesSection} aria-labelledby="modes-heading">
          <h2 id="modes-heading" className={styles.modesTitle}>
            Math Mode Selection
          </h2>
          
          <div className={styles.modesGrid}>
            {mathModes.map((mode, index) => (
              <Link
                key={mode.id}
                href={`/play/${mode.id}`}
                className={styles.modeCard}
                style={{ '--card-color': mode.color } as React.CSSProperties}
              >
                <div 
                  className={`${styles.modeIcon} ${index < 4 ? styles.modeIconBright : ''}`} 
                  aria-hidden="true"
                >
                  {mode.icon}
                </div>
                <h3 className={styles.modeName}>{mode.name}</h3>
                <p className={styles.modeDescription}>{mode.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
      
      <footer className={styles.footer}>
        <p className={styles.footerText}>
          Made with 💖 by Stepan & Liza assisted by Dad and 🤖 ChatGPT.
        </p>
      </footer>
    </div>
  );
}
