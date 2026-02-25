import Link from 'next/link';

const STATS = [
  { label: 'Total Value Locked', value: '12.4 BTC', sub: 'across all deals' },
  { label: 'Deals Completed', value: '847', sub: 'on Bitcoin L1' },
  { label: 'Wallets Tracked', value: '2,341', sub: 'with SatScores' },
  { label: 'Avg SatScore', value: '412', sub: 'out of 1000' },
];

const FEATURES = [
  {
    icon: '💸',
    title: 'Split Payments',
    color: '#f7931a',
    desc: 'Lock real BTC and define up to 10 recipients with custom percentage splits. One transaction distributes to everyone.',
  },
  {
    icon: '🏅',
    title: 'SatScore Reputation',
    color: '#00d4ff',
    desc: 'Every completed deal builds your 0–1000 on-chain reputation score. No forms. No profiles. Just Bitcoin.',
  },
  {
    icon: '🔐',
    title: 'Trustless Escrow',
    color: '#f5c842',
    desc: 'Funds locked until release. Dispute protection built in. No intermediaries. No custodians. Just smart contracts.',
  },
];

export default function Home() {
  return (
    <div style={{ position: 'relative' }}>

      {/* Ambient glow orbs */}
      <div className="glow-orb-bitcoin" style={{ top: -100, left: -200 }} />
      <div className="glow-orb-cyan" style={{ top: 200, right: -150 }} />

      {/* ── HERO ─────────────────────────────────────── */}
      <section style={{ textAlign: 'center', padding: '60px 0 80px', position: 'relative' }}>

        {/* Top badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 20, background: 'rgba(247,147,26,0.08)', border: '1px solid rgba(247,147,26,0.2)', marginBottom: 32 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f7931a', display: 'inline-block', animation: 'glowPulse 2s infinite' }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#f7931a', letterSpacing: '0.08em' }}>
            OP_NET VIBECODING CHALLENGE 2026
          </span>
        </div>

        {/* Headline */}
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(2.8rem, 6vw, 5rem)', lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: 24 }}>
          Pay your team in Bitcoin.<br />
          <span className="text-gradient-bitcoin">Build trust on-chain.</span>
        </h1>

        {/* Sub */}
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 18, lineHeight: 1.7, maxWidth: 540, margin: '0 auto 40px', fontWeight: 300 }}>
          SatTrust splits BTC payments across any team in one transaction — 
          and every deal builds a permanent, verifiable reputation score on Bitcoin Layer 1.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/create" className="btn-bitcoin" style={{ padding: '14px 28px', fontSize: 15 }}>
            ⚡ Create a Deal
          </Link>
          <Link href="/leaderboard" className="btn-ghost" style={{ padding: '14px 24px', fontSize: 15 }}>
            🏆 View Leaderboard
          </Link>
          <Link href="/profile" className="btn-ghost" style={{ padding: '14px 24px', fontSize: 15 }}>
            👤 My Profile
          </Link>
        </div>

        {/* Powered by */}
        <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.06em' }}>POWERED BY</div>
          <div className="badge-bitcoin" style={{ fontSize: 10 }}>OP_NET</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.06em' }}>BITCOIN LAYER 1</div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────── */}
      <div className="card-glass" style={{ padding: '32px 40px', marginBottom: 60, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 32 }}>
        {STATS.map((s, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 28, letterSpacing: '-0.03em', color: i % 2 === 0 ? '#f7931a' : '#00d4ff' }}>{s.value}</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 4, letterSpacing: '0.04em' }}>{s.label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* ── FEATURES ─────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 60 }}>
        {FEATURES.map((f, i) => (
          <div key={i} className="card-premium" style={{ padding: 28 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `${f.color}15`, border: `1px solid ${f.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 20 }}>
              {f.icon}
            </div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 17, marginBottom: 10, color: 'white' }}>{f.title}</div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 1.7 }}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* ── HOW IT WORKS ─────────────────────────────── */}
      <div className="card-glass" style={{ padding: '40px 48px', marginBottom: 60 }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#f7931a', letterSpacing: '0.1em', marginBottom: 8 }}>PROTOCOL</div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 24, marginBottom: 32 }}>How SatTrust works</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
          {[
            { n: '01', title: 'Lock BTC', desc: 'Create a deal, define recipient splits and deadline. Your BTC locks into the SplitDeal contract.' },
            { n: '02', title: 'Work Happens', desc: 'Team delivers. You review. When satisfied, release with one click — funds flow instantly.' },
            { n: '03', title: 'Score Builds', desc: 'Every completed deal writes permanently to the ReputationRegistry on Bitcoin L1. SatScores update automatically for everyone.' },
          ].map(step => (
            <div key={step.n} style={{ display: 'flex', gap: 16 }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 36, color: 'rgba(247,147,26,0.15)', lineHeight: 1, flexShrink: 0, letterSpacing: '-0.04em' }}>{step.n}</div>
              <div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 15, marginBottom: 8 }}>{step.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, lineHeight: 1.7 }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA BANNER ───────────────────────────────── */}
      <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', padding: '48px 40px', background: 'linear-gradient(135deg, rgba(247,147,26,0.12) 0%, rgba(0,212,255,0.08) 100%)', border: '1px solid rgba(247,147,26,0.2)', textAlign: 'center' }}>
        <div className="glow-orb-bitcoin" style={{ top: -100, left: '30%', width: 300, height: 300 }} />
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 28, marginBottom: 12, letterSpacing: '-0.03em' }}>
          Mainnet goes live <span className="text-gradient-bitcoin">March 17</span>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 15, marginBottom: 28 }}>
          Everything you build on testnet deploys for real. Start building your reputation now.
        </div>
        <Link href="/create" className="btn-bitcoin" style={{ padding: '14px 32px', fontSize: 15 }}>
          ⚡ Start Building
        </Link>
      </div>

    </div>
  );
}
