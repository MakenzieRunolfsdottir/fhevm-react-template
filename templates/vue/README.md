# Vue FHEVM Template

Quick-start template for building confidential dApps with Vue and FHEVM SDK.

## Quick Start

```bash
# Copy this template
cp -r templates/vue my-fhevm-app
cd my-fhevm-app

# Install dependencies
npm install

# Run development server
npm run dev
```

## Usage

```vue
<!-- App.vue -->
<script setup>
import { ref, onMounted } from 'vue';
import { FhevmClient } from '@fhevm/sdk';
import { ethers } from 'ethers';

const client = ref(null);
const isInitialized = ref(false);

onMounted(async () => {
  // Initialize FHEVM client
  const fhevmClient = new FhevmClient({
    network: {
      chainId: 11155111,
      name: 'sepolia',
      rpcUrl: 'YOUR_RPC_URL'
    }
  });

  // Connect wallet
  if (window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    await fhevmClient.init(provider, signer);

    client.value = fhevmClient;
    isInitialized.value = true;
  }
});

const encrypt = async () => {
  if (!client.value) return;

  const encrypted = await client.value
    .createEncryptedInput(contractAddress, userAddress)
    .add32(1000)
    .encrypt();

  // Use encrypted.handles[0] and encrypted.inputProof
};

const decrypt = async (handle) => {
  if (!client.value) return;

  const decrypted = await client.value.userDecrypt(
    handle,
    contractAddress,
    userAddress
  );

  return decrypted;
};
</script>

<template>
  <div>
    <h1>FHEVM Vue App</h1>
    <button v-if="isInitialized" @click="encrypt">Encrypt</button>
  </div>
</template>
```

## Features

- ✅ Framework-agnostic FHEVM SDK
- ✅ Vue 3 Composition API
- ✅ TypeScript support
- ✅ Reactive state management
