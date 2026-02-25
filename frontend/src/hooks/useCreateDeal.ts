'use client';
import { useState } from 'react';
import { useWalletConnect } from '@btc-vision/walletconnect';
import { CONTRACTS } from './useContractRead';

export interface Recipient {
  address: string;
  percentage: number;
}

export function useCreateDeal() {
  const { walletAddress, walletInstance, provider } = useWalletConnect();
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createDeal = async (
    description: string,
    amountBTC: number,
    deadline: number,
    recipients: Recipient[]
  ) => {
    if (!walletAddress || !walletInstance) {
      setError('Please connect your wallet first');
      return;
    }
    if (recipients.reduce((s, r) => s + r.percentage, 0) !== 100) {
      setError('Recipients must total 100%');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const amountSats = Math.floor(amountBTC * 100_000_000);
      
      // Encode calldata
      const deadlineHex = deadline.toString(16).padStart(16, '0');
      const countHex = recipients.length.toString(16).padStart(8, '0');
      const recipientsHex = recipients.map(r => r.address.replace('0x','').padStart(64,'0')).join('');
      const percentagesHex = recipients.map(r => r.percentage.toString(16).padStart(8,'0')).join('');
      const calldata = '0x1a2b3c4d' + deadlineHex + countHex + recipientsHex + percentagesHex;

      const result = await (walletInstance as any).sendBitcoin?.({
        to: CONTRACTS.dealFactory,
        value: amountSats,
        data: calldata,
      }) ?? await (walletInstance as any).signAndSend?.({
        to: CONTRACTS.dealFactory,
        calldata,
        value: amountSats,
      });

      if (result?.txid || typeof result === 'string') {
        setTxHash(result?.txid || result);
      } else {
        setError('Transaction sent but no txid returned.');
      }
    } catch (e: any) {
      setError(e?.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return { createDeal, loading, txHash, error, reset: () => { setTxHash(null); setError(null); } };
}
