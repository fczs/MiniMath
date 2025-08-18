import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';
import styles from './Header.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <Image 
            src="/img/math-logo-min.png" 
            alt="MiniMath logo" 
            width={32} 
            height={32} 
            className={styles.logoIcon}
          />
          <span className={styles.logoText}>MiniMath</span>
        </Link>
        
        <ThemeToggle />
      </div>
    </header>
  );
}
