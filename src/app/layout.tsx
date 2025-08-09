import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../styles/globals.css';
import Header from '@/components/Header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'MiniMath',
  description: 'Practice math with a friendly, modern UI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-dvh flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-black/5 dark:border-white/10">
            <div className="mx-auto w-full max-w-screen-xl px-4 xs:px-6 sm:px-8 py-6 text-sm text-foreground/80">
              You’ve got this. Keep going!
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
