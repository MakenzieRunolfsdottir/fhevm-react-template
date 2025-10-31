import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_CONFIG, WalletState } from '../types';
import { useFhevmContext } from '../contexts/FhevmContext';

export const useWallet = () => {
  const { initializeFhevm } = useFhevmContext();
  const [walletState, setWalletState] = useState<WalletState>({
    provider: null,
    signer: null,
    contract: null,
    userAddress: null,
    currentChainId: null,
    isConnected: false,
  });

  const updateWalletState = useCallback(
    (updates: Partial<WalletState>) => {
      setWalletState((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const switchToSepoliaNetwork = async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x' + CONTRACT_CONFIG.REQUIRED_CHAIN_ID.toString(16) }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x' + CONTRACT_CONFIG.REQUIRED_CHAIN_ID.toString(16),
                chainName: 'Sepolia test network',
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                nativeCurrency: {
                  name: 'Ethereum',
                  symbol: 'ETH',
                  decimals: 18,
                },
                blockExplorerUrls: ['https://sepolia.etherscan.io/'],
              },
            ],
          });
        } catch (addError) {
          throw new Error('Failed to add Sepolia network');
        }
      }
      throw switchError;
    }
  };

  const connectWallet = useCallback(
    async (requestAccounts = true): Promise<void> => {
      try {
        if (!window.ethereum) {
          throw new Error('Please install MetaMask!');
        }

        if (requestAccounts) {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();

        const network = await provider.getNetwork();
        const currentChainId = Number(network.chainId);

        if (currentChainId !== CONTRACT_CONFIG.REQUIRED_CHAIN_ID) {
          await switchToSepoliaNetwork();
          return;
        }

        let contract = null;
        if (CONTRACT_CONFIG.ADDRESS !== '0x0000000000000000000000000000000000000000') {
          contract = new ethers.Contract(CONTRACT_CONFIG.ADDRESS, CONTRACT_CONFIG.ABI, signer);
        }

        // Initialize FHEVM SDK
        try {
          await initializeFhevm(provider, signer);
          console.log('FHEVM SDK initialized');
        } catch (error) {
          console.error('Failed to initialize FHEVM SDK:', error);
          // Continue even if FHEVM initialization fails
        }

        updateWalletState({
          provider,
          signer,
          contract,
          userAddress,
          currentChainId,
          isConnected: true,
        });
      } catch (error: any) {
        console.error('Wallet connection failed:', error);
        throw error;
      }
    },
    [updateWalletState, initializeFhevm]
  );

  const disconnectWallet = useCallback(() => {
    setWalletState({
      provider: null,
      signer: null,
      contract: null,
      userAddress: null,
      currentChainId: null,
      isConnected: false,
    });
  }, []);

  useEffect(() => {
    const checkExistingConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          await connectWallet(false);
        }
      }
    };

    checkExistingConnection();
  }, [connectWallet]);

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        connectWallet(false);
      }
    };

    const handleChainChanged = (chainId: string) => {
      const newChainId = parseInt(chainId, 16);
      updateWalletState({ currentChainId: newChainId });

      if (newChainId !== CONTRACT_CONFIG.REQUIRED_CHAIN_ID) {
        // Optionally trigger reconnection or show warning
      } else if (walletState.userAddress) {
        connectWallet(false);
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, [connectWallet, disconnectWallet, updateWalletState, walletState.userAddress]);

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
  };
};
