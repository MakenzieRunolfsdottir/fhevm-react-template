import React, { useState, useEffect } from 'react';
import { ArbitratorInfo } from '../types';
import '../styles/Card.css';

interface ArbitratorRegistrationProps {
  onRegister: (identityProof: number) => Promise<void>;
  getArbitratorInfo: (address: string) => Promise<ArbitratorInfo>;
  userAddress: string | null;
  loading: string | null;
  showMessage: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const ArbitratorRegistration: React.FC<ArbitratorRegistrationProps> = ({
  onRegister,
  getArbitratorInfo,
  userAddress,
  loading,
  showMessage,
}) => {
  const [identityProof, setIdentityProof] = useState('');
  const [arbitratorInfo, setArbitratorInfo] = useState<ArbitratorInfo | null>(null);

  useEffect(() => {
    const loadArbitratorInfo = async () => {
      if (userAddress) {
        try {
          const info = await getArbitratorInfo(userAddress);
          if (info.isActive) {
            setArbitratorInfo(info);
          }
        } catch (error) {
          console.error('Failed to load arbitrator info:', error);
        }
      }
    };

    loadArbitratorInfo();
  }, [userAddress, getArbitratorInfo]);

  const handleRegister = async () => {
    try {
      await onRegister(parseInt(identityProof));
      showMessage('Successfully registered as arbitrator!', 'success');
      setIdentityProof('');

      if (userAddress) {
        const info = await getArbitratorInfo(userAddress);
        setArbitratorInfo(info);
      }
    } catch (error: any) {
      showMessage(error.message || 'Registration failed', 'error');
    }
  };

  const isLoading = loading === 'registerArbitrator';

  return (
    <div className="card">
      <h3>🎖️ Become an Arbitrator</h3>
      <div className="input-group">
        <label htmlFor="identityProof">Identity Verification Code:</label>
        <input
          type="number"
          id="identityProof"
          placeholder="Enter verification code"
          value={identityProof}
          onChange={(e) => setIdentityProof(e.target.value)}
        />
      </div>
      <button className="btn" onClick={handleRegister} disabled={isLoading}>
        {isLoading ? (
          <>
            <div className="loading"></div>Processing...
          </>
        ) : (
          'Register as Arbitrator'
        )}
      </button>

      {arbitratorInfo && arbitratorInfo.isActive && (
        <div className="status-card">
          <h4>Arbitrator Status</h4>
          <p>
            Reputation: <span>{arbitratorInfo.reputation.toString()}</span>
          </p>
          <p>
            Cases Handled: <span>{arbitratorInfo.casesHandled.toString()}</span>
          </p>
          <p>
            Success Rate:{' '}
            <span>
              {Number(arbitratorInfo.casesHandled) > 0
                ? (
                    (Number(arbitratorInfo.successfulCases) / Number(arbitratorInfo.casesHandled)) *
                    100
                  ).toFixed(1)
                : 0}
              %
            </span>
          </p>
        </div>
      )}
    </div>
  );
};
