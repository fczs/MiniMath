import Link from 'next/link';
import styles from './page.module.scss';

interface ModeCard {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

const mathModes: ModeCard[] = [
  {
    id: 'addition',
    name: 'Addition',
    icon: '➕',
    color: 'var(--color-fun-green)',
    description: 'Put numbers together!'
  },
  {
    id: 'subtraction',
    name: 'Subtraction',
    icon: '➖',
    color: 'var(--color-fun-orange)',
    description: 'Take numbers away!'
  },
  {
    id: 'multiplication',
    name: 'Multiplication',
    icon: '✖️',
    color: 'var(--color-fun-purple)',
    description: 'Groups of numbers!'
  },
  {
    id: 'division',
    name: 'Division',
    icon: '➗',
    color: 'var(--color-fun-pink)',
    description: 'Share equally!'
  },
  {
    id: 'mixed',
    name: 'Mixed',
    icon: '🎲',
    color: 'var(--color-fun-blue)',
    description: 'Mix it all up!'
  },
  {
    id: 'equations',
    name: 'Equations',
    icon: '⚖️',
    color: 'var(--color-fun-yellow)',
    description: 'Balance the scale!'
  },
];

export default function HomePage() {
  return (
    <div className={styles.container}>
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
  );
}
