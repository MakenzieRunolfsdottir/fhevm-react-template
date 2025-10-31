import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { FhevmProvider } from './contexts/FhevmContext';
import './styles/index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// FHEVM Configuration
const fhevmConfig = {
  chainId: 11155111,
  networkName: 'sepolia',
  rpcUrl: 'https://ethereum-sepolia.publicnode.com'
};

root.render(
  <React.StrictMode>
    <FhevmProvider config={fhevmConfig}>
      <App />
    </FhevmProvider>
  </React.StrictMode>
);
