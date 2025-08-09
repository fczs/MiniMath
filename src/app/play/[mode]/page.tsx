import { notFound } from 'next/navigation';

type PageProps = {
  params: Promise<{ mode: string }>;
};

const allowed = new Set(['classic', 'timed', 'challenge']);

export default async function PlayPage({ params }: PageProps) {
  const { mode } = await params;

  if (!allowed.has(mode)) notFound();

  return (
    <section className="mx-auto w-full max-w-screen-lg px-4 xs:px-6 sm:px-8 py-10 sm:py-14">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight mb-2">
        Mode: {mode}
      </h1>
      <p className="text-foreground/80 mb-8">
        Game screen placeholder for now.
      </p>

      <div className="rounded-2xl border border-[var(--border)] p-6 bg-[var(--surface-2)]">
        The game UI will appear here soon.
      </div>
    </section>
  );
}
