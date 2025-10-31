/**
 * FHE Client Operations
 * Client-side FHE utilities
 */

import { FhevmClient } from '@fhevm/sdk';
import type { BrowserProvider, Signer } from 'ethers';

/**
 * Initialize FHEVM client
 */
export async function initializeFhevm(
  provider: BrowserProvider,
  signer: Signer,
  config?: {
    chainId?: number;
    networkName?: string;
  }
): Promise<FhevmClient> {
  const client = new FhevmClient({
    network: {
      chainId: config?.chainId || 11155111,
      name: config?.networkName || 'sepolia',
      rpcUrl: await provider._getConnection().url,
    },
  });

  await client.init(provider, signer);

  return client;
}

/**
 * Encrypt a value for contract interaction
 */
export async function encryptValue(
  client: FhevmClient,
  value: number | bigint | boolean,
  type: 'uint8' | 'uint32' | 'uint64' | 'bool',
  contractAddress: string,
  userAddress: string
) {
  const builder = client.createEncryptedInput(contractAddress, userAddress);

  switch (type) {
    case 'uint8':
      builder.add8(Number(value));
      break;
    case 'uint32':
      builder.add32(Number(value));
      break;
    case 'uint64':
      builder.add64(BigInt(value));
      break;
    case 'bool':
      builder.addBool(Boolean(value));
      break;
  }

  return await builder.encrypt();
}

/**
 * Decrypt a value from contract
 */
export async function decryptValue(
  client: FhevmClient,
  handle: string,
  contractAddress: string,
  userAddress: string
): Promise<number | bigint | boolean> {
  return await client.userDecrypt(handle, contractAddress, userAddress);
}
