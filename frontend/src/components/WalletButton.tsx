'use client';
import { useWalletConnect } from '@btc-vision/walletconnect';

export default function WalletButton() {
  const { openConnectModal, disconnect, walletAddress, connecting } = useWalletConnect();

  if (connecting) return (
    <button className="btn-ghost text-sm px-4 py-2 opacity-50" disabled>Connecting...</button>
  );

  if (walletAddress) return (
    <div className="flex items-center gap-3">
      <span className="badge-cyan font-mono text-xs">
        {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}
      </span>
      <button onClick={disconnect} className="btn-ghost text-xs px-3 py-1">Disconnect</button>
    </div>
  );

  return (
    <button onClick={openConnectModal} className="btn-bitcoin text-sm px-5 py-2">
      Connect Wallet
    </button>
  );
}
