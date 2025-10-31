# FHEVM SDK Usage Guide

## Getting Started

### Installation

```bash
npm install @fhevm/sdk ethers
```

### Basic Setup

1. **Import the SDK**

```typescript
import { FhevmClient } from '@fhevm/sdk';
import { ethers } from 'ethers';
```

2. **Create Configuration**

```typescript
const config = {
  network: {
    chainId: 11155111,
    name: 'sepolia',
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY'
  }
};
```

3. **Initialize Client**

```typescript
const client = new FhevmClient(config);
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
await client.init(provider, signer);
```

## Core Workflows

### Encryption Workflow

**Step 1:** Create encrypted input builder
```typescript
const builder = client.createEncryptedInput(
  contractAddress,
  userAddress
);
```

**Step 2:** Add values to encrypt
```typescript
builder
  .add32(1000)      // uint32
  .add64(BigInt(5000)) // uint64
  .addBool(true);   // bool
```

**Step 3:** Encrypt
```typescript
const encrypted = await builder.encrypt();
```

**Step 4:** Use in contract call
```typescript
const contract = new ethers.Contract(contractAddress, abi, signer);
await contract.submitData(
  encrypted.handles[0],
  encrypted.handles[1],
  encrypted.handles[2],
  encrypted.inputProof
);
```

### Decryption Workflow

**User Decryption (with EIP-712 signature):**
```typescript
const decrypted = await client.userDecrypt(
  encryptedHandle,
  contractAddress,
  userAddress
);
```

**Public Decryption (no signature):**
```typescript
const value = await client.publicDecrypt(
  encryptedHandle,
  contractAddress
);
```

## Framework Integration

### React

**1. Setup Provider**

```tsx
// App.tsx
import { FhevmProvider } from '@fhevm/sdk';

function App() {
  return (
    <FhevmProvider config={config}>
      <YourApp />
    </FhevmProvider>
  );
}
```

**2. Use Hook**

```tsx
// Component.tsx
import { useFhevm } from '@fhevm/sdk';

function MyComponent() {
  const { client, init, isInitialized } = useFhevm();

  const handleEncrypt = async () => {
    if (!client) return;

    const encrypted = await client
      .createEncryptedInput(contractAddress, userAddress)
      .add32(1000)
      .encrypt();
  };

  return <button onClick={handleEncrypt}>Encrypt</button>;
}
```

### Next.js (App Router)

**1. Layout Setup**

```tsx
// app/layout.tsx
import { FhevmProvider } from '@fhevm/sdk';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <FhevmProvider config={config}>
          {children}
        </FhevmProvider>
      </body>
    </html>
  );
}
```

**2. Client Component**

```tsx
// app/page.tsx
'use client';

import { useFhevm } from '@fhevm/sdk';

export default function Home() {
  const { client } = useFhevm();
  // Use client
}
```

### Next.js (Pages Router)

**1. App Setup**

```tsx
// pages/_app.tsx
import { FhevmProvider } from '@fhevm/sdk';

export default function App({ Component, pageProps }) {
  return (
    <FhevmProvider config={config}>
      <Component {...pageProps} />
    </FhevmProvider>
  );
}
```

**2. Page Component**

```tsx
// pages/index.tsx
import { useFhevm } from '@fhevm/sdk';

export default function Home() {
  const { client } = useFhevm();
  // Use client
}
```

### Vue

```vue
<script setup>
import { ref, onMounted } from 'vue';
import { FhevmClient } from '@fhevm/sdk';

const client = ref(null);

onMounted(async () => {
  const fhevmClient = new FhevmClient(config);
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  await fhevmClient.init(provider, signer);

  client.value = fhevmClient;
});

const encrypt = async () => {
  const encrypted = await client.value
    .createEncryptedInput(contractAddress, userAddress)
    .add32(1000)
    .encrypt();
};
</script>
```

### Node.js

```javascript
const { FhevmClient } = require('@fhevm/sdk');
const { ethers } = require('ethers');

async function main() {
  const client = new FhevmClient(config);

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  await client.init(provider, wallet);

  // Use client
}

main();
```

## Advanced Usage

### Batch Encryption

