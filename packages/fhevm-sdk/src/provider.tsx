/**
 * React Provider for FHEVM SDK
 * Optional React integration
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FhevmClient } from './client';
import type { FhevmConfig } from './types';
import { ethers } from 'ethers';

interface FhevmContextType {
  client: FhevmClient | null;
  isInitialized: boolean;
  error: Error | null;
  init: (provider: ethers.Provider, signer?: ethers.Signer) => Promise<void>;
}

const FhevmContext = createContext<FhevmContextType | undefined>(undefined);

interface FhevmProviderProps {
  config: FhevmConfig;
  children: ReactNode;
  autoInit?: boolean;
}

/**
 * FHEVM Provider Component
 * Wraps the application with FHEVM context
 */
export function FhevmProvider({ config, children, autoInit = false }: FhevmProviderProps) {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initClient = new FhevmClient(config);
    setClient(initClient);

    // Auto-initialize if requested
    if (autoInit && typeof window !== 'undefined' && window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      provider.getSigner().then(signer => {
        initClient.init(provider, signer).then(() => {
          setIsInitialized(true);
        }).catch(err => {
          setError(err);
        });
      }).catch(err => {
        setError(err);
      });
    }
  }, [config, autoInit]);

  const init = async (provider: ethers.Provider, signer?: ethers.Signer) => {
    try {
      if (!client) {
        throw new Error('Client not created');
      }

      await client.init(provider, signer);
      setIsInitialized(true);
      setError(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const value: FhevmContextType = {
    client,
    isInitialized,
    error,
    init
  };

  return (
    <FhevmContext.Provider value={value}>
      {children}
    </FhevmContext.Provider>
  );
}

/**
 * Hook to access FHEVM context
 * Must be used within FhevmProvider
 */
export function useFhevmContext(): FhevmContextType {
  const context = useContext(FhevmContext);

  if (!context) {
    throw new Error('useFhevmContext must be used within FhevmProvider');
  }

  return context;
}
