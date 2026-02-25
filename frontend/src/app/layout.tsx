import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SatTrust — Bitcoin-Native Payroll & Reputation',
  description: 'Split BTC payments to any team. Build verifiable on-chain reputation. Powered by OP_NET on Bitcoin Layer 1.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="nav-premium">
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #f7931a, #ffaa44)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#080810', boxShadow: '0 4px 12px rgba(247,147,26,0.4)' }}>⚡</div>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', color: 'white' }}>Sat<span style={{ color: '#f7931a' }}>Trust</span></span>
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {[{ href: '/create', label: 'Create Deal' }, { href: '/leaderboard', label: 'Leaderboard' }, { href: '/profile', label: 'Profile' }].map(link => (
                <a key={link.href} href={link.href} style={{ fontFamily: 'Syne, sans-serif', fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.55)', textDecoration: 'none', padding: '6px 14px', borderRadius: 8 }}>{link.label}</a>
              ))}
              <a href="/create" className="btn-bitcoin" style={{ marginLeft: 8, padding: '8px 18px', fontSize: 13 }}>+ New Deal</a>
            </div>
          </div>
        </nav>
        <main style={{ maxWidth: 1200, margin: '0 auto', padding: '96px 24px 48px' }}>
          {children}
        </main>
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '32px 24px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.05em' }}>
            BUILT ON BITCOIN LAYER 1 VIA OP_NET · BY AMAKA | MCJEH DIGITAL · VIBECODING CHALLENGE 2026
          </div>
        </footer>
      </body>
    </html>
  );
}
