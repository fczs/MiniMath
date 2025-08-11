import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import styles from './Header.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon} aria-hidden="true">🧮</span>
          <span className={styles.logoText}>MiniMath</span>
        </Link>
        
        <ThemeToggle />
      </div>
    </header>
  );
}
