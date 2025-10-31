/**
 * Medical Example Component
 * Demonstrates FHE in confidential healthcare data management
 */

'use client';

import { useState } from 'react';
import { useFhevm } from '@fhevm/sdk';
import { ethers } from 'ethers';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

interface MedicalRecord {
  id: string;
  type: string;
  value: string;
  encrypted: boolean;
  timestamp: Date;
}

export default function MedicalExample() {
  const { client, init, isInitialized } = useFhevm();
  const [account, setAccount] = useState<string>('');
  const [recordType, setRecordType] = useState('');
  const [recordValue, setRecordValue] = useState('');
  const [records, setRecords] = useState<MedicalRecord[]>([]);
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
    } catch (error) {
      console.error('Connection error:', error);
      alert('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleAddRecord = async () => {
    if (!recordType || !recordValue || !client || !account) return;

    setIsProcessing(true);
    try {
      // Encrypt medical data
      const encrypted = await client
        .createEncryptedInput(
          process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0',
          account
        )
        .add32(parseInt(recordValue))
        .encrypt();

      // Add encrypted record
      const newRecord: MedicalRecord = {
        id: Date.now().toString(),
        type: recordType,
        value: encrypted.handles[0],
        encrypted: true,
        timestamp: new Date(),
      };

      setRecords([...records, newRecord]);
      setRecordType('');
      setRecordValue('');

      alert('Medical record encrypted and stored successfully!');
    } catch (error) {
      console.error('Record error:', error);
      alert('Failed to add record');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecryptRecord = async (recordId: string) => {
    const record = records.find(r => r.id === recordId);
    if (!record || !client || !account) return;

    setIsProcessing(true);
    try {
      // Decrypt medical data
      const decrypted = await client.userDecrypt(
        record.value,
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0',
        account
      );

      // Update record with decrypted value
      setRecords(records.map(r =>
        r.id === recordId
          ? { ...r, value: String(decrypted), encrypted: false }
          : r
      ));

      alert('Record decrypted successfully!');
    } catch (error) {
      console.error('Decryption error:', error);
      alert('Failed to decrypt record');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isInitialized || !account) {
    return (
      <Card title="Confidential Medical Records" description="Manage encrypted health data">
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            Connect your wallet to manage confidential medical records
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
      title="Confidential Medical Records Example"
      description="HIPAA-compliant encrypted health data management"
    >
      <div className="space-y-6">
        {/* Patient Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-1">Patient ID</h4>
          <p className="text-xs font-mono text-blue-700">
            {account.slice(0, 10)}...{account.slice(-8)}
          </p>
        </div>

        {/* Add Record Form */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Add Medical Record</h4>
          <div className="space-y-2">
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={recordType}
              onChange={(e) => setRecordType(e.target.value)}
            >
              <option value="">Select record type...</option>
              <option value="Blood Pressure">Blood Pressure (systolic)</option>
              <option value="Heart Rate">Heart Rate (bpm)</option>
              <option value="Blood Sugar">Blood Sugar (mg/dL)</option>
              <option value="Weight">Weight (kg)</option>
              <option value="Temperature">Temperature (°C)</option>
            </select>

            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Value"
                value={recordValue}
                onChange={(e) => setRecordValue(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleAddRecord}
                isLoading={isProcessing}
                disabled={!recordType || !recordValue}
              >
                Add Encrypted Record
              </Button>
            </div>
          </div>
        </div>

        {/* Records List */}
        {records.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Your Medical Records</h4>
            <div className="space-y-2">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="bg-white border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900">{record.type}</h5>
                      <p className="text-xs text-gray-500">
                        {record.timestamp.toLocaleString()}
                      </p>
                      <div className="mt-2">
                        {record.encrypted ? (
                          <p className="text-xs font-mono text-gray-600 break-all">
                            🔒 Encrypted: {record.value.slice(0, 32)}...
                          </p>
                        ) : (
                          <p className="text-lg font-bold text-green-600">
                            Value: {record.value}
                          </p>
                        )}
                      </div>
                    </div>
                    {record.encrypted && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDecryptRecord(record.id)}
                        disabled={isProcessing}
                      >
                        Decrypt
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Privacy Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Privacy Guarantees:</h4>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>All medical data is encrypted at the source</li>
            <li>Healthcare providers can compute on encrypted data</li>
            <li>Only authorized parties can decrypt specific records</li>
            <li>Supports encrypted queries and analytics</li>
            <li>HIPAA-compliant privacy-preserving architecture</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
