export const CONTRACTS = {
  reputationRegistry: process.env.NEXT_PUBLIC_REPUTATION_REGISTRY || '',
  dealFactory: process.env.NEXT_PUBLIC_DEAL_FACTORY || '',
  splitDeal: process.env.NEXT_PUBLIC_SPLIT_DEAL || '',
  network: process.env.NEXT_PUBLIC_NETWORK || 'testnet',
};

export const RPC_URL = 'https://testnet.opnet.org';
