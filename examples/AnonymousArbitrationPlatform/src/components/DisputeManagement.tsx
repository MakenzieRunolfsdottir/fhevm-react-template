import React, { useState } from 'react';
import { DisputeInfo, DisputeStatus } from '../types';
import '../styles/Card.css';

interface DisputeManagementProps {
  onAssignArbitrators: (disputeId: number) => Promise<void>;
  onGetDisputeInfo: (disputeId: number) => Promise<DisputeInfo>;
  loading: string | null;
  showMessage: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const DisputeManagement: React.FC<DisputeManagementProps> = ({
  onAssignArbitrators,
  onGetDisputeInfo,
  loading,
  showMessage,
}) => {
  const [disputeId, setDisputeId] = useState('');
  const [disputeInfo, setDisputeInfo] = useState<DisputeInfo | null>(null);

  const handleAssignArbitrators = async () => {
    try {
      await onAssignArbitrators(parseInt(disputeId));
      showMessage('Arbitrators assigned successfully!', 'success');
    } catch (error: any) {
      showMessage(error.message || 'Failed to assign arbitrators', 'error');
    }
  };

  const handleGetDisputeInfo = async () => {
    try {
      const info = await onGetDisputeInfo(parseInt(disputeId));
      setDisputeInfo(info);
    } catch (error: any) {
      showMessage(error.message || 'Failed to get dispute info', 'error');
      setDisputeInfo(null);
    }
  };

  const statusNames = ['Created', 'InArbitration', 'Voting', 'Resolved', 'Cancelled'];

  return (
    <div className="card">
      <h3>📋 Manage Disputes</h3>
      <div className="input-group">
        <label htmlFor="disputeId">Dispute ID:</label>
        <input
          type="number"
          id="disputeId"
          placeholder="Enter dispute ID"
          value={disputeId}
          onChange={(e) => setDisputeId(e.target.value)}
        />
      </div>
      <button
        className="btn"
        onClick={handleAssignArbitrators}
        disabled={loading === 'assignArbitrators'}
      >
        {loading === 'assignArbitrators' ? (
          <>
            <div className="loading"></div>Processing...
          </>
        ) : (
          'Assign Arbitrators'
        )}
      </button>
      <button className="btn" onClick={handleGetDisputeInfo}>
        Get Dispute Info
      </button>

      {disputeInfo && (
        <div className="status-card">
          <h4>Dispute Information</h4>
          <div>
            <p>
              <strong>Plaintiff:</strong> {disputeInfo.plaintiff}
            </p>
            <p>
              <strong>Defendant:</strong> {disputeInfo.defendant}
            </p>
            <p>
              <strong>Status:</strong> {statusNames[disputeInfo.status] || 'Unknown'}
            </p>
            <p>
              <strong>Created:</strong>{' '}
              {new Date(Number(disputeInfo.createdAt) * 1000).toLocaleString()}
            </p>
            <p>
              <strong>Voting Deadline:</strong>{' '}
              {Number(disputeInfo.votingDeadline) > 0
                ? new Date(Number(disputeInfo.votingDeadline) * 1000).toLocaleString()
                : 'Not set'}
            </p>
            <p>
              <strong>Arbitrators:</strong> {disputeInfo.arbitratorsCount.toString()}
            </p>
            <p>
              <strong>Decision Revealed:</strong> {disputeInfo.decisionRevealed ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Winner:</strong>{' '}
              {disputeInfo.winner === '0x0000000000000000000000000000000000000000'
                ? 'Not decided'
                : disputeInfo.winner}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
