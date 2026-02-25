'use client';

import { useState } from 'react';
import { formatSats, DEAL_STATUS } from '../../lib/sattrust';

// Mock demo deal
const DEMO_DEAL = {
  id: '0',
  description: 'Frontend development for SatTrust dashboard — Phase 1',
  totalAmount: BigInt('5000000'),
  status: 0,
  deadline: Math.floor(Date.now() / 1000) + 86400 * 3,
  createdAt: Math.floor(Date.now() / 1000) - 86400,
  recipientCount: 2,
  wasLate: false,
  recipients: [
    { address: 'opt1qs4vfp3gz8wn3q3n2hkce8fjjh5k5wl0qdp3r7y', percentage: 70, amount: BigInt('3500000') },
    { address: 'opt1qr9xm5kd2l7p8n4w6j3c0e1f2a8b5v9u7t4s6', percentage: 30, amount: BigInt('1500000') },
  ],
};

const STATUS_COLORS = ['badge-yellow', 'badge-green', 'badge-red', 'badge-blue'];
const STATUS_LABELS = ['⏳ Pending', '✅ Released', '⚠️ Disputed', '↩️ Refunded'];

export default function DealPage() {
  const [deal, setDeal] = useState(DEMO_DEAL);
  const [action, setAction] = useState<'release' | 'dispute' | 'refund' | null>(null);
  const [loading, setLoading] = useState(false);

  const daysLeft = Math.max(0, Math.ceil((deal.deadline - Date.now() / 1000) / 86400));

  const handleAction = async (type: 'release' | 'dispute' | 'refund') => {
    setLoading(true);
    setAction(type);
    await new Promise(r => setTimeout(r, 1500));
    const newStatus = type === 'release' ? 1 : type === 'dispute' ? 2 : 3;
    setDeal({ ...deal, status: newStatus });
    setLoading(false);
    setAction(null);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Deal #{deal.id}</h1>
        <p>Manage and track this escrow deal on Bitcoin Layer 1.</p>
      </div>

      <div className="grid-2">
        {/* Deal Info */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div className="card-title" style={{ margin: 0 }}>Deal Details</div>
            <span className={`badge ${STATUS_COLORS[deal.status]}`}>
              {STATUS_LABELS[deal.status]}
            </span>
          </div>

          <div style={{ color: 'var(--text)', marginBottom: '1rem', lineHeight: 1.6 }}>
            {deal.description}
          </div>

          <div className="stat-grid">
            <div className="stat-item">
              <div className="stat-label">Total Locked</div>
              <div className="stat-value" style={{ color: 'var(--accent)' }}>
                {formatSats(deal.totalAmount)}
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Recipients</div>
              <div className="stat-value">{deal.recipientCount}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Deadline</div>
              <div className="stat-value" style={{ color: daysLeft <= 1 ? 'var(--red)' : 'var(--text)' }}>
                {daysLeft}d left
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Created</div>
              <div className="stat-value">
                {new Date(deal.createdAt * 1000).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Actions */}
          {deal.status === 0 && (
            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                onClick={() => handleAction('release')}
                disabled={loading}
                style={{ flex: 1 }}
              >
                {loading && action === 'release' ? '⏳ Releasing…' : '✅ Release Payment'}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => handleAction('dispute')}
                disabled={loading}
              >
                {loading && action === 'dispute' ? '⏳…' : '⚠️ Dispute'}
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleAction('refund')}
                disabled={loading}
                style={{ fontSize: '0.85rem' }}
              >
                ↩️ Refund
              </button>
            </div>
          )}

          {deal.status !== 0 && (
            <div className="alert alert-info" style={{ marginTop: '1rem' }}>
              This deal is {DEAL_STATUS[deal.status].toLowerCase()}.
              {deal.status === 1 && ' SatScores have been updated for all participants.'}
            </div>
          )}
        </div>

        {/* Recipients */}
        <div className="card">
          <div className="card-title">Recipient Splits</div>
          <table className="table">
            <thead>
              <tr>
                <th>Wallet</th>
                <th>%</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {deal.recipients.map((r, i) => (
                <tr key={i}>
                  <td>
                    <a
                      href={`/profile?address=${r.address}`}
                      style={{ color: 'var(--accent2)', textDecoration: 'none', fontSize: '0.82rem' }}
                    >
                      {r.address.slice(0, 12)}…
                    </a>
                  </td>
                  <td style={{ color: 'var(--muted)' }}>{r.percentage}%</td>
                  <td style={{ color: 'var(--accent)', fontWeight: 600 }}>
                    {formatSats(r.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <hr className="divider" />

          <div className="alert alert-info">
            🏅 On release, every recipient and the payer will have their SatScore updated on Bitcoin L1 automatically.
          </div>
        </div>
      </div>
    </div>
  );
}
