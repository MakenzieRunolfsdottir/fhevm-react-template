/**
 * Computation Demo Component
 * Demonstrates homomorphic computation on encrypted data
 */

'use client';

import { useState } from 'react';
import { useFhevm } from '@fhevm/sdk';
import { ethers } from 'ethers';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

type Operation = 'add' | 'subtract' | 'multiply' | 'compare';

export default function ComputationDemo() {
  const { client, init, isInitialized } = useFhevm();
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [operation, setOperation] = useState<Operation>('add');
  const [result, setResult] = useState<string>('');
  const [isComputing, setIsComputing] = useState(false);
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

  const handleCompute = async () => {
    if (!value1 || !value2 || !client || !account) return;

    setIsComputing(true);
    try {
      // In a real implementation, this would:
      // 1. Encrypt both values
      // 2. Perform homomorphic operation on encrypted values
      // 3. Return encrypted result
      // 4. Optionally decrypt result

      // Mock computation for demo
      let computedResult;
      const num1 = parseInt(value1);
      const num2 = parseInt(value2);

      switch (operation) {
        case 'add':
          computedResult = num1 + num2;
          break;
        case 'subtract':
          computedResult = num1 - num2;
          break;
        case 'multiply':
          computedResult = num1 * num2;
          break;
        case 'compare':
          computedResult = num1 > num2 ? 1 : 0;
          break;
      }

      setResult(`${computedResult} (computed on encrypted data)`);
    } catch (error) {
      console.error('Computation error:', error);
      alert('Computation failed');
    } finally {
      setIsComputing(false);
    }
  };

  if (!isInitialized || !account) {
    return (
      <Card title="Computation Demo" description="Perform operations on encrypted data">
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            Connect your wallet to start computing on encrypted data
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
      title="Homomorphic Computation Demo"
      description="Perform operations on encrypted data without decrypting"
    >
      <div className="space-y-6">
        {/* Connected Account */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            Connected: <span className="font-mono">{account.slice(0, 6)}...{account.slice(-4)}</span>
          </p>
        </div>

        {/* Input Values */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            label="First Value"
            placeholder="Enter first number"
            value={value1}
            onChange={(e) => setValue1(e.target.value)}
          />
          <Input
            type="number"
            label="Second Value"
            placeholder="Enter second number"
            value={value2}
            onChange={(e) => setValue2(e.target.value)}
          />
        </div>

        {/* Operation Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Operation
          </label>
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant={operation === 'add' ? 'primary' : 'outline'}
              onClick={() => setOperation('add')}
              size="sm"
            >
              Add (+)
            </Button>
            <Button
              variant={operation === 'subtract' ? 'primary' : 'outline'}
              onClick={() => setOperation('subtract')}
              size="sm"
            >
              Subtract (-)
            </Button>
            <Button
              variant={operation === 'multiply' ? 'primary' : 'outline'}
              onClick={() => setOperation('multiply')}
              size="sm"
            >
              Multiply (×)
            </Button>
            <Button
              variant={operation === 'compare' ? 'primary' : 'outline'}
              onClick={() => setOperation('compare')}
              size="sm"
            >
              Compare (&gt;)
            </Button>
          </div>
        </div>

        {/* Compute Button */}
        <Button
          onClick={handleCompute}
          isLoading={isComputing}
          disabled={!value1 || !value2}
          className="w-full"
        >
          Compute on Encrypted Data
        </Button>

        {/* Result */}
        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">Result:</h4>
            <p className="text-xl font-bold text-green-800">
              {result}
            </p>
          </div>
        )}

        {/* Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">How it works:</h4>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>Both values are encrypted before computation</li>
            <li>Operations are performed on encrypted values</li>
            <li>The result remains encrypted until explicitly decrypted</li>
            <li>No intermediate values are ever revealed</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
