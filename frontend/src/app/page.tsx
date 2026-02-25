'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useChainStats } from '../hooks/useContractRead';

const features = [
  { icon: '⚡', title: 'Split Payments', desc: 'Lock real BTC and define up to 10 recipients with custom percentage splits. One transaction distributes to everyone.', color: '#f7931a' },
  { icon: '🏆', title: 'SatScore Reputation', desc: 'Every completed deal builds your 0–1000 on-chain reputation score. No forms. No profiles. Just Bitcoin.', color: '#00d4ff' },
  { icon: '🔒', title: 'Trustless Escrow', desc: 'Funds locked until release. Dispute protection built in. No intermediaries. No custodians. Just smart contracts.', color: '#00ff88' },
];

const steps = [
  { n: '01', title: 'Lock BTC', desc: "Create a deal, define recipient splits and deadline. Your BTC locks into the SplitDeal contract." },
  { n: '02', title: 'Work Happens', desc: "Team delivers. You review. When satisfied, release with one click — funds flow instantly." },
  { n: '03', title: 'Score Builds', desc: "Every completed deal writes permanently to the ReputationRegistry on Bitcoin L1. SatScores update automatically for everyone." },
];

export default function HomePage() {
  const { stats, loading } = useChainStats();

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{ padding: '80px 16px 60px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 20, background: 'rgba(247,147,26,0.08)', border: '1px solid rgba(247,147,26,0.2)', marginBottom: 32 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f7931a', display: 'inline-block' }} />
          <span style={{ fontSize: 11, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>OP_NET VIBECODING CHALLENGE 2026</span>
        </div>
        <h1 className="font-display" style={{ fontSize: 'clamp(36px, 7vw, 80px)', fontWeight: 800, lineHeight: 1.05, color: '#fff', marginBottom: 16 }}>
          Pay your team in Bitcoin.<br/>
          <span style={{ background: 'linear-gradient(135deg, #f7931a, #ffaa44)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Build trust on-chain.</span>
        </h1>
        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.6 }}>
          SatTrust splits BTC payments across any team in one transaction — and every deal builds a permanent, verifiable reputation score on Bitcoin Layer 1.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/create" className="btn-bitcoin" style={{ padding: '14px 28px', fontSize: 16 }}>⚡ Create a Deal</Link>
          <Link href="/leaderboard" className="btn-ghost" style={{ padding: '14px 28px', fontSize: 16 }}>🏆 View Leaderboard</Link>
          <Link href="/profile" className="btn-ghost" style={{ padding: '14px 28px', fontSize: 16 }}>👤 My Profile</Link>
        </div>
        <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)' }}>POWERED BY</span>
          <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#f7931a', padding: '2px 8px', borderRadius: 4, background: 'rgba(247,147,26,0.1)', border: '1px solid rgba(247,147,26,0.2)' }}>OP_NET</span>
          <span style={{ fontSize: 11, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)' }}>BITCOIN LAYER 1</span>
        </div>
      </section>

      {/* Live Stats */}
      <div className="card-glass" style={{ padding: '32px 40px', marginBottom: 60, maxWidth: 1000, margin: '0 auto 60px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 32, textAlign: 'center' }}>
        {[
          { label: 'TOTAL VALUE LOCKED', value: loading ? '...' : `${stats.tvl} BTC`, color: '#f7931a' },
          { label: 'DEALS COMPLETED', value: loading ? '...' : stats.deals.toLocaleString(), color: '#00d4ff' },
          { label: 'WALLETS TRACKED', value: loading ? '...' : stats.wallets.toLocaleString(), color: '#00ff88' },
          { label: 'AVG SATSCORE', value: loading ? '...' : stats.avgScore.toString(), color: '#f5c842' },
        ].map(s => (
          <div key={s.label}>
            <div className="font-display font-bold" style={{ fontSize: 32, color: s.color, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 10, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 60 }}>
          {features.map(f => (
            <div key={f.title} className="card-glass" style={{ padding: 28 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${f.color}15`, border: `1px solid ${f.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 20 }}>{f.icon}</div>
              <h3 className="font-display font-bold text-white" style={{ fontSize: 18, marginBottom: 10 }}>{f.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="card-glass" style={{ padding: '40px 32px', marginBottom: 60 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.12em', color: '#f7931a', fontFamily: 'monospace', marginBottom: 8 }}>PROTOCOL</div>
          <h2 className="font-display font-bold text-white" style={{ fontSize: 28, marginBottom: 32 }}>How SatTrust works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
            {steps.map(step => (
              <div key={step.n} style={{ display: 'flex', gap: 16 }}>
                <div className="font-display" style={{ fontWeight: 800, fontSize: 36, color: 'rgba(247,147,26,0.15)', lineHeight: 1, flexShrink: 0 }}>{step.n}</div>
                <div>
                  <h4 className="font-display font-bold text-white" style={{ fontSize: 16, marginBottom: 8 }}>{step.title}</h4>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ borderRadius: 20, overflow: 'hidden', padding: '48px 40px', background: 'linear-gradient(135deg, rgba(247,147,26,0.12) 0%, rgba(0,212,255,0.08) 100%)', border: '1px solid rgba(247,147,26,0.2)', textAlign: 'center', marginBottom: 60 }}>
          <h2 className="font-display font-bold text-white" style={{ fontSize: 'clamp(24px, 4vw, 36px)', marginBottom: 12 }}>
            Mainnet goes live <span style={{ color: '#f7931a' }}>March 17</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 28 }}>Everything you build on testnet deploys for real. Start building your reputation now.</p>
          <Link href="/create" className="btn-bitcoin" style={{ padding: '14px 32px', fontSize: 16 }}>⚡ Start Building</Link>
        </div>
      </div>
    </div>
  );
}
