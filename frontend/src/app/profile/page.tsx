'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import { computeSatScore, DEMO_WALLETS, formatSats, formatAddress, LEVEL_COLORS, LEVEL_ICONS, type WalletStats } from '../../lib/sattrust';

export default function ProfilePage() {
  const [searchAddr, setSearchAddr] = useState('');
  const [activeWallet, setActiveWallet] = useState<{ address: string; stats: WalletStats; label?: string } | null>(null);
  const loadDemo = (demo: typeof DEMO_WALLETS[0]) => setActiveWallet({ address: demo.address, stats: demo.stats, label: demo.label });
  const breakdown = activeWallet ? computeSatScore(activeWallet.stats) : null;
  const lc = breakdown ? LEVEL_COLORS[breakdown.level] : '#f7931a';

  return (
    <div style={{ position: 'relative' }}>
      <div className="glow-orb-cyan" style={{ top: -100, right: 0 }} />

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#00d4ff', letterSpacing: '0.1em', marginBottom: 8 }}>REPUTATION</div>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 40, letterSpacing: '-0.04em', marginBottom: 8 }}>
          Wallet <span className="text-gradient-cyan">Profile</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15 }}>Look up any Bitcoin wallet's on-chain SatTrust reputation score.</p>
      </div>

      {/* Search */}
      <div className="card-glass" style={{ padding: 24, marginBottom: 32 }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <input className="input-premium" placeholder="Enter Bitcoin / OP_NET wallet address…" value={searchAddr} onChange={e => setSearchAddr(e.target.value)} style={{ flex: 1 }} />
          <button className="btn-bitcoin" onClick={() => { const d = DEMO_WALLETS.find(d => d.address === searchAddr.trim()); if (d) loadDemo(d); }}>Look Up</button>
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.2)', marginBottom: 10, letterSpacing: '0.06em' }}>DEMO WALLETS</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {DEMO_WALLETS.map(d => (
            <button key={d.address} className="btn-ghost" onClick={() => loadDemo(d)} style={{ fontSize: 12, padding: '6px 14px' }}>{d.label}</button>
          ))}
        </div>
      </div>

      {activeWallet && breakdown && (
        <div>
          {/* Score Hero */}
          <div className="card-premium" style={{ padding: 36, marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Score circle */}
              <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
                <svg viewBox="0 0 120 120" style={{ width: 120, height: 120, transform: 'rotate(-90deg)' }}>
                  <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                  <circle cx="60" cy="60" r="52" fill="none" stroke="url(#scoreGrad)" strokeWidth="6"
                    strokeDasharray={`${2 * Math.PI * 52}`}
                    strokeDashoffset={`${2 * Math.PI * 52 * (1 - breakdown.score / 1000)}`}
                    strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)' }} />
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f7931a" />
                      <stop offset="100%" stopColor="#00d4ff" />
                    </linearGradient>
                  </defs>
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 26, color: lc, letterSpacing: '-0.03em' }}>{breakdown.score}</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}>SATSCORE</div>
                </div>
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
                  <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 20 }}>{activeWallet.label || formatAddress(activeWallet.address)}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontFamily: 'JetBrains Mono, monospace', background: `${lc}15`, border: `1px solid ${lc}30`, color: lc }}>
                    {LEVEL_ICONS[breakdown.level]} {breakdown.level}
                  </span>
                </div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.2)', wordBreak: 'break-all', marginBottom: 20 }}>{activeWallet.address}</div>
                <div className="score-track" style={{ marginBottom: 6 }}>
                  <div className="score-fill" style={{ width: `${breakdown.score / 10}%` }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>
                  <span>0</span><span>500</span><span>1000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
            {[
              { label: 'Deals Completed', value: activeWallet.stats.dealsCompleted, color: '#f7931a' },
              { label: 'Deals as Payer', value: activeWallet.stats.dealsAsPayer, color: '#00d4ff' },
              { label: 'Total Received', value: formatSats(activeWallet.stats.totalReceived), color: '#f7931a' },
              { label: 'Total Paid Out', value: formatSats(activeWallet.stats.totalPaid), color: '#00d4ff' },
              { label: 'Unique Payers', value: activeWallet.stats.uniquePayers, color: '#f5c842' },
              { label: 'Disputes', value: activeWallet.stats.disputes, color: activeWallet.stats.disputes === 0 ? '#00ff88' : '#ff3366' },
              { label: 'Late Releases', value: activeWallet.stats.lateReleases, color: activeWallet.stats.lateReleases === 0 ? '#00ff88' : '#ff3366' },
              { label: 'First Activity', value: new Date(activeWallet.stats.firstActivity * 1000).toLocaleDateString(), color: 'rgba(255,255,255,0.6)' },
            ].map(s => (
              <div key={s.label} className="card-glass" style={{ padding: '16px', borderRadius: 12 }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em', marginBottom: 6 }}>{s.label.toUpperCase()}</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Score Breakdown */}
          <div className="card-glass" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#f7931a', letterSpacing: '0.08em', marginBottom: 4 }}>SCORE ENGINE</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18 }}>SatScore Breakdown</div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {['Factor', 'Formula', 'Points'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 20px', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: '✅ Completed Deals', formula: `${activeWallet.stats.dealsCompleted} × 10`, value: `+${breakdown.completionPoints}`, color: '#00ff88' },
                  { label: '🤝 Unique Payers', formula: `${activeWallet.stats.uniquePayers} × 25`, value: `+${breakdown.payerPoints}`, color: '#00ff88' },
                  { label: '💰 Volume Bonus', formula: `${Math.floor(Number(activeWallet.stats.totalReceived) / 1_000_000)} M-sats × 5`, value: `+${breakdown.volumeBonus}`, color: '#00ff88' },
                  { label: '⚠️ Dispute Penalty', formula: `${activeWallet.stats.disputes} × −40`, value: `-${breakdown.disputePenalty}`, color: '#ff3366' },
                  { label: '⏰ Late Penalty', formula: `${activeWallet.stats.lateReleases} × −20`, value: `-${breakdown.latePenalty}`, color: '#ff3366' },
                ].map(row => (
                  <tr key={row.label} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '14px 20px', fontFamily: 'DM Sans, sans-serif', fontSize: 14 }}>{row.label}</td>
                    <td style={{ padding: '14px 20px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{row.formula}</td>
                    <td style={{ padding: '14px 20px', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: row.color }}>{row.value}</td>
                  </tr>
                ))}
                <tr style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <td style={{ padding: '16px 20px', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15 }}>Final SatScore</td>
                  <td />
                  <td style={{ padding: '16px 20px', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 24, color: lc }}>{breakdown.score} <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>/ 1000</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!activeWallet && (
        <div style={{ padding: '16px 20px', borderRadius: 12, background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(0,212,255,0.7)' }}>
          👆 Enter a wallet address or select a demo wallet above to view their SatTrust reputation.
        </div>
      )}
    </div>
  );
}
