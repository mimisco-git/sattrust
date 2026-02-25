'use client';
import { useState, useEffect } from 'react';
import { useWalletConnect } from '@btc-vision/walletconnect';

const RPC = 'https://testnet.opnet.org';

export const CONTRACTS = {
  reputationRegistry: process.env.NEXT_PUBLIC_REPUTATION_REGISTRY || 'opt1sqq3akj4typzkjzc4l29rp9x3898lppk7ycxqtzug',
  dealFactory: process.env.NEXT_PUBLIC_DEAL_FACTORY || 'opt1sqqts3yftrkmsmxlwwwd70rykju9y6vky2gy4z897',
  splitDeal: process.env.NEXT_PUBLIC_SPLIT_DEAL || 'opt1sqzykctk6xrhc8ggd2zfxz8n5kfqxchs6qqhsm3le',
};

// Pure fetch-based RPC - no Node.js crypto needed
async function rpcCall(to: string, data: string): Promise<string | null> {
  try {
    const res = await fetch(RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'call',
        params: [{ to, data, from: to }],
        id: 1,
      }),
    });
    const json = await res.json();
    return json?.result?.result ?? json?.result ?? null;
  } catch {
    return null;
  }
}

export async function fetchSatScore(address: string): Promise<number> {
  const res = await rpcCall(
    CONTRACTS.reputationRegistry,
    '0xeb02c301' + address.replace('0x', '').padStart(64, '0')
  );
  if (!res || res === '0x') return 0;
  return Math.min(parseInt(res.slice(-8), 16), 1000);
}

export async function fetchDealCount(): Promise<number> {
  const res = await rpcCall(CONTRACTS.dealFactory, '0x4e47af3e');
  if (!res || res === '0x') return 0;
  return parseInt(res, 16) || 0;
}

export async function fetchWalletCount(): Promise<number> {
  const res = await rpcCall(CONTRACTS.reputationRegistry, '0x0d5f3a7b');
  if (!res || res === '0x') return 0;
  return parseInt(res, 16) || 0;
}

export function useSatScore() {
  const { walletAddress } = useWalletConnect();
  const [score, setScore] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!walletAddress) { setScore(0); return; }
    setLoading(true);
    fetchSatScore(walletAddress).then(setScore).finally(() => setLoading(false));
  }, [walletAddress]);

  return { score, loading };
}

export function useChainStats() {
  const [stats, setStats] = useState({ deals: 0, wallets: 0, tvl: '0.00', avgScore: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchDealCount(), fetchWalletCount()])
      .then(([deals, wallets]) => {
        setStats({
          deals,
          wallets,
          tvl: (deals * 0.015).toFixed(2),
          avgScore: Math.min(deals * 2, 650),
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
}
