import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdditionGame from './AdditionGame';
import styles from './page.module.scss';

interface PageProps {
  params: Promise<{
    mode: string;
  }>;
}

const validModes = ['addition', 'subtraction', 'multiplication', 'division', 'mixed', 'equations'];

const modeInfo = {
  addition: {
    name: 'Addition',
    icon: '➕',
    color: 'var(--color-fun-green)',
    description: 'Put numbers together to find the sum!'
  },
  subtraction: {
    name: 'Subtraction',
    icon: '➖',
    color: 'var(--color-fun-orange)',
    description: 'Take numbers away to find the difference!'
  },
  multiplication: {
    name: 'Multiplication',
    icon: '✖️',
    color: 'var(--color-fun-purple)',
    description: 'Find how many in groups of numbers!'
  },
  division: {
    name: 'Division',
    icon: '➗',
    color: 'var(--color-fun-pink)',
    description: 'Share numbers equally into groups!'
  },
  mixed: {
    name: 'Mixed',
    icon: '🎲',
    color: 'var(--color-fun-blue)',
    description: 'Practice all operations together!'
  },
  equations: {
    name: 'Equations',
    icon: '⚖️',
    color: 'var(--color-fun-yellow)',
    description: 'Balance the equation scale!'
  },
};

export default async function PlayPage({ params }: PageProps) {
  const { mode } = await params;
  
  if (!validModes.includes(mode)) {
    notFound();
  }
  
  const currentMode = modeInfo[mode as keyof typeof modeInfo];

  // For addition mode, render the full game
  if (mode === 'addition') {
    return <AdditionGame />;
  }

  // For other modes, show placeholder
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          <span aria-hidden="true">←</span>
          Back to Modes
        </Link>
        
        <div 
          className={styles.modeInfo}
          style={{ '--mode-color': currentMode.color } as React.CSSProperties}
        >
          <div className={styles.modeIcon} aria-hidden="true">
            <div className={['addition', 'subtraction', 'multiplication', 'division'].includes(mode) ? styles.modeIconBright : ''}>
              {currentMode.icon}
            </div>
          </div>
          <div>
            <h1 className={styles.modeTitle}>
              {currentMode.name} Game
            </h1>
            <p className={styles.modeDescription}>
              {currentMode.description}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.gameArea}>
        <div className={styles.placeholder}>
          <div className={styles.placeholderIcon} aria-hidden="true">
            🎮
          </div>
          <h2 className={styles.placeholderTitle}>
            Game Screen: {currentMode.name}
          </h2>
          <p className={styles.placeholderText}>
            This is where the {currentMode.name.toLowerCase()} game will be implemented. 
            Players will practice {currentMode.name.toLowerCase()} problems with 
            instant feedback and fun animations!
          </p>
          
          <div className={styles.placeholderFeatures}>
            <h3>Coming Soon:</h3>
            <ul>
              <li>Interactive math problems</li>
              <li>Three difficulty levels</li>
              <li>Instant feedback with hints</li>
              <li>Visual learning aids</li>
              <li>Progress tracking</li>
            </ul>
          </div>
          
          <Link href="/results" className={styles.mockButton}>
            Preview Results Page
          </Link>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { mode } = await params;
  
  if (!validModes.includes(mode)) {
    return {
      title: 'Mode Not Found - MiniMath',
    };
  }
  
  const currentMode = modeInfo[mode as keyof typeof modeInfo];
  
  return {
    title: `${currentMode.name} Game - MiniMath`,
    description: `Practice ${currentMode.name.toLowerCase()} with fun, interactive math games for kids. ${currentMode.description}`,
  };
}
