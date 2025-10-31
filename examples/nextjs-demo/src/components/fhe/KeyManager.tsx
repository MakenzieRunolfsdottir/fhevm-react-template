/**
 * Key Manager Component
 * Manages FHE public/private keys
 */

'use client';

import { useState, useEffect } from 'react';
import { useFhevm } from '@fhevm/sdk';
import { ethers } from 'ethers';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function KeyManager() {
  const { client, init, isInitialized } = useFhevm();
  const [account, setAccount] = useState<string>('');
  const [publicKey, setPublicKey] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask');
      return;
    }

    setIsConnecting(true);
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      await init(provider, signer);
      setAccount(address);

      // Mock public key for demo
      setPublicKey('0x' + 'f'.repeat(128));
    } catch (error) {
      console.error('Connection error:', error);
      alert('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setPublicKey('');
  };

  if (!isInitialized || !account) {
    return (
      <Card>
        <div className="text-center py-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            FHEVM SDK Status
          </h3>
          <p className="text-gray-600 mb-4">
            Connect your wallet to initialize the FHEVM client
          </p>
          <Button onClick={connectWallet} isLoading={isConnecting}>
            Connect Wallet
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              FHEVM SDK Connected
            </h3>
            <p className="text-sm text-gray-600">
              Account: <span className="font-mono">{account.slice(0, 6)}...{account.slice(-4)}</span>
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={disconnectWallet}>
            Disconnect
          </Button>
        </div>

        {publicKey && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-xs font-semibold text-gray-700 mb-1">Public Key:</p>
            <p className="text-xs font-mono text-gray-600 break-all">
              {publicKey.slice(0, 64)}...
            </p>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-green-600">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>SDK Initialized & Ready</span>
        </div>
      </div>
    </Card>
  );
}
