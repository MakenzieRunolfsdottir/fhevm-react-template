# React FHEVM Template

Quick-start template for building confidential dApps with React and FHEVM SDK.

## Quick Start

```bash
# Copy this template
cp -r templates/react my-fhevm-app
cd my-fhevm-app

# Install dependencies
npm install

# Run development server
npm start
```

## Usage

```tsx
// index.tsx
import { FhevmProvider } from '@fhevm/sdk';
import App from './App';

const config = {
  network: {
    chainId: 11155111,
    name: 'sepolia',
    rpcUrl: 'YOUR_RPC_URL'
  }
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <FhevmProvider config={config}>
    <App />
  </FhevmProvider>
);

// App.tsx
import { useFhevm } from '@fhevm/sdk';
import { ethers } from 'ethers';

function App() {
  const { client, init, isInitialized } = useFhevm();

  const connectAndEncrypt = async () => {
    // Initialize
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    await init(provider, signer);

    // Encrypt
    const encrypted = await client
      .createEncryptedInput(contractAddress, userAddress)
      .add32(1000)
      .encrypt();

    // Use encrypted.handles[0] and encrypted.inputProof in contract call
  };

  return <div>Your FHEVM App</div>;
}
```

## Features

- ✅ Framework-agnostic FHEVM SDK
- ✅ React hooks (useFhevm)
- ✅ TypeScript support
- ✅ Easy wallet integration
