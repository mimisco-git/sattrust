'use client';
import { useWalletConnect } from '@btc-vision/walletconnect';

export function useWallet() {
  const { walletAddress, publicKey, openConnectModal, disconnect, connecting, network } = useWalletConnect();
  
  return {
    address: walletAddress || null,
    publicKey: publicKey || null,
    isConnected: !!walletAddress,
    connecting,
    network,
    connect: openConnectModal,
    disconnect,
  };
}
