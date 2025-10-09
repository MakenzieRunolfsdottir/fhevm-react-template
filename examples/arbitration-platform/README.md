# Anonymous Arbitration Platform

This is an imported example dApp demonstrating privacy-preserving dispute resolution using FHEVM.

## Overview

The Anonymous Arbitration Platform allows users to:
- Submit disputes with encrypted evidence
- Assign anonymous arbitrators
- Cast encrypted votes on disputes
- Automatically resolve disputes based on majority vote
- Maintain privacy throughout the arbitration process

## Smart Contract Features

### Core Functionality

1. **Dispute Creation**
   - Encrypted stake amounts
   - Encrypted evidence hashes
   - Plaintiff and defendant roles

2. **Arbitrator Management**
   - Registration with encrypted identity proofs
   - Reputation scoring
   - Random arbitrator assignment

3. **Anonymous Voting**
   - Fully encrypted votes
   - Encrypted justifications
   - Majority-based resolution

4. **Decision Process**
   - Automatic vote tallying
   - FHE-based decryption
   - Winner determination

## Contract Structure

```solidity
// Main contract
contract AnonymousArbitrationPlatform {
    // Core structs
    struct Dispute { ... }
    struct ArbitratorProfile { ... }
    struct VoteRecord { ... }

    // Key functions
    function registerArbitrator(uint32 _identityProof) external;
    function createDispute(address _defendant, uint32 _stakeAmount, uint32 _evidenceHash) external payable;
    function assignArbitrators(uint256 _disputeId) external;
    function submitVote(uint256 _disputeId, uint8 _vote, uint32 _justification) external;
}
```

## Using with FHEVM SDK

### 1. Initialize SDK

```typescript
import { FhevmClient } from '@fhevm/sdk';

const config = {
  network: {
    chainId: 11155111,
    name: 'sepolia',
    rpcUrl: 'YOUR_RPC_URL'
  }
};

const client = new FhevmClient(config);
await client.init(provider, signer);
```

### 2. Create Encrypted Dispute

```typescript
// Encrypt stake amount
const encrypted = await client
  .createEncryptedInput(contractAddress, userAddress)
  .add32(stakeAmount)
  .add32(evidenceHash)
  .encrypt();

// Submit dispute
const contract = client.getContract(contractAddress, abi);
await contract.createDispute(
  defendantAddress,
  encrypted.handles[0],
  encrypted.handles[1],
  { value: ethers.parseEther('0.001') }
);
```

### 3. Submit Encrypted Vote

```typescript
// Encrypt vote (1=plaintiff, 2=defendant, 3=neutral)
const encryptedVote = await client
  .createEncryptedInput(contractAddress, arbitratorAddress)
  .add8(voteValue)
  .add32(justificationHash)
  .encrypt();

// Submit vote
await contract.submitVote(
  disputeId,
  encryptedVote.handles[0],
  encryptedVote.handles[1]
);
```

### 4. Query Dispute Status

```typescript
// Get dispute information
const [plaintiff, defendant, status, createdAt, votingDeadline, arbitratorCount, revealed, winner] =
  await contract.getDisputeInfo(disputeId);

console.log('Dispute Status:', status);
console.log('Winner:', winner);
```

## Deployment

### Prerequisites

- Node.js 18+
- Hardhat development environment
- Sepolia testnet ETH

### Setup

```bash
# Install dependencies
npm install

# Copy environment template
cp ../.env.example .env

# Configure .env with your values
# SEPOLIA_RPC_URL=your_rpc_url
# PRIVATE_KEY=your_private_key
# ETHERSCAN_API_KEY=your_api_key
```

### Compile

```bash
npm run compile
```

### Deploy

```bash
npm run deploy
```

### Interact

```bash
npm run interact
```

## Integration Examples

### React Component

```tsx
import { useFhevm } from '@fhevm/sdk';

function DisputeSubmit() {
  const { createEncryptedInput, getContract } = useFhevm();

  const submitDispute = async () => {
    const encrypted = await createEncryptedInput(contractAddress, account)
      .add32(stakeAmount)
      .add32(evidenceHash)
      .encrypt();

    const contract = getContract(contractAddress, abi);
    await contract.createDispute(defendant, encrypted.handles[0], encrypted.handles[1]);
  };

  return <button onClick={submitDispute}>Submit Dispute</button>;
}
```

### Node.js Script

```javascript
const { FhevmClient } = require('@fhevm/sdk');
const { ethers } = require('ethers');

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  const client = new FhevmClient(config);
  await client.init(provider, wallet);

  // Use client for encrypted operations
  const encrypted = await client
    .createEncryptedInput(contractAddress, wallet.address)
    .add32(1000)
    .encrypt();

  // Submit to contract
  const contract = client.getContract(contractAddress, abi);
  const tx = await contract.createDispute(defendant, encrypted.handles[0], encrypted.inputProof);
  await tx.wait();
}
```

## Privacy Features

### Encrypted Data

- ✅ Stake amounts (euint32)
- ✅ Evidence hashes (euint32)
- ✅ Arbitrator identity proofs (euint32)
- ✅ Votes (euint8)
- ✅ Justifications (euint32)

### Anonymous Operations

- ✅ Arbitrator identities hidden
- ✅ Individual votes never revealed
- ✅ Only final aggregate result disclosed
- ✅ Evidence remains confidential

## Testing

```bash
# Run tests
npm test

# Test on Sepolia
npm run test:sepolia
```

## Security Considerations

- All sensitive data encrypted with FHE
- Votes cannot be observed before decryption
- Arbitrator selection randomized
- Reputation system prevents gaming
- Emergency pause functionality
- Access control enforced

## Contract Addresses

### Sepolia Testnet

- Contract: `0x019487001FaCC26883f8760b72B0DAef2cbFa1bd`
- Network: Sepolia (Chain ID: 11155111)
- Explorer: [View on Etherscan](https://sepolia.etherscan.io/address/0x019487001FaCC26883f8760b72B0DAef2cbFa1bd)

## Learn More

- [FHEVM SDK Documentation](../../README.md)
- [Zama FHEVM Docs](https://docs.zama.ai/fhevm)
- [Smart Contract Source](./contracts/AnonymousArbitrationPlatform.sol)

## License

MIT
