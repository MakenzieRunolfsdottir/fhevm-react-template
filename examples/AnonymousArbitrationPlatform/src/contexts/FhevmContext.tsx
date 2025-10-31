/**
 * FHEVM Context Provider
 * Provides FHEVM SDK functionality to the entire application
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { FhevmClient } from '@fhevm/sdk';
import { BrowserProvider, Signer } from 'ethers';

interface FhevmContextType {
  client: FhevmClient | null;
  isInitialized: boolean;
  initializeFhevm: (provider: BrowserProvider, signer: Signer) => Promise<void>;
  createEncryptedInput: (contractAddress: string, userAddress: string) => any;
}

const FhevmContext = createContext<FhevmContextType | undefined>(undefined);

interface FhevmProviderProps {
  children: ReactNode;
  config?: {
    chainId?: number;
    networkName?: string;
    rpcUrl?: string;
  };
}

export const FhevmProvider: React.FC<FhevmProviderProps> = ({ children, config }) => {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeFhevm = useCallback(async (provider: BrowserProvider, signer: Signer) => {
    try {
      const network = await provider.getNetwork();

      const fhevmClient = new FhevmClient({
        network: {
          chainId: config?.chainId || Number(network.chainId),
          name: config?.networkName || 'sepolia',
          rpcUrl: config?.rpcUrl || 'https://ethereum-sepolia.publicnode.com',
        },
      });

      await fhevmClient.init(provider, signer);

      setClient(fhevmClient);
      setIsInitialized(true);

      console.log('FHEVM SDK initialized successfully');
    } catch (error) {
      console.error('Failed to initialize FHEVM SDK:', error);
      throw error;
    }
  }, [config]);

  const createEncryptedInput = useCallback((contractAddress: string, userAddress: string) => {
    if (!client) {
      throw new Error('FHEVM client not initialized');
    }
    return client.createEncryptedInput(contractAddress, userAddress);
  }, [client]);

  const value: FhevmContextType = {
    client,
    isInitialized,
    initializeFhevm,
    createEncryptedInput,
  };

  return <FhevmContext.Provider value={value}>{children}</FhevmContext.Provider>;
};

export const useFhevmContext = (): FhevmContextType => {
  const context = useContext(FhevmContext);

  if (!context) {
    throw new Error('useFhevmContext must be used within FhevmProvider');
  }

  return context;
};
