# Node.js FHEVM Template

Quick-start template for building server-side confidential applications with Node.js and FHEVM SDK.

## Quick Start

```bash
# Copy this template
cp -r templates/nodejs my-fhevm-app
cd my-fhevm-app

# Install dependencies
npm install

# Run application
node index.js
```

## Usage

```javascript
// index.js
const { FhevmClient } = require('@fhevm/sdk');
const { ethers } = require('ethers');

async function main() {
  // Create client
  const client = new FhevmClient({
    network: {
      chainId: 11155111,
      name: 'sepolia',
      rpcUrl: process.env.RPC_URL
    }
  });

  // Setup provider and signer
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // Initialize
  await client.init(provider, wallet);

  // Encrypt value
  const encrypted = await client
    .createEncryptedInput(contractAddress, wallet.address)
    .add32(1000)
    .encrypt();

  console.log('Encrypted:', encrypted);

  // Call contract
  const contract = new ethers.Contract(contractAddress, abi, wallet);
  const tx = await contract.submitValue(
    encrypted.handles[0],
    encrypted.inputProof
  );
  await tx.wait();

  // Decrypt result
  const result = await contract.getValue();
  const decrypted = await client.userDecrypt(
    result,
    contractAddress,
    wallet.address
  );

  console.log('Decrypted:', decrypted);
}

main().catch(console.error);
```

## Features

- ✅ Server-side FHE operations
- ✅ Automated contract interactions
- ✅ Batch processing support
- ✅ No browser dependencies

## Use Cases

- Backend services
- Data processing pipelines
- Automated trading bots
- Privacy-preserving APIs
