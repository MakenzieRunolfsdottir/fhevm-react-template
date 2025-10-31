import React, { useState } from 'react';
import { ArbitratorInfo } from '../types';
import { ethers } from 'ethers';
import '../styles/Card.css';

interface PlatformAnalyticsProps {
  getUserReputation: (address: string) => Promise<bigint>;
  getArbitratorInfo: (address: string) => Promise<ArbitratorInfo>;
  onRefreshStats: () => void;
  userAddress: string | null;
  showMessage: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const PlatformAnalytics: React.FC<PlatformAnalyticsProps> = ({
  getUserReputation,
  getArbitratorInfo,
  onRefreshStats,
  userAddress,
  showMessage,
}) => {
  const [address, setAddress] = useState('');
  const [userStats, setUserStats] = useState<{
    address: string;
    reputation: string;
    arbitratorInfo: ArbitratorInfo;
  } | null>(null);

  const handleCheckReputation = async () => {
    const checkAddress = address || userAddress;
    if (!checkAddress) {
      showMessage('Please enter a user address or connect wallet', 'error');
      return;
    }

    if (!ethers.isAddress(checkAddress)) {
      showMessage('Please enter a valid address', 'error');
      return;
    }

    try {
      const reputation = await getUserReputation(checkAddress);
      const arbitratorInfo = await getArbitratorInfo(checkAddress);

      setUserStats({
        address: checkAddress,
        reputation: reputation.toString(),
        arbitratorInfo,
      });
    } catch (error: any) {
      showMessage(error.message || 'Failed to check user reputation', 'error');
    }
  };

  const handleRefreshStats = () => {
    onRefreshStats();
    showMessage('Statistics refreshed', 'info');
  };

  return (
    <div className="card">
      <h3>📊 Platform Analytics</h3>
      <div className="input-group">
        <label htmlFor="userAddress">User Address (Optional):</label>
        <input
          type="text"
          id="userAddress"
          placeholder="Check specific user reputation"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <button className="btn" onClick={handleCheckReputation}>
        Check Reputation
      </button>
      <button className="btn" onClick={handleRefreshStats}>
        Refresh Statistics
      </button>

      {userStats && (
        <div className="status-card">
          <h4>User Statistics</h4>
          <div>
            <p>
              <strong>Address:</strong> {userStats.address}
            </p>
            <p>
              <strong>Reputation:</strong> {userStats.reputation}
            </p>
            <p>
              <strong>Is Arbitrator:</strong> {userStats.arbitratorInfo.isActive ? 'Yes' : 'No'}
            </p>
            {userStats.arbitratorInfo.isActive && (
              <>
                <p>
                  <strong>Arbitrator Reputation:</strong>{' '}
                  {userStats.arbitratorInfo.reputation.toString()}
                </p>
                <p>
                  <strong>Cases Handled:</strong>{' '}
                  {userStats.arbitratorInfo.casesHandled.toString()}
                </p>
                <p>
                  <strong>Successful Cases:</strong>{' '}
                  {userStats.arbitratorInfo.successfulCases.toString()}
                </p>
                <p>
                  <strong>Identity Verified:</strong>{' '}
                  {userStats.arbitratorInfo.identityVerified ? 'Yes' : 'No'}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
