import Link from 'next/link';
import { notFound } from 'next/navigation';
import GameShell from '@/components/game/GameShell';
import { getModeConfig, getImplementedModes } from '@/lib/modes/registry';
import { Mode } from '@/lib/types';
import styles from './page.module.scss';

interface PageProps {
  params: Promise<{
    mode: string;
  }>;
}

// Get implemented modes from registry
const implementedModes = getImplementedModes();
const validModes = implementedModes.map(config => config.id) as string[];

// Legacy mode info for color mapping (to preserve existing colors)
const legacyModeColors = {
  addition: 'var(--color-fun-green)',
  subtraction: 'var(--color-fun-blue)',
  multiplication: 'var(--color-fun-red)',
  division: 'var(--color-fun-yellow)',
  mixed: 'var(--color-fun-mint)',
  equation: 'var(--color-fun-purple)',
} as const;

export default async function PlayPage({ params }: PageProps) {
  const { mode } = await params;
  
  if (!validModes.includes(mode)) {
    notFound();
  }
  
  const modeConfig = getModeConfig(mode as Mode);

  // For implemented modes, use GameShell
  if (validModes.includes(mode)) {
    return <GameShell mode={mode as Mode} />;
  }

  // For unimplemented modes, show placeholder (this shouldn't be reached with current logic)
  const legacyColor = legacyModeColors[mode as keyof typeof legacyModeColors] || 'var(--color-primary-500)';
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          <span aria-hidden="true">←</span>
          Back to Modes
        </Link>
        
        <div 
          className={styles.modeInfo}
          style={{ '--mode-color': legacyColor } as React.CSSProperties}
        >
          <div className={styles.modeIcon} aria-hidden="true">
            <div className={['addition', 'subtraction', 'multiplication', 'division'].includes(mode) ? styles.modeIconBright : ''}>
              {modeConfig.emoji}
            </div>
          </div>
          <div>
            <h1 className={styles.modeTitle}>
              {modeConfig.displayName} Game
            </h1>
            <p className={styles.modeDescription}>
              Coming Soon!
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
            Game Screen: {modeConfig.displayName}
          </h2>
          <p className={styles.placeholderText}>
            This is where the {modeConfig.displayName.toLowerCase()} game will be implemented. 
            Players will practice {modeConfig.displayName.toLowerCase()} problems with 
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
  
  const modeConfig = getModeConfig(mode as Mode);
  
  return {
    title: `${modeConfig.displayName} Game - MiniMath`,
    description: `Practice ${modeConfig.displayName.toLowerCase()} with fun, interactive math games for kids.`,
  };
}
