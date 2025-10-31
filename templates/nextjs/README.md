# Next.js FHEVM Template

Quick-start template for building confidential dApps with Next.js and FHEVM SDK.

## Quick Start

```bash
# Copy this template
cp -r templates/nextjs my-fhevm-app
cd my-fhevm-app

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local

# Run development server
npm run dev
```

## Usage

```tsx
// app/layout.tsx
import { FhevmProvider } from '@fhevm/sdk';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <FhevmProvider config={{ network: { chainId: 11155111, name: 'sepolia', rpcUrl: 'YOUR_RPC' } }}>
          {children}
        </FhevmProvider>
      </body>
    </html>
  );
}

// app/page.tsx
'use client';
import { useFhevm } from '@fhevm/sdk';

export default function Home() {
  const { client, init } = useFhevm();

  const encrypt = async () => {
    const encrypted = await client
      .createEncryptedInput(contractAddress, userAddress)
      .add32(1000)
      .encrypt();
  };

  return <div>Your FHEVM App</div>;
}
```

## See Full Example

Check `examples/nextjs-demo` for a complete implementation with encryption, decryption, and computation demos.
