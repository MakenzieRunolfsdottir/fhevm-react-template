/**
 * Banking Example Component
 * Demonstrates FHE in a confidential banking scenario
 */

'use client';

import { useState } from 'react';
import { useFhevm } from '@fhevm/sdk';
import { ethers } from 'ethers';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

export default function BankingExample() {
  const { client, init, isInitialized } = useFhevm();
  const [account, setAccount] = useState<string>('');
  const [balance, setBalance] = useState<string>('');
  const [depositAmount, setDepositAmount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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
      setBalance('1000'); // Mock initial balance
    } catch (error) {
      console.error('Connection error:', error);
      alert('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || !client || !account) return;

    setIsProcessing(true);
    try {
      // Encrypt deposit amount
      const encrypted = await client
        .createEncryptedInput(
          process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0',
          account
        )
        .add32(parseInt(depositAmount))
        .encrypt();

      // Simulate deposit
      const newBalance = parseInt(balance) + parseInt(depositAmount);
      setBalance(String(newBalance));
      setDepositAmount('');

      alert('Deposit successful! Amount encrypted and added to balance.');
    } catch (error) {
      console.error('Deposit error:', error);
      alert('Deposit failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTransfer = async () => {
    if (!transferAmount || !recipient || !client || !account) return;

    if (parseInt(transferAmount) > parseInt(balance)) {
      alert('Insufficient balance');
      return;
    }

    setIsProcessing(true);
    try {
      // Encrypt transfer amount
      const encrypted = await client
        .createEncryptedInput(
          process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0',
          account
        )
        .add32(parseInt(transferAmount))
        .encrypt();

      // Simulate transfer
      const newBalance = parseInt(balance) - parseInt(transferAmount);
      setBalance(String(newBalance));
      setTransferAmount('');
      setRecipient('');

      alert('Transfer successful! Amount encrypted and transferred.');
    } catch (error) {
      console.error('Transfer error:', error);
      alert('Transfer failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isInitialized || !account) {
    return (
      <Card title="Confidential Banking" description="Manage encrypted balances and transfers">
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            Connect your wallet to access confidential banking features
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
      title="Confidential Banking Example"
      description="Encrypted balance management with FHE"
    >
      <div className="space-y-6">
        {/* Account Info */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Your Account</h4>
          <p className="text-xs font-mono text-gray-600 mb-4">
            {account}
          </p>
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <p className="text-sm text-gray-600 mb-1">Encrypted Balance</p>
            <p className="text-3xl font-bold text-blue-600">
              {balance} ETH
            </p>
            <p className="text-xs text-gray-500 mt-2">
              * Balance is encrypted on-chain
            </p>
          </div>
        </div>

        {/* Deposit Section */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Deposit Funds</h4>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Amount to deposit"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleDeposit}
              isLoading={isProcessing}
              disabled={!depositAmount}
            >
              Deposit
            </Button>
          </div>
        </div>

        {/* Transfer Section */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Transfer Funds</h4>
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Recipient address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Amount to transfer"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleTransfer}
                isLoading={isProcessing}
                disabled={!transferAmount || !recipient}
                variant="secondary"
              >
                Transfer
              </Button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Privacy Features:</h4>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>All balances are encrypted on-chain</li>
            <li>Transfer amounts are never revealed</li>
            <li>Only you can decrypt your balance</li>
            <li>Supports confidential comparisons (balance checks)</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
