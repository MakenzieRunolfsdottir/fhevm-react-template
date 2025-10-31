import React, { useState } from 'react';
import { CreateDisputeParams } from '../types';
import '../styles/Card.css';

interface CreateDisputeProps {
  onCreate: (params: CreateDisputeParams) => Promise<void>;
  loading: string | null;
  showMessage: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const CreateDispute: React.FC<CreateDisputeProps> = ({ onCreate, loading, showMessage }) => {
  const [defendant, setDefendant] = useState('');
  const [stakeAmount, setStakeAmount] = useState('0.001');
  const [evidenceHash, setEvidenceHash] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = async () => {
    try {
      await onCreate({
        defendant,
        stakeAmount,
        evidenceHash: parseInt(evidenceHash),
        description,
      });
      showMessage('Dispute created successfully!', 'success');
      setDefendant('');
      setStakeAmount('0.001');
      setEvidenceHash('');
      setDescription('');
    } catch (error: any) {
      showMessage(error.message || 'Failed to create dispute', 'error');
    }
  };

  const isLoading = loading === 'createDispute';

  return (
    <div className="card">
      <h3>⚖️ File New Dispute</h3>
      <div className="input-group">
        <label htmlFor="defendantAddress">Defendant Address:</label>
        <input
          type="text"
          id="defendantAddress"
          placeholder="0x..."
          value={defendant}
          onChange={(e) => setDefendant(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label htmlFor="stakeAmount">Stake Amount (ETH):</label>
        <input
          type="number"
          id="stakeAmount"
          step="0.001"
          min="0.001"
          value={stakeAmount}
          onChange={(e) => setStakeAmount(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label htmlFor="evidenceHash">Evidence Hash:</label>
        <input
          type="number"
          id="evidenceHash"
          placeholder="Numeric hash of evidence"
          value={evidenceHash}
          onChange={(e) => setEvidenceHash(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label htmlFor="disputeDescription">Dispute Description (Optional):</label>
        <textarea
          id="disputeDescription"
          rows={3}
          placeholder="Brief description of the dispute..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button className="btn" onClick={handleCreate} disabled={isLoading}>
        {isLoading ? (
          <>
            <div className="loading"></div>Processing...
          </>
        ) : (
          'Create Dispute'
        )}
      </button>
    </div>
  );
};
