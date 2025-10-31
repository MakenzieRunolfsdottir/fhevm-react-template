/**
 * Home Page - FHEVM SDK Showcase
 * Demonstrates all core SDK features
 */

'use client';

import { useState } from 'react';
import EncryptionDemo from '@/components/fhe/EncryptionDemo';
import ComputationDemo from '@/components/fhe/ComputationDemo';
import KeyManager from '@/components/fhe/KeyManager';
import BankingExample from '@/components/examples/BankingExample';
import MedicalExample from '@/components/examples/MedicalExample';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'encryption' | 'computation' | 'banking' | 'medical'>('encryption');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              FHEVM SDK Demo
            </h1>
            <p className="mt-2 text-gray-600">
              Framework-Agnostic Fully Homomorphic Encryption for Web3
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Key Manager Section */}
        <div className="mb-8">
          <KeyManager />
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-t-xl shadow-lg border-b border-gray-200">
          <nav className="flex space-x-1 p-2" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('encryption')}
              className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'encryption'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Encryption Demo
            </button>
            <button
              onClick={() => setActiveTab('computation')}
              className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'computation'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Computation Demo
            </button>
            <button
              onClick={() => setActiveTab('banking')}
              className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'banking'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Banking Example
            </button>
            <button
              onClick={() => setActiveTab('medical')}
              className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'medical'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Medical Example
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-xl shadow-lg p-6">
          {activeTab === 'encryption' && <EncryptionDemo />}
          {activeTab === 'computation' && <ComputationDemo />}
          {activeTab === 'banking' && <BankingExample />}
          {activeTab === 'medical' && <MedicalExample />}
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Fully Encrypted
            </h3>
            <p className="text-gray-600 text-sm">
              All sensitive data is encrypted using Fully Homomorphic Encryption, ensuring complete privacy.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Framework Agnostic
            </h3>
            <p className="text-gray-600 text-sm">
              Works seamlessly with React, Next.js, Vue, or any JavaScript framework.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Developer Friendly
            </h3>
            <p className="text-gray-600 text-sm">
              Simple API with TypeScript support, wagmi-like hooks, and comprehensive documentation.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              Built with FHEVM Universal SDK
            </p>
            <p className="text-sm">
              Demonstrating privacy-preserving computation on the blockchain
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
