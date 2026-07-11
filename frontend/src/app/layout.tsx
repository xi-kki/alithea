import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Alithea — Memory Training Arena',
  description: 'Train your memory. Prove your skill. Earn your reward. Will you remember?',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-alithea-darker text-white min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
