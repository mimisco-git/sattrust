'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Suspense } from 'react';

const WalletConnectProvider = dynamic(
  () => import('@btc-vision/walletconnect').then(m => m.WalletConnectProvider),
  { ssr: false }
);

const WalletButton = dynamic(
  () => import('../components/WalletButton'),
  { ssr: false }
);

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <WalletConnectProvider theme="dark">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-obsidian-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-bitcoin-400 text-2xl">⚡</span>
            <span className="font-display font-bold text-xl text-white">SatTrust</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/leaderboard" className="text-sm text-white/60 hover:text-white transition-colors">Leaderboard</Link>
            <Link href="/profile" className="text-sm text-white/60 hover:text-white transition-colors">Profile</Link>
            <Link href="/create" className="text-sm text-white/60 hover:text-white transition-colors">Create Deal</Link>
          </div>
          <Suspense fallback={<button className="btn-ghost text-sm px-4 py-2">Connect Wallet</button>}>
            <WalletButton />
          </Suspense>
        </div>
      </nav>
      <main className="pt-16">{children}</main>
    </WalletConnectProvider>
  );
}
