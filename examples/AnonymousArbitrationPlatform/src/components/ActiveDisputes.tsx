import React from 'react';
import '../styles/Card.css';

interface ActiveDisputesProps {
  showMessage: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const ActiveDisputes: React.FC<ActiveDisputesProps> = ({ showMessage }) => {
  const handleLoadDisputes = () => {
    showMessage(
      'This feature requires additional contract queries. Check individual disputes by ID.',
      'info'
    );
  };

  return (
    <div className="card">
      <h3>🔍 Active Disputes</h3>
      <button className="btn" onClick={handleLoadDisputes}>
        Load My Disputes
      </button>
      <div className="status-card">
        <p>Click "Load My Disputes" to see your active cases</p>
      </div>
    </div>
  );
};
