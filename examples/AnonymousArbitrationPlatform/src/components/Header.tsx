import React from 'react';
import { CONTRACT_CONFIG } from '../types';
import '../styles/Header.css';

interface HeaderProps {
  currentChainId: number | null;
  userAddress: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  totalDisputes: number;
  activeArbitrators: number;
  resolvedDisputes: number;
  userReputation: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentChainId,
  userAddress,
  onConnect,
  onDisconnect,
  totalDisputes,
  activeArbitrators,
  resolvedDisputes,
  userReputation,
}) => {
  const isCorrectNetwork = currentChainId === CONTRACT_CONFIG.REQUIRED_CHAIN_ID;

  return (
    <div className="header">
      <h1>🔒 Anonymous Arbitration Platform</h1>
      <p>Privacy-Preserving Dispute Resolution Using Zero-Knowledge Cryptography</p>

      <div
        className="network-info"
        style={{
          background: isCorrectNetwork
            ? 'rgba(40, 167, 69, 0.3)'
            : 'rgba(220, 53, 69, 0.3)',
        }}
      >
        Network: {currentChainId ? `Chain ID ${currentChainId}` : 'Not Connected'}{' '}
        {isCorrectNetwork ? '✅' : '❌'} | Required: {CONTRACT_CONFIG.REQUIRED_NETWORK_NAME} (Chain
        ID: {CONTRACT_CONFIG.REQUIRED_CHAIN_ID})
      </div>

      <div className="wallet-status">
        {userAddress ? (
          <>
            <div style={{ color: '#28a745', fontWeight: 'bold' }}>
              ✅ Connected: {userAddress.substring(0, 6)}...{userAddress.substring(38)}
            </div>
            <button className="btn btn-disconnect" onClick={onDisconnect}>
              Disconnect
            </button>
          </>
        ) : (
          <button className="btn" onClick={onConnect}>
            Connect Wallet
          </button>
        )}
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-number">{totalDisputes}</span>
          <div className="stat-label">Total Disputes</div>
        </div>
        <div className="stat-item">
          <span className="stat-number">{activeArbitrators}</span>
          <div className="stat-label">Active Arbitrators</div>
        </div>
        <div className="stat-item">
          <span className="stat-number">{resolvedDisputes}</span>
          <div className="stat-label">Resolved Cases</div>
        </div>
        <div className="stat-item">
          <span className="stat-number">{userReputation}</span>
          <div className="stat-label">Your Reputation</div>
        </div>
      </div>
    </div>
  );
};
