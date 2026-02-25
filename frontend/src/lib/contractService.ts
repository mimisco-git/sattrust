import { OPNetLimitedProvider } from '@btc-vision/transaction';

const RPC_URL = 'https://testnet.opnet.org';

export const CONTRACTS = {
  reputationRegistry: process.env.NEXT_PUBLIC_REPUTATION_REGISTRY || 'opt1sqq3akj4typzkjzc4l29rp9x3898lppk7ycxqtzug',
  dealFactory: process.env.NEXT_PUBLIC_DEAL_FACTORY || 'opt1sqqts3yftrkmsmxlwwwd70rykju9y6vky2gy4z897',
  splitDeal: process.env.NEXT_PUBLIC_SPLIT_DEAL || 'opt1sqzykctk6xrhc8ggd2zfxz8n5kfqxchs6qqhsm3le',
};

let provider: OPNetLimitedProvider | null = null;

export function getProvider(): OPNetLimitedProvider {
  if (!provider) {
    provider = new OPNetLimitedProvider(RPC_URL);
  }
  return provider;
}

// Call a contract read method via RPC
export async function contractCall(to: string, data: string): Promise<string | null> {
  try {
    const p = getProvider();
    const result = await p.rpcMethod('call', [{ to, data }]) as { result?: string };
    return result?.result || null;
  } catch {
    return null;
  }
}

// Get SatScore for a wallet address (0-1000)
export async function getSatScore(address: string): Promise<number> {
  try {
    const result = await contractCall(
      CONTRACTS.reputationRegistry,
      '0xeb02c301' + address.replace('0x', '').padStart(64, '0')
    );
    return result ? Math.min(parseInt(result.slice(-8), 16), 1000) : 0;
  } catch {
    return 0;
  }
}

// Get total deal count
export async function getDealCount(): Promise<number> {
  try {
    const result = await contractCall(CONTRACTS.dealFactory, '0x4e47af3e');
    return result ? parseInt(result, 16) : 0;
  } catch {
    return 0;
  }
}
