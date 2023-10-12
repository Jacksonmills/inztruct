import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/react';
import Providers from '@/components/providers';
import Header from '@/components/header';
import Footer from '@/components/footer';
import FloatingEmoji from '@/components/floating-emoji';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Inztruct',
  description: 'Inztruct is a tool for creating and sharing instructions.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Header />
          <main className="flex min-h-screen flex-col items-center p-6 md:p-24">
            {children}
          </main>
          <Footer />
          <Toaster />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
