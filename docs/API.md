# FHEVM SDK API Documentation

## FhevmClient

The core client for interacting with FHEVM.

### Constructor

```typescript
new FhevmClient(config: FhevmConfig)
```

**Parameters:**
- `config.network.chainId`: Network chain ID (e.g., 11155111 for Sepolia)
- `config.network.name`: Network name (e.g., 'sepolia')
- `config.network.rpcUrl`: RPC endpoint URL

**Example:**
```typescript
const client = new FhevmClient({
  network: {
    chainId: 11155111,
    name: 'sepolia',
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY'
  }
});
```

### Methods

#### `init(provider, signer)`

Initialize the FHEVM client with a provider and signer.

**Parameters:**
- `provider`: ethers.js BrowserProvider or JsonRpcProvider
- `signer`: ethers.js Signer

**Returns:** `Promise<void>`

**Example:**
```typescript
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
await client.init(provider, signer);
```

#### `createEncryptedInput(contractAddress, userAddress)`

Create an encrypted input builder for contract interaction.

**Parameters:**
- `contractAddress`: Contract address (0x...)
- `userAddress`: User's wallet address (0x...)

**Returns:** `EncryptedInputBuilder`

**Example:**
```typescript
const builder = client.createEncryptedInput(
  '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  userAddress
);
```

#### `userDecrypt(handle, contractAddress, userAddress)`

Decrypt an encrypted value with user signature (EIP-712).

**Parameters:**
- `handle`: Encrypted handle from contract
- `contractAddress`: Contract address
- `userAddress`: User's wallet address

**Returns:** `Promise<number | bigint | boolean>`

**Example:**
```typescript
const decrypted = await client.userDecrypt(
  encryptedHandle,
  contractAddress,
  userAddress
);
```

#### `publicDecrypt(handle, contractAddress)`

Decrypt a publicly decryptable value.

**Parameters:**
- `handle`: Encrypted handle
- `contractAddress`: Contract address

**Returns:** `Promise<number | bigint | boolean>`

**Example:**
```typescript
const value = await client.publicDecrypt(handle, contractAddress);
```

## EncryptedInputBuilder

Builder for creating encrypted inputs.

### Methods

#### `add8(value)`
Add encrypted uint8 value.

#### `add16(value)`
Add encrypted uint16 value.

#### `add32(value)`
Add encrypted uint32 value.

#### `add64(value)`
Add encrypted uint64 value.

#### `add128(value)`
Add encrypted uint128 value.

#### `addBool(value)`
Add encrypted boolean value.

#### `addAddress(value)`
Add encrypted address value.

#### `encrypt()`

Finalize and encrypt all added values.

**Returns:** `Promise<EncryptedInput>`

**Example:**
```typescript
const encrypted = await client
  .createEncryptedInput(contractAddress, userAddress)
  .add32(1000)
  .add64(BigInt(5000))
  .addBool(true)
  .encrypt();

// Use in contract call
await contract.submitValues(
  encrypted.handles[0],
  encrypted.handles[1],
  encrypted.handles[2],
  encrypted.inputProof
);
```

## React Hooks

### useFhevm()

React hook for accessing the FHEVM client.

**Returns:**
```typescript
{
  client: FhevmClient | null;
  init: (provider, signer) => Promise<void>;
  isInitialized: boolean;
}
```

**Example:**
```typescript
function MyComponent() {
  const { client, init, isInitialized } = useFhevm();

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      provider.getSigner().then(signer => init(provider, signer));
    }
  }, []);

  return isInitialized ? <div>Ready!</div> : <div>Connecting...</div>;
}
```

## React Components

### FhevmProvider

Context provider for the FHEVM client.

**Props:**
- `config`: FhevmConfig object
- `children`: React children

**Example:**
```typescript
function App() {
  return (
    <FhevmProvider config={{ network: { chainId: 11155111, name: 'sepolia', rpcUrl: 'https://...' } }}>
      <MyApp />
    </FhevmProvider>
  );
}
```

## Types

### FhevmConfig

```typescript
interface FhevmConfig {
  network: {
    chainId: number;
    name: string;
    rpcUrl: string;
  };
}
```

### EncryptedInput

```typescript
interface EncryptedInput {
  handles: string[];
  inputProof: string;
}
```

### DecryptionResult

```typescript
type DecryptionResult = number | bigint | boolean;
```

## Error Handling

All async methods may throw errors. Always wrap in try-catch:

```typescript
try {
  const encrypted = await client
    .createEncryptedInput(contractAddress, userAddress)
    .add32(1000)
    .encrypt();
} catch (error) {
  console.error('Encryption failed:', error);
}
```

## Common Patterns

### Connect Wallet & Initialize

```typescript
async function connectWallet() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  await client.init(provider, signer);
}
```

### Encrypt and Submit to Contract

```typescript
async function submitEncryptedValue(value: number) {
  const encrypted = await client
    .createEncryptedInput(contractAddress, userAddress)
    .add32(value)
    .encrypt();

  const contract = new ethers.Contract(contractAddress, abi, signer);
  const tx = await contract.submitValue(
    encrypted.handles[0],
    encrypted.inputProof
  );
  await tx.wait();
}
```

### Decrypt Contract Result

```typescript
async function getDecryptedValue() {
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const encryptedHandle = await contract.getValue();

  const decrypted = await client.userDecrypt(
    encryptedHandle,
    contractAddress,
    userAddress
  );

  return decrypted;
}
```
