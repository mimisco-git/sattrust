import type { Metadata } from 'next';
import { Syne, JetBrains_Mono, DM_Sans } from 'next/font/google';
import './globals.css';
import ClientLayout from './ClientLayout';

const syne = Syne({ subsets: ['latin'], variable: '--font-syne' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'SatTrust - Bitcoin-native Payroll & Reputation',
  description: 'Split BTC payments and build on-chain reputation on OP_NET',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${jetbrainsMono.variable} ${dmSans.variable}`}>
      <body className="font-sans bg-obsidian-950 text-white antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
