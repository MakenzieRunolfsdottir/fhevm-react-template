import React, { useState } from 'react';
import { VoteParams } from '../types';
import '../styles/Card.css';

interface VotingInterfaceProps {
  onSubmitVote: (params: VoteParams) => Promise<void>;
  loading: string | null;
  showMessage: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const VotingInterface: React.FC<VotingInterfaceProps> = ({
  onSubmitVote,
  loading,
  showMessage,
}) => {
  const [disputeId, setDisputeId] = useState('');
  const [vote, setVote] = useState('');
  const [justification, setJustification] = useState('');

  const handleSubmitVote = async () => {
    try {
      await onSubmitVote({
        disputeId: parseInt(disputeId),
        vote: parseInt(vote),
        justification: parseInt(justification),
      });
      showMessage('Vote submitted successfully!', 'success');
      setDisputeId('');
      setVote('');
      setJustification('');
    } catch (error: any) {
      showMessage(error.message || 'Failed to submit vote', 'error');
    }
  };

  const isLoading = loading === 'submitVote';

  return (
    <div className="card">
      <h3>🗳️ Cast Your Vote</h3>
      <div className="input-group">
        <label htmlFor="voteDisputeId">Dispute ID:</label>
        <input
          type="number"
          id="voteDisputeId"
          placeholder="Enter dispute ID"
          value={disputeId}
          onChange={(e) => setDisputeId(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label htmlFor="voteOption">Your Decision:</label>
        <select id="voteOption" value={vote} onChange={(e) => setVote(e.target.value)}>
          <option value="">Select your vote</option>
          <option value="1">Favor Plaintiff</option>
          <option value="2">Favor Defendant</option>
          <option value="3">Neutral/Inconclusive</option>
        </select>
      </div>
      <div className="input-group">
        <label htmlFor="justification">Justification Code:</label>
        <input
          type="number"
          id="justification"
          placeholder="Numeric justification code"
          value={justification}
          onChange={(e) => setJustification(e.target.value)}
        />
      </div>
      <button className="btn" onClick={handleSubmitVote} disabled={isLoading}>
        {isLoading ? (
          <>
            <div className="loading"></div>Processing...
          </>
        ) : (
          'Submit Vote'
        )}
      </button>
    </div>
  );
};
