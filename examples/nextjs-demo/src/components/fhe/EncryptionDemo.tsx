/**
 * Encryption Demo Component
 * Demonstrates encryption and decryption workflows
 */

'use client';

import { useState } from 'react';
import { useFhevm } from '@fhevm/sdk';
import { ethers } from 'ethers';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

export default function EncryptionDemo() {
  const { client, init, isInitialized } = useFhevm();
  const [value, setValue] = useState('');
  const [encryptedValue, setEncryptedValue] = useState<string>('');
  const [decryptedValue, setDecryptedValue] = useState<string>('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [account, setAccount] = useState<string>('');

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
    } catch (error) {
      console.error('Connection error:', error);
      alert('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleEncrypt = async () => {
    if (!value || !client || !account) return;

    setIsEncrypting(true);
    try {
      // Create encrypted input
      const encrypted = await client
        .createEncryptedInput(
          process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0',
          account
        )
        .add32(parseInt(value))
        .encrypt();

      setEncryptedValue(encrypted.handles[0]);
    } catch (error) {
      console.error('Encryption error:', error);
      alert('Encryption failed');
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleDecrypt = async () => {
    if (!encryptedValue || !client || !account) return;

    setIsDecrypting(true);
    try {
      // Decrypt value
      const decrypted = await client.userDecrypt(
        encryptedValue,
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0',
        account
      );

      setDecryptedValue(String(decrypted));
    } catch (error) {
      console.error('Decryption error:', error);
      alert('Decryption failed');
    } finally {
      setIsDecrypting(false);
    }
  };

  if (!isInitialized || !account) {
    return (
      <Card title="Encryption Demo" description="Encrypt and decrypt values using FHE">
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            Connect your wallet to start encrypting data
          </p>
          <Button onClick={connectWallet} isLoading={isConnecting}>
            Connect Wallet
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Encryption Demo"
      description="Encrypt and decrypt values using Fully Homomorphic Encryption"
    >
      <div className="space-y-6">
        {/* Connected Account */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            Connected: <span className="font-mono">{account.slice(0, 6)}...{account.slice(-4)}</span>
          </p>
        </div>

        {/* Encryption Section */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Step 1: Encrypt Value</h4>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Enter a number to encrypt"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleEncrypt}
              isLoading={isEncrypting}
              disabled={!value}
            >
              Encrypt
            </Button>
          </div>
        </div>

        {/* Encrypted Result */}
        {encryptedValue && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">Encrypted Value:</h4>
            <p className="text-sm font-mono text-green-800 break-all">
              {encryptedValue}
            </p>
          </div>
        )}

        {/* Decryption Section */}
        {encryptedValue && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Step 2: Decrypt Value</h4>
            <Button
              onClick={handleDecrypt}
              isLoading={isDecrypting}
              variant="secondary"
              className="w-full"
            >
              Decrypt with EIP-712 Signature
            </Button>
          </div>
        )}

        {/* Decrypted Result */}
        {decryptedValue && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-2">Decrypted Value:</h4>
            <p className="text-2xl font-bold text-purple-800">
              {decryptedValue}
            </p>
          </div>
        )}

        {/* Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">How it works:</h4>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>Enter a value and click "Encrypt" to create an encrypted ciphertext</li>
            <li>The value is encrypted using FHE public keys</li>
            <li>Click "Decrypt" to recover the original value using EIP-712 signature</li>
            <li>Only the owner can decrypt their encrypted values</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
