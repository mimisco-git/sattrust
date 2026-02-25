'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Suspense, useState } from 'react';

const WalletConnectProvider = dynamic(
  () => import('@btc-vision/walletconnect').then(m => m.WalletConnectProvider),
  { ssr: false }
);

const WalletButton = dynamic(
  () => import('../components/WalletButton'),
  { ssr: false }
);

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <WalletConnectProvider theme="dark">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-obsidian-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-bitcoin-400 text-2xl">⚡</span>
            <span className="font-display font-bold text-xl text-white">SatTrust</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/leaderboard" className="text-sm text-white/60 hover:text-white transition-colors">Leaderboard</Link>
            <Link href="/profile" className="text-sm text-white/60 hover:text-white transition-colors">Profile</Link>
            <Link href="/create" className="text-sm text-white/60 hover:text-white transition-colors">Create Deal</Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Suspense fallback={<button className="btn-ghost text-sm px-4 py-2">Connect</button>}>
              <WalletButton />
            </Suspense>
            {/* Hamburger */}
            <button
              className="md:hidden p-2 text-white/60 hover:text-white"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12"/>
                </svg>
              ) : (
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 12h18M3 6h18M3 18h18"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/5 bg-obsidian-900/95 backdrop-blur-xl px-4 py-4 flex flex-col gap-4">
            <Link href="/leaderboard" onClick={() => setMenuOpen(false)} className="text-sm text-white/70 hover:text-white transition-colors py-2">🏆 Leaderboard</Link>
            <Link href="/profile" onClick={() => setMenuOpen(false)} className="text-sm text-white/70 hover:text-white transition-colors py-2">👤 Profile</Link>
            <Link href="/create" onClick={() => setMenuOpen(false)} className="text-sm text-white/70 hover:text-white transition-colors py-2">⚡ Create Deal</Link>
          </div>
        )}
      </nav>
      <main className="pt-16">{children}</main>
    </WalletConnectProvider>
  );
}
