// ─── SatTrust Contract Addresses ──────────────────────────────────────────
// Fill in after deployment
export const CONTRACTS = {
  REPUTATION_REGISTRY: process.env.NEXT_PUBLIC_REGISTRY_ADDRESS || '',
  DEAL_FACTORY: process.env.NEXT_PUBLIC_FACTORY_ADDRESS || '',
};

// ─── OP_NET Network Config ─────────────────────────────────────────────────
export const NETWORK_CONFIG = {
  rpcUrl: 'https://testnet.opnet.org',
  network: 'testnet',
  chainId: 'bitcoin-testnet',
};

// ─── Score Calculator ─────────────────────────────────────────────────────
export interface WalletStats {
  dealsCompleted: number;
  dealsAsPayer: number;
  totalReceived: bigint;   // satoshis
  totalPaid: bigint;       // satoshis
  disputes: number;
  lateReleases: number;
  uniquePayers: number;
  firstActivity: number;  // unix timestamp
  lastActivity: number;   // unix timestamp
}

export interface ScoreBreakdown {
  score: number;
  completionPoints: number;
  payerPoints: number;
  volumeBonus: number;
  disputePenalty: number;
  latePenalty: number;
  level: ScoreLevel;
}

export type ScoreLevel = 'New' | 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

export function computeSatScore(stats: WalletStats): ScoreBreakdown {
  const completionPoints = stats.dealsCompleted * 10;
  const payerPoints = stats.uniquePayers * 25;

  // Volume tier: every 1M sats = +5 points
  const volumeBonus = Math.floor(Number(stats.totalReceived) / 1_000_000) * 5;

  const disputePenalty = stats.disputes * 40;
  const latePenalty = stats.lateReleases * 20;

  let raw = completionPoints + payerPoints + volumeBonus - disputePenalty - latePenalty;
  const score = Math.max(0, Math.min(1000, raw));

  return {
    score,
    completionPoints,
    payerPoints,
    volumeBonus,
    disputePenalty,
    latePenalty,
    level: getScoreLevel(score),
  };
}

export function getScoreLevel(score: number): ScoreLevel {
  if (score === 0) return 'New';
  if (score < 100) return 'Bronze';
  if (score < 300) return 'Silver';
  if (score < 500) return 'Gold';
  if (score < 800) return 'Platinum';
  return 'Diamond';
}

export const LEVEL_COLORS: Record<ScoreLevel, string> = {
  New: '#6b7280',
  Bronze: '#cd7f32',
  Silver: '#9ca3af',
  Gold: '#f59e0b',
  Platinum: '#8b5cf6',
  Diamond: '#06b6d4',
};

export const LEVEL_ICONS: Record<ScoreLevel, string> = {
  New: '🌱',
  Bronze: '🥉',
  Silver: '🥈',
  Gold: '🥇',
  Platinum: '💎',
  Diamond: '⚡',
};

// ─── Deal Status ──────────────────────────────────────────────────────────
export const DEAL_STATUS = ['Pending', 'Released', 'Disputed', 'Refunded'] as const;
export type DealStatus = typeof DEAL_STATUS[number];

export function formatSats(sats: bigint): string {
  if (sats >= BigInt(100000000)) {
    return `${(Number(sats) / 100_000_000).toFixed(4)} BTC`;
  }
  return `${sats.toLocaleString()} sats`;
}

export function formatAddress(addr: string): string {
  if (!addr) return '';
  return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
}

// ─── Demo / Seed Data (for offline demo without wallet) ──────────────────
export const DEMO_WALLETS: Array<{ address: string; stats: WalletStats; label: string }> = [
  {
    address: 'opt1qs4vfp3gz8wn3q3n2hkce8fjjh5k5wl0qdp3r7y',
    label: 'Alice (Top Builder)',
    stats: {
      dealsCompleted: 42,
      dealsAsPayer: 8,
      totalReceived: BigInt('85000000'), // 0.85 BTC
      totalPaid: BigInt('12000000'),
      disputes: 1,
      lateReleases: 2,
      uniquePayers: 15,
      firstActivity: 1700000000,
      lastActivity: 1740000000,
    },
  },
  {
    address: 'opt1qr9xm5kd2l7p8n4w6j3c0e1f2a8b5v9u7t4s6',
    label: 'Bob (Regular)',
    stats: {
      dealsCompleted: 12,
      dealsAsPayer: 20,
      totalReceived: BigInt('21000000'),
      totalPaid: BigInt('38000000'),
      disputes: 3,
      lateReleases: 5,
      uniquePayers: 7,
      firstActivity: 1715000000,
      lastActivity: 1739000000,
    },
  },
  {
    address: 'opt1qk2nw7xp4m9q1l5j8c3v6b0d4e7f2a9r8t5u',
    label: 'Carol (New Builder)',
    stats: {
      dealsCompleted: 3,
      dealsAsPayer: 1,
      totalReceived: BigInt('4500000'),
      totalPaid: BigInt('2000000'),
      disputes: 0,
      lateReleases: 0,
      uniquePayers: 3,
      firstActivity: 1738000000,
      lastActivity: 1740500000,
    },
  },
];
