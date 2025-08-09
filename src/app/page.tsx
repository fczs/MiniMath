import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

const modes = [
  {
    key: 'classic',
    title: 'Classic',
    desc: 'Relaxed pace, foundational practice.',
  },
  { key: 'timed', title: 'Timed', desc: 'Race against the clock.' },
  { key: 'challenge', title: 'Challenge', desc: 'A streak without mistakes.' },
];

const stylesByMode: Record<
  string,
  {
    border: string;
    bg: string;
    hover: string;
    ring: string;
    badgeBorder: string;
    badgeHover: string;
  }
> = {
  classic: {
    border: 'border-cyan-400 dark:border-cyan-400',
    bg: 'bg-cyan-50/70 dark:bg-cyan-950/20',
    hover: 'hover:bg-cyan-50 dark:hover:bg-cyan-950/30',
    ring: 'focus-visible:ring-cyan-500 dark:focus-visible:ring-cyan-300',
    badgeBorder: 'border-cyan-300 dark:border-cyan-800',
    badgeHover: 'group-hover:bg-cyan-100 dark:group-hover:bg-cyan-900/40',
  },
  timed: {
    border: 'border-emerald-400 dark:border-emerald-400',
    bg: 'bg-emerald-50/70 dark:bg-emerald-950/20',
    hover: 'hover:bg-emerald-50 dark:hover:bg-emerald-950/30',
    ring: 'focus-visible:ring-emerald-500 dark:focus-visible:ring-emerald-300',
    badgeBorder: 'border-emerald-300 dark:border-emerald-800',
    badgeHover: 'group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40',
  },
  challenge: {
    border: 'border-violet-400 dark:border-violet-400',
    bg: 'bg-violet-50/70 dark:bg-violet-950/20',
    hover: 'hover:bg-violet-50 dark:hover:bg-violet-950/30',
    ring: 'focus-visible:ring-violet-500 dark:focus-visible:ring-violet-300',
    badgeBorder: 'border-violet-300 dark:border-violet-800',
    badgeHover: 'group-hover:bg-violet-100 dark:group-hover:bg-violet-900/40',
  },
};

export default function Home() {
  return (
    <section className="mx-auto w-full max-w-screen-lg px-4 xs:px-6 sm:px-8 py-10 sm:py-14">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight mb-6">
        Choose a mode
      </h1>
      <p className="text-foreground/80 mb-8">
        Start with what feels comfortable. We’re here and cheering for your
        progress.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {modes.map((m) => {
          const s = stylesByMode[m.key] ?? {
            border: 'border-[var(--border)]',
            bg: 'bg-[var(--surface-2)]',
            hover: 'hover:bg-[var(--surface-2-hover)]',
            ring: 'focus-visible:ring-[var(--ring)]',
            badgeBorder: 'border-[var(--border)]',
            badgeHover: 'group-hover:bg-[var(--surface-2-hover)]',
          };

          return (
            <Link
              key={m.key}
              href={`/play/${m.key}`}
              className={`group rounded-2xl border p-5 sm:p-6 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${s.border} ${s.bg} ${s.hover} ${s.ring}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg md:text-xl font-medium mb-1">
                    {m.title}
                  </div>
                  <div className="text-sm text-foreground/70">{m.desc}</div>
                </div>
                <span
                  aria-hidden
                  className={`h-11 w-11 min-h-11 min-w-11 rounded-full border inline-flex items-center justify-center ${s.badgeBorder} ${s.badgeHover}`}
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-10">
        <Link
          href="/results"
          className="inline-flex items-center justify-center h-12 min-h-12 px-5 rounded-full border border-[var(--border)] hover:bg-[var(--surface-2-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--ring)]"
        >
          Results
        </Link>
      </div>
    </section>
  );
}