```typescript
const encrypted = await client
  .createEncryptedInput(contractAddress, userAddress)
  .add32(100)
  .add32(200)
  .add32(300)
  .encrypt();

// encrypted.handles will contain 3 handles
```

### Multiple Data Types

```typescript
const encrypted = await client
  .createEncryptedInput(contractAddress, userAddress)
  .add8(10)           // uint8
  .add16(1000)        // uint16
  .add32(100000)      // uint32
  .add64(BigInt(1000000)) // uint64
  .addBool(true)      // bool
  .addAddress('0x...') // address
  .encrypt();
```

### Error Handling

```typescript
try {
  const encrypted = await client
    .createEncryptedInput(contractAddress, userAddress)
    .add32(1000)
    .encrypt();
} catch (error) {
  if (error.message.includes('User rejected')) {
    console.log('User cancelled the signature');
  } else {
    console.error('Encryption failed:', error);
  }
}
```

### Type Checking

```typescript
import type { FhevmClient, EncryptedInput } from '@fhevm/sdk';

const client: FhevmClient = new FhevmClient(config);
const encrypted: EncryptedInput = await builder.encrypt();
```

## Best Practices

### 1. Initialize Once

```typescript
// Good
const client = new FhevmClient(config);
await client.init(provider, signer);

// Bad - don't recreate client repeatedly
function encrypt() {
  const client = new FhevmClient(config); // ❌
}
```

### 2. Check Initialization

```typescript
// React
const { client, isInitialized } = useFhevm();

if (!isInitialized || !client) {
  return <div>Connecting...</div>;
}
```

### 3. Handle Signatures

```typescript
// User may reject EIP-712 signature
try {
  const decrypted = await client.userDecrypt(handle, contractAddress, userAddress);
} catch (error) {
  if (error.code === 4001) {
    console.log('User rejected signature');
  }
}
```

### 4. Validate Inputs

```typescript
// Validate before encryption
if (!contractAddress || !userAddress) {
  throw new Error('Missing addresses');
}

if (value < 0) {
  throw new Error('Value must be positive');
}
```

### 5. Use TypeScript

```typescript
// Define types for your data
interface UserData {
  balance: number;
  score: number;
  isActive: boolean;
}

async function encryptUserData(data: UserData) {
  return await client
    .createEncryptedInput(contractAddress, userAddress)
    .add32(data.balance)
    .add32(data.score)
    .addBool(data.isActive)
    .encrypt();
}
```

## Common Patterns

### Connect Wallet Button

```tsx
function ConnectButton() {
  const { init } = useFhevm();
  const [account, setAccount] = useState('');

  const connect = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    await init(provider, signer);
    setAccount(address);
  };

  return (
    <button onClick={connect}>
      {account ? `Connected: ${account.slice(0, 6)}...` : 'Connect'}
    </button>
  );
}
```

### Form with Encryption

```tsx
function EncryptedForm() {
  const { client } = useFhevm();
  const [value, setValue] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const encrypted = await client
      .createEncryptedInput(contractAddress, userAddress)
      .add32(parseInt(value))
      .encrypt();

    const contract = new ethers.Contract(contractAddress, abi, signer);
    await contract.submit(encrypted.handles[0], encrypted.inputProof);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit">Submit Encrypted</button>
    </form>
  );
}
```

## Troubleshooting

### Client Not Initialized

**Problem:** `client is null`

**Solution:** Ensure you call `init()` before using the client:
```typescript
const { client, init } = useFhevm();

useEffect(() => {
  if (window.ethereum) {
    // Initialize here
  }
}, []);
```

### Signature Rejected

**Problem:** User rejects EIP-712 signature

**Solution:** Handle the error gracefully:
```typescript
try {
  await client.userDecrypt(handle, contractAddress, userAddress);
} catch (error) {
  if (error.code === 4001) {
    alert('Signature required for decryption');
  }
}
```

### Wrong Network

**Problem:** Connected to wrong network

**Solution:** Add network check:
```typescript
const chainId = await provider.getNetwork().then(n => n.chainId);
if (chainId !== config.network.chainId) {
  alert('Please switch to the correct network');
}
```
