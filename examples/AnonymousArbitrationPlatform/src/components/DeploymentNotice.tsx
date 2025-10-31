import React from 'react';
import '../styles/Card.css';

export const DeploymentNotice: React.FC = () => {
  return (
    <div className="card">
      <h3>🚀 Contract Deployment Required</h3>
      <p>
        <strong>To use this platform, you need to deploy the smart contract first:</strong>
      </p>
      <ol>
        <li>Deploy the AnonymousArbitrationPlatform.sol contract to Sepolia testnet</li>
        <li>Update the CONTRACT_ADDRESS in src/types/index.ts with your deployed contract address</li>
        <li>Make sure you have Sepolia testnet ETH for transactions</li>
      </ol>
      <p>
        <strong>Contract Location:</strong> /contracts/AnonymousArbitrationPlatform.sol
      </p>
      <div className="info">
        <strong>Note:</strong> This is a production-ready frontend that requires a real deployed
        contract on Sepolia testnet.
      </div>
    </div>
  );
};
