import React from 'react';
import '../styles/Card.css';

export const Footer: React.FC = () => {
  return (
    <div className="card" style={{ textAlign: 'center', marginTop: '40px' }}>
      <h3>🔐 Privacy & Security Features</h3>
      <p>
        <strong>✓ Encrypted Evidence:</strong> All dispute evidence is encrypted using FHE
      </p>
      <p>
        <strong>✓ Anonymous Voting:</strong> Arbitrator votes remain private until resolution
      </p>
      <p>
        <strong>✓ Identity Protection:</strong> Participant identities are cryptographically
        protected
      </p>
      <p>
        <strong>✓ Fair Selection:</strong> Random arbitrator assignment ensures impartiality
      </p>
      <p>
        <strong>✓ Reputation System:</strong> Built-in reputation tracking for quality assurance
      </p>
    </div>
  );
};
