'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect, useRef } from 'react';
import { useWalletConnect } from '@btc-vision/walletconnect';
import { fetchSatScore, CONTRACTS } from '../../hooks/useContractRead';
import { formatAddress } from '../../lib/sattrust';

const LEVEL_COLORS: Record<string, string> = {
  New: '#888', Bronze: '#cd7f32', Silver: '#aaa', Gold: '#f5c842', Platinum: '#00d4ff', Diamond: '#a855f7'
};
const LEVEL_ICONS: Record<string, string> = {
  New: '🌱', Bronze: '🥉', Silver: '🥈', Gold: '🥇', Platinum: '💎', Diamond: '👑'
};

function getLevel(score: number) {
  if (score >= 900) return 'Diamond';
  if (score >= 750) return 'Platinum';
  if (score >= 500) return 'Gold';
  if (score >= 300) return 'Silver';
  if (score >= 100) return 'Bronze';
  return 'New';
}

export default function ProfilePage() {
  const { walletAddress, openConnectModal } = useWalletConnect();
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [customAddress, setCustomAddress] = useState('');
  const [lookupAddress, setLookupAddress] = useState('');
  const ringRef = useRef<SVGCircleElement>(null);

  const activeAddress = lookupAddress || walletAddress || '';
  const level = getLevel(score);
  const levelColor = LEVEL_COLORS[level];
  const pct = (score / 1000) * 100;
  const circumference = 2 * Math.PI * 54;

  useEffect(() => {
    if (!activeAddress) return;
    setLoading(true);
    fetchSatScore(activeAddress)
      .then(s => { setScore(s); })
      .finally(() => setLoading(false));
  }, [activeAddress]);

  // Animate ring
  useEffect(() => {
    if (!ringRef.current) return;
    const offset = circumference - (pct / 100) * circumference;
    ringRef.current.style.strokeDashoffset = String(offset);
  }, [pct, circumference]);

  return (
    <div className="min-h-screen" style={{ padding: '40px 16px', maxWidth: 800, margin: '0 auto' }}>
      <div className="text-center mb-8">
        <h1 className="font-display font-bold text-4xl text-white mb-2">SatScore Profile</h1>
        <p className="text-white/50">On-chain reputation from real Bitcoin deals</p>
      </div>

      {/* Address Lookup */}
      <div className="card-glass mb-8" style={{ padding: 24 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <input
            className="input-premium flex-1"
            placeholder="Enter any wallet address to look up..."
            value={customAddress}
            onChange={e => setCustomAddress(e.target.value)}
          />
          <button className="btn-bitcoin px-6" onClick={() => setLookupAddress(customAddress)}>
            Look Up
          </button>
          {walletAddress && (
            <button className="btn-ghost px-4" onClick={() => { setLookupAddress(''); setCustomAddress(''); }}>
              My Profile
            </button>
          )}
        </div>
      </div>

      {!activeAddress ? (
        <div className="card-glass text-center" style={{ padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔗</div>
          <h2 className="font-display font-bold text-2xl text-white mb-4">Connect your wallet</h2>
          <p className="text-white/50 mb-6">Connect OP Wallet to see your real SatScore from testnet</p>
          <button className="btn-bitcoin px-8 py-3" onClick={openConnectModal}>Connect Wallet</button>
        </div>
      ) : (
        <>
          {/* Score Ring */}
          <div className="card-premium text-center mb-6" style={{ padding: '40px 24px' }}>
            <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto 24px' }}>
              <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="70" cy="70" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10"/>
                <circle
                  ref={ringRef}
                  cx="70" cy="70" r="54" fill="none"
                  stroke="url(#scoreGrad)" strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference}
                  style={{ transition: 'stroke-dashoffset 1.2s ease' }}
                />
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f7931a"/>
                    <stop offset="100%" stopColor="#00d4ff"/>
                  </linearGradient>
                </defs>
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {loading ? (
                  <div className="text-white/50 text-sm">Loading...</div>
                ) : (
                  <>
                    <div className="font-display font-bold text-3xl text-white">{score}</div>
                    <div className="text-white/40 text-xs">/ 1000</div>
                  </>
                )}
              </div>
            </div>

            <div className="font-mono text-sm text-white/50 mb-2">{formatAddress(activeAddress)}</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 20, background: `${levelColor}15`, border: `1px solid ${levelColor}40` }}>
              <span>{LEVEL_ICONS[level]}</span>
              <span style={{ color: levelColor, fontWeight: 700 }}>{level}</span>
            </div>

            {score === 0 && !loading && (
              <p className="text-white/40 text-sm mt-4">No deals completed yet. Create your first deal to start building reputation!</p>
            )}
          </div>

          {/* Contract Info */}
          <div className="card-glass" style={{ padding: 20 }}>
            <div className="text-white/40 text-xs font-mono mb-2">REPUTATION REGISTRY CONTRACT</div>
            <div className="font-mono text-xs text-cyan-400 break-all">{CONTRACTS.reputationRegistry}</div>
          </div>
        </>
      )}
    </div>
  );
}
