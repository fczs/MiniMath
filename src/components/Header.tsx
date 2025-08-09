import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function Header() {
  return (
    <header className="w-full sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-background/80 bg-background border-b border-black/5 dark:border-white/10">
      <div className="mx-auto w-full max-w-screen-xl px-4 xs:px-6 sm:px-8 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-base sm:text-lg font-medium rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--ring)]"
        >
          MiniMath
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
