'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import { useWalletConnect } from '@btc-vision/walletconnect';
import { useCreateDeal, type Recipient } from '../../hooks/useCreateDeal';

export default function CreateDealPage() {
  const { walletAddress, openConnectModal } = useWalletConnect();
  const { createDeal, loading, txHash, error, reset } = useCreateDeal();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('0.01');
  const [deadline, setDeadline] = useState('');
  const [recipients, setRecipients] = useState<Recipient[]>([{ address: '', percentage: 100 }]);

  const totalPct = recipients.reduce((s, r) => s + (Number(r.percentage) || 0), 0);

  const addRecipient = () => {
    if (recipients.length >= 10) return;
    const even = Math.floor(100 / (recipients.length + 1));
    setRecipients([...recipients.map(r => ({ ...r, percentage: even })), { address: '', percentage: 100 - even * recipients.length }]);
  };

  const removeRecipient = (i: number) => {
    if (recipients.length === 1) return;
    setRecipients(recipients.filter((_, idx) => idx !== i));
  };

  const updateRecipient = (i: number, field: keyof Recipient, value: string | number) => {
    setRecipients(recipients.map((r, idx) => idx === i ? { ...r, [field]: value } : r));
  };

  const handleSubmit = async () => {
    if (!walletAddress) { openConnectModal(); return; }
    const deadlineTs = deadline ? Math.floor(new Date(deadline).getTime() / 1000) : Math.floor(Date.now() / 1000) + 86400 * 30;
    await createDeal(description, parseFloat(amount), deadlineTs, recipients);
  };

  // Success screen
  if (txHash) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div className="card-premium text-center" style={{ maxWidth: 480, width: '100%', padding: 48 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>⚡</div>
        <h2 className="font-display font-bold text-white" style={{ fontSize: 28, marginBottom: 8 }}>Deal Created!</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 24, fontSize: 14 }}>Your BTC is locked in the SplitDeal contract. SatScores will update on completion.</p>
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: 16, marginBottom: 28 }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', marginBottom: 6 }}>TRANSACTION ID</div>
          <div className="font-mono" style={{ fontSize: 11, color: '#00d4ff', wordBreak: 'break-all' }}>{txHash}</div>
        </div>
        <button className="btn-bitcoin w-full py-3" onClick={reset}>Create Another Deal</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', padding: '40px 16px', maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.12em', color: '#f7931a', fontFamily: 'monospace', marginBottom: 8 }}>NEW DEAL</div>
        <h1 className="font-display font-bold text-white" style={{ fontSize: 'clamp(28px, 5vw, 48px)', marginBottom: 8 }}>
          Create a <span style={{ color: '#f7931a' }}>Deal</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Lock BTC and split it across your team. Builds everyone's SatScore on completion.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        {/* Left: Deal Details */}
        <div className="card-glass" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <span style={{ fontSize: 18 }}>📋</span>
            <span className="font-display font-bold text-white" style={{ fontSize: 16 }}>Deal Details</span>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 11, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', display: 'block', marginBottom: 8 }}>DESCRIPTION</label>
            <textarea
              className="input-premium w-full"
              style={{ minHeight: 90, resize: 'vertical', fontSize: 14 }}
              placeholder="e.g. Frontend development for SatTrust — Phase 1"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 11, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', display: 'block', marginBottom: 8 }}>AMOUNT (BTC)</label>
            <input
              className="input-premium w-full"
              type="number"
              step="0.001"
              min="0.0001"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 6, fontFamily: 'monospace' }}>
              ≈ {(parseFloat(amount || '0') * 100_000_000).toLocaleString()} sats
            </div>
          </div>

          <div>
            <label style={{ fontSize: 11, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', display: 'block', marginBottom: 8 }}>PAYMENT DEADLINE</label>
            <input
              className="input-premium w-full"
              type="datetime-local"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
            />
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 6, fontFamily: 'monospace' }}>LATE RELEASE AFTER DEADLINE REDUCES SATSCORE</div>
          </div>
        </div>

        {/* Right: Recipients */}
        <div className="card-glass" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>👥</span>
              <span className="font-display font-bold text-white" style={{ fontSize: 16 }}>Recipients</span>
            </div>
            <span style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 700, color: totalPct === 100 ? '#00ff88' : '#ff3366', padding: '4px 10px', borderRadius: 20, background: totalPct === 100 ? 'rgba(0,255,136,0.1)' : 'rgba(255,51,102,0.1)' }}>
              {totalPct}% / 100%
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            {recipients.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  className="input-premium flex-1"
                  style={{ fontSize: 12, minWidth: 0 }}
                  placeholder={`Address ${i + 1}`}
                  value={r.address}
                  onChange={e => updateRecipient(i, 'address', e.target.value)}
                />
                <input
                  className="input-premium"
                  style={{ width: 60, fontSize: 13, textAlign: 'center' }}
                  type="number"
                  min="1"
                  max="100"
                  value={r.percentage}
                  onChange={e => updateRecipient(i, 'percentage', parseInt(e.target.value) || 0)}
                />
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>%</span>
                {recipients.length > 1 && (
                  <button onClick={() => removeRecipient(i)} style={{ color: '#ff3366', background: 'rgba(255,51,102,0.1)', border: '1px solid rgba(255,51,102,0.2)', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', flexShrink: 0 }}>×</button>
                )}
              </div>
            ))}
          </div>

          {recipients.length < 10 && (
            <button onClick={addRecipient} className="btn-ghost w-full py-2" style={{ fontSize: 13, borderStyle: 'dashed' }}>
              + Add Recipient ({recipients.length}/10)
            </button>
          )}

          {/* Payout preview */}
          {parseFloat(amount) > 0 && (
            <div style={{ marginTop: 20, padding: 16, borderRadius: 10, background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', marginBottom: 10 }}>PAYOUT PREVIEW</div>
              {recipients.map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                  <span className="font-mono" style={{ color: 'rgba(255,255,255,0.4)' }}>{r.address ? r.address.slice(0, 12) + '...' : `Recipient ${i + 1}`}</span>
                  <span style={{ color: '#f7931a', fontFamily: 'monospace', fontWeight: 700 }}>
                    {((parseFloat(amount) * r.percentage / 100) * 100_000_000).toFixed(0)} sats
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Warning/Status bar */}
      <div style={{ marginTop: 20, padding: '12px 16px', borderRadius: 10, background: 'rgba(247,147,26,0.06)', border: '1px solid rgba(247,147,26,0.15)', fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', letterSpacing: '0.08em' }}>
        {walletAddress
          ? `⚡ CONNECTED: ${walletAddress.slice(0, 12)}... · DEAL WILL DEPLOY ON BITCOIN LAYER 1`
          : '⚠ CONNECT OP WALLET TO DEPLOY THIS DEAL ON BITCOIN LAYER 1 · SATSCORE UPDATES AUTOMATICALLY'}
      </div>

      {/* Error */}
      {error && (
        <div style={{ marginTop: 12, padding: '12px 16px', borderRadius: 10, background: 'rgba(255,51,102,0.08)', border: '1px solid rgba(255,51,102,0.2)', fontSize: 13, color: '#ff3366' }}>
          ⚠ {error}
        </div>
      )}

      {/* Submit */}
      <button
        className="btn-bitcoin w-full"
        style={{ marginTop: 16, padding: '18px', fontSize: 16, opacity: loading ? 0.6 : 1 }}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? '⏳ Submitting to Bitcoin L1...' : walletAddress ? '⚡ Lock BTC & Create Deal' : '🔗 Connect Wallet to Continue'}
      </button>
    </div>
  );
}
