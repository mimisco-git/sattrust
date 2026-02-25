import { CONTRACTS, RPC_URL } from './contracts';

// OP_NET provider setup
export async function getProvider() {
  const { JSONRpcProvider } = await import('@btc-vision/transaction');
  return new JSONRpcProvider(RPC_URL);
}

// Read SatScore for a wallet
export async function getSatScore(wallet: string): Promise<number> {
  try {
    const response = await fetch(`${RPC_URL}/api/v1/contract/call`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: CONTRACTS.reputationRegistry,
        data: encodeCall('getScore(address)', [wallet]),
      }),
    });
    const data = await response.json();
    return data.result ? parseInt(data.result, 16) : 0;
  } catch {
    return 0;
  }
}

// Encode a simple function call
function encodeCall(signature: string, params: string[]): string {
  const hash = simpleKeccak(signature).slice(0, 8);
  const encoded = params.map(p => p.replace('0x', '').padStart(64, '0')).join('');
  return '0x' + hash + encoded;
}

function simpleKeccak(input: string): string {
  // Selector lookup table for our contracts
  const selectors: Record<string, string> = {
    'getScore(address)': 'eb02c301',
    'getReputation(address)': 'a87d942c',
    'dealCount()': '4e47af3e',
  };
  return selectors[input] || '00000000';
}

// Get deal count from factory
export async function getDealCount(): Promise<number> {
  try {
    const response = await fetch(`${RPC_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'call',
        params: [{
          to: CONTRACTS.dealFactory,
          data: '0x4e47af3e',
        }],
        id: 1,
      }),
    });
    const data = await response.json();
    return data.result ? parseInt(data.result, 16) : 0;
  } catch {
    return 0;
  }
}
