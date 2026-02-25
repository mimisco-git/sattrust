'use client';
export const dynamic = 'force-dynamic';
import { DEMO_WALLETS, computeSatScore, formatSats, formatAddress, LEVEL_COLORS, LEVEL_ICONS } from '../../lib/sattrust';

export default function LeaderboardPage() {
  const ranked = [...DEMO_WALLETS].map(w => ({ ...w, breakdown: computeSatScore(w.stats) })).sort((a, b) => b.breakdown.score - a.breakdown.score);
  const RANK_STYLES = [
    { color: '#f5c842', bg: 'rgba(245,200,66,0.1)', border: 'rgba(245,200,66,0.25)', icon: '🥇' },
    { color: 'rgba(255,255,255,0.6)', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.15)', icon: '🥈' },
    { color: '#cd7f32', bg: 'rgba(205,127,50,0.1)', border: 'rgba(205,127,50,0.25)', icon: '🥉' },
  ];

  return (
    <div style={{ position: 'relative' }}>
      <div className="glow-orb-bitcoin" style={{ top: -100, right: 0 }} />

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#f7931a', letterSpacing: '0.1em', marginBottom: 8 }}>RANKINGS</div>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 40, letterSpacing: '-0.04em', marginBottom: 8 }}>
          <span className="text-gradient-bitcoin">Leaderboard</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15 }}>Top Bitcoin wallets by SatScore — earned through real on-chain deal activity.</p>
      </div>

      {/* Top 3 podium */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 32 }}>
        {ranked.slice(0, 3).map((w, i) => {
          const rs = RANK_STYLES[i];
          return (
            <div key={w.address} className="card-premium" style={{ padding: 24, border: `1px solid ${rs.border}`, background: rs.bg, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{rs.icon}</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{w.label}</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.25)', marginBottom: 16 }}>{formatAddress(w.address)}</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 36, color: rs.color, letterSpacing: '-0.04em' }}>{w.breakdown.score}</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.06em', marginBottom: 12 }}>SATSCORE</div>
              <div className="score-track">
                <div className="score-fill" style={{ width: `${w.breakdown.score / 10}%` }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, gap: 8 }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16 }}>{w.stats.dealsCompleted}</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>DEALS</div>
                </div>
                <div style={{ width: 1, background: 'rgba(255,255,255,0.06)' }} />
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: '#f7931a' }}>{formatSats(w.stats.totalReceived)}</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>RECEIVED</div>
                </div>
                <div style={{ width: 1, background: 'rgba(255,255,255,0.06)' }} />
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: w.stats.disputes === 0 ? '#00ff88' : '#ff3366' }}>{w.stats.disputes}</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>DISPUTES</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full table */}
      <div className="card-glass" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {['Rank', 'Wallet', 'Level', 'SatScore', 'Deals', 'BTC Received', 'Disputes'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em', fontWeight: 500 }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ranked.map((w, i) => (
              <tr key={w.address} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}>
                <td style={{ padding: '16px', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18, color: i === 0 ? '#f5c842' : i === 1 ? 'rgba(255,255,255,0.5)' : i === 2 ? '#cd7f32' : 'rgba(255,255,255,0.2)' }}>
                  {i < 3 ? RANK_STYLES[i].icon : `#${i + 1}`}
                </td>
                <td style={{ padding: '16px' }}>
                  <a href={`/profile?address=${w.address}`} style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 14, color: '#00d4ff', textDecoration: 'none' }}>{w.label}</a>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.2)', marginTop: 2 }}>{formatAddress(w.address)}</div>
                </td>
                <td style={{ padding: '16px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontFamily: 'JetBrains Mono, monospace', background: `${LEVEL_COLORS[w.breakdown.level]}15`, border: `1px solid ${LEVEL_COLORS[w.breakdown.level]}30`, color: LEVEL_COLORS[w.breakdown.level] }}>
                    {LEVEL_ICONS[w.breakdown.level]} {w.breakdown.level}
                  </span>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, color: LEVEL_COLORS[w.breakdown.level], letterSpacing: '-0.02em' }}>{w.breakdown.score}</div>
                  <div style={{ width: 60, marginTop: 4 }}>
                    <div className="score-track"><div className="score-fill" style={{ width: `${w.breakdown.score / 10}%` }} /></div>
                  </div>
                </td>
                <td style={{ padding: '16px', fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 15 }}>{w.stats.dealsCompleted}</td>
                <td style={{ padding: '16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#f7931a' }}>{formatSats(w.stats.totalReceived)}</td>
                <td style={{ padding: '16px' }}>
                  <span className={w.stats.disputes === 0 ? 'badge-green' : 'badge-red'}>{w.stats.disputes}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 20, padding: '14px 20px', borderRadius: 12, background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(0,212,255,0.7)' }}>
        📡 Live data from ReputationRegistry on Bitcoin L1 via OP_NET · Demo mode active
      </div>
    </div>
  );
}
