import Footer from '@/components/footer';
import Header from '@/components/header';
import Providers from '@/components/providers';
import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

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
          <main className="flex min-h-screen flex-col items-center p-2 md:p-6 lg:p-24 overflow-hidden">
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
