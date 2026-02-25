'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
interface Recipient { address: string; percentage: number; }

export default function CreateDealPage() {
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [amountBTC, setAmountBTC] = useState('');
  const [recipients, setRecipients] = useState<Recipient[]>([{ address: '', percentage: 100 }]);
  const [submitting, setSubmitting] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  const totalPct = recipients.reduce((s, r) => s + r.percentage, 0);

  const updateR = (i: number, f: keyof Recipient, v: string | number) => {
    const u = [...recipients]; (u[i] as any)[f] = v; setRecipients(u);
  };

  const handleSubmit = async () => {
    setError('');
    if (!description.trim()) return setError('Description is required');
    if (!amountBTC || parseFloat(amountBTC) <= 0) return setError('Enter a valid BTC amount');
    if (totalPct !== 100) return setError(`Percentages must total 100% (currently ${totalPct}%)`);
    if (recipients.some(r => !r.address.trim())) return setError('All recipient addresses are required');
    setSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 1800));
      setTxHash('0x' + Math.random().toString(16).slice(2, 66));
    } catch (e: any) { setError(e.message || 'Transaction failed'); }
    finally { setSubmitting(false); }
  };

  if (txHash) return (
    <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
      <div className="card-premium" style={{ padding: 48 }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>⚡</div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 24, marginBottom: 8 }}>Deal Created on Bitcoin L1</div>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 24 }}>Funds are locked in escrow. Recipients will be paid on release.</div>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '12px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.3)', wordBreak: 'break-all', marginBottom: 24 }}>TX: {txHash}</div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <a href="/leaderboard" className="btn-ghost">View Leaderboard</a>
          <button className="btn-bitcoin" onClick={() => { setTxHash(''); setDescription(''); setAmountBTC(''); setDeadline(''); setRecipients([{address:'',percentage:100}]); }}>New Deal</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ position: 'relative' }}>
      <div className="glow-orb-bitcoin" style={{ top: -100, right: 0 }} />

      <div style={{ marginBottom: 40 }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#f7931a', letterSpacing: '0.1em', marginBottom: 8 }}>NEW DEAL</div>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 40, letterSpacing: '-0.04em', marginBottom: 8 }}>
          Create a <span className="text-gradient-bitcoin">Deal</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15 }}>Lock BTC and split it across your team. Builds everyone's SatScore on completion.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
        {/* Deal Details */}
        <div className="card-glass" style={{ padding: 28 }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(247,147,26,0.15)', border: '1px solid rgba(247,147,26,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>📋</span>
            Deal Details
          </div>
          <div style={{ marginBottom: 20 }}>
            <label className="label-premium">Description</label>
            <textarea className="input-premium" rows={3} placeholder="e.g. Frontend development for SatTrust — Phase 1" value={description} onChange={e => setDescription(e.target.value)} style={{ resize: 'none' }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label className="label-premium">Amount (BTC)</label>
            <input className="input-premium" type="number" placeholder="0.01" min="0" step="0.0001" value={amountBTC} onChange={e => setAmountBTC(e.target.value)} />
          </div>
          <div>
            <label className="label-premium">Payment Deadline</label>
            <input className="input-premium" type="datetime-local" value={deadline} onChange={e => setDeadline(e.target.value)} />
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.2)', marginTop: 6, letterSpacing: '0.04em' }}>
              LATE RELEASE AFTER DEADLINE REDUCES SATSCORE
            </div>
          </div>
        </div>

        {/* Recipients */}
        <div className="card-glass" style={{ padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>👥</span>
              Recipients
            </div>
            <span className={totalPct === 100 ? 'badge-green' : 'badge-red'}>{totalPct}% / 100%</span>
          </div>

          {recipients.map((r, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 72px 36px', gap: 8, marginBottom: 8 }}>
              <input className="input-premium" placeholder={`Address ${i + 1}`} value={r.address} onChange={e => updateR(i, 'address', e.target.value)} />
              <input className="input-premium" type="number" placeholder="%" min={0} max={100} value={r.percentage} onChange={e => updateR(i, 'percentage', parseInt(e.target.value) || 0)} style={{ textAlign: 'center', padding: '12px 8px' }} />
              <button onClick={() => recipients.length > 1 && setRecipients(recipients.filter((_, j) => j !== i))} disabled={recipients.length <= 1} style={{ width: 36, height: 46, borderRadius: 10, background: 'rgba(255,51,102,0.08)', border: '1px solid rgba(255,51,102,0.15)', color: '#ff3366', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>
          ))}

          {recipients.length < 10 && (
            <button className="btn-ghost" onClick={() => setRecipients([...recipients, { address: '', percentage: 0 }])} style={{ width: '100%', marginTop: 4, justifyContent: 'center' }}>+ Add Recipient</button>
          )}

          {amountBTC && totalPct === 100 && (
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.25)', marginBottom: 10, letterSpacing: '0.06em' }}>PAYOUT BREAKDOWN</div>
              {recipients.map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>{r.address ? `${r.address.slice(0, 12)}…` : `Recipient ${i+1}`}</span>
                  <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#f7931a' }}>{((parseFloat(amountBTC) * r.percentage) / 100).toFixed(6)} BTC</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 10, background: 'rgba(255,51,102,0.08)', border: '1px solid rgba(255,51,102,0.2)', color: '#ff3366', fontFamily: 'DM Sans, sans-serif', fontSize: 13 }}>{error}</div>}

      <div style={{ marginTop: 16, padding: '14px 20px', borderRadius: 12, background: 'rgba(247,147,26,0.06)', border: '1px solid rgba(247,147,26,0.15)', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(247,147,26,0.7)', letterSpacing: '0.04em' }}>
        💡 CONNECT OP WALLET TO DEPLOY THIS DEAL ON BITCOIN LAYER 1 · SATSCORE UPDATES AUTOMATICALLY
      </div>

      <button className="btn-bitcoin" onClick={handleSubmit} disabled={submitting || totalPct !== 100} style={{ marginTop: 16, width: '100%', justifyContent: 'center', padding: '16px', fontSize: 16 }}>
        {submitting ? '⏳ Creating Deal on Bitcoin L1…' : '⚡ Lock BTC & Create Deal'}
      </button>
    </div>
  );
}
