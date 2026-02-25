'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { useWalletConnect } from '@btc-vision/walletconnect';
import { fetchSatScore, CONTRACTS } from '../../hooks/useContractRead';
import { formatAddress } from '../../lib/sattrust';

const LEVEL_COLORS: Record<string, string> = {
  New: '#888', Bronze: '#cd7f32', Silver: '#c0c0c0', Gold: '#f5c842', Platinum: '#00d4ff', Diamond: '#a855f7'
};

function getLevel(score: number) {
  if (score >= 900) return 'Diamond';
  if (score >= 750) return 'Platinum';
  if (score >= 500) return 'Gold';
  if (score >= 300) return 'Silver';
  if (score >= 100) return 'Bronze';
  return 'New';
}

interface Entry { address: string; score: number; }

export default function LeaderboardPage() {
  const { walletAddress } = useWalletConnect();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [customAddr, setCustomAddr] = useState('');

  useEffect(() => {
    // Start with connected wallet if available
    const initial: Entry[] = [];
    if (walletAddress) {
      setLoading(true);
      fetchSatScore(walletAddress).then(score => {
        setEntries([{ address: walletAddress, score }]);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [walletAddress]);

  const addAddress = async () => {
    if (!customAddr || entries.find(e => e.address === customAddr)) return;
    const score = await fetchSatScore(customAddr);
    setEntries(prev => [...prev, { address: customAddr, score }].sort((a, b) => b.score - a.score));
    setCustomAddr('');
  };

  const sorted = [...entries].sort((a, b) => b.score - a.score);

  return (
    <div style={{ minHeight: '100vh', padding: '40px 16px', maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.12em', color: '#f7931a', fontFamily: 'monospace', marginBottom: 8 }}>RANKINGS</div>
        <h1 className="font-display font-bold text-white" style={{ fontSize: 'clamp(28px, 5vw, 48px)', marginBottom: 8 }}>Leaderboard</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Top Bitcoin wallets by SatScore — earned through real on-chain deal activity.</p>
      </div>

      {/* Add wallet to lookup */}
      <div className="card-glass" style={{ padding: 20, marginBottom: 32 }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>Look up any wallet's SatScore</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            className="input-premium"
            style={{ flex: 1, fontSize: 13 }}
            placeholder="Enter wallet address (opt1...)"
            value={customAddr}
            onChange={e => setCustomAddr(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addAddress()}
          />
          <button className="btn-bitcoin" style={{ padding: '0 20px', whiteSpace: 'nowrap' }} onClick={addAddress}>
            Add
          </button>
        </div>
      </div>

      {/* Leaderboard Table */}
      {loading ? (
        <div className="card-glass text-center" style={{ padding: 60 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>Loading scores from testnet...</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="card-glass text-center" style={{ padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🏆</div>
          <h2 className="font-display font-bold text-white" style={{ fontSize: 22, marginBottom: 8 }}>No wallets yet</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>Connect your wallet or add an address above to see real SatScores from testnet</p>
        </div>
      ) : (
        <div className="card-glass" style={{ overflow: 'hidden' }}>
          {/* Table Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr 100px 80px 100px', gap: 16, padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 10, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>
            <div>RANK</div>
            <div>WALLET</div>
            <div>LEVEL</div>
            <div style={{ textAlign: 'right' }}>SCORE</div>
            <div style={{ textAlign: 'right' }}>BAR</div>
          </div>

          {sorted.map((entry, i) => {
            const level = getLevel(entry.score);
            const color = LEVEL_COLORS[level];
            const isMe = entry.address === walletAddress;
            const rankEmoji = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;

            return (
              <div key={entry.address} style={{
                display: 'grid',
                gridTemplateColumns: '48px 1fr 100px 80px 100px',
                gap: 16,
                padding: '16px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                background: isMe ? 'rgba(247,147,26,0.04)' : 'transparent',
                alignItems: 'center',
              }}>
                <div style={{ fontSize: i < 3 ? 18 : 13, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', fontWeight: 700 }}>{rankEmoji}</div>
                <div>
                  <div className="font-mono" style={{ fontSize: 12, color: isMe ? '#f7931a' : '#00d4ff', marginBottom: 2 }}>
                    {formatAddress(entry.address)} {isMe && <span style={{ fontSize: 10, color: '#f7931a' }}>← you</span>}
                  </div>
                  <div className="font-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>{entry.address.slice(0, 20)}...</div>
                </div>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color, padding: '3px 10px', borderRadius: 20, background: `${color}15`, border: `1px solid ${color}30` }}>
                    {level}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="font-display font-bold" style={{ fontSize: 18, color: entry.score > 0 ? color : 'rgba(255,255,255,0.2)' }}>
                    {entry.score}
                  </span>
                </div>
                <div>
                  <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(entry.score / 1000) * 100}%`, background: `linear-gradient(90deg, #f7931a, #00d4ff)`, borderRadius: 2, transition: 'width 0.8s ease' }} />
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace', marginTop: 4, textAlign: 'right' }}>{entry.score}/1000</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer note */}
      <div style={{ marginTop: 20, textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>
        📡 Live data from ReputationRegistry on Bitcoin L1 via OP_NET
        <span style={{ marginLeft: 8, color: '#f7931a' }}>· Testnet</span>
      </div>
    </div>
  );
}
