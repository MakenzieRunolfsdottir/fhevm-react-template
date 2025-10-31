# Next.js App Router FHEVM SDK Demo

A comprehensive demonstration of the FHEVM SDK using Next.js 14 App Router, showcasing framework-agnostic FHE integration.

## Features

- **Modern Next.js**: Uses App Router (Next.js 13+) with TypeScript
- **Complete SDK Integration**: Demonstrates all FHEVM SDK features
- **Real-world Examples**: Banking and medical use cases
- **Interactive Demos**: Encryption, decryption, and computation
- **API Routes**: Server-side FHE operations
- **Responsive UI**: Beautiful Tailwind CSS design

## Structure

```
src/
├── app/                        # App Router (Next.js 13+)
│   ├── layout.tsx              # Root layout with FHEProvider
│   ├── page.tsx                # Main demo page
│   ├── globals.css             # Global styles
│   └── api/                    # API routes
│       ├── fhe/
│       │   ├── route.ts        # FHE operations API
│       │   ├── encrypt/route.ts # Encryption API
│       │   ├── decrypt/route.ts # Decryption API
│       │   └── compute/route.ts # Computation API
│       └── keys/route.ts       # Key management API
│
├── components/                 # React components
│   ├── ui/                     # Base UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── fhe/                    # FHE components
│   │   ├── FHEProvider.tsx     # SDK provider wrapper
│   │   ├── EncryptionDemo.tsx  # Encryption demonstration
│   │   ├── ComputationDemo.tsx # Computation demonstration
│   │   └── KeyManager.tsx      # Key management
│   └── examples/               # Use case examples
│       ├── BankingExample.tsx  # Confidential banking
│       └── MedicalExample.tsx  # Medical records
│
├── lib/                        # Utility libraries
│   ├── fhe/                    # FHE utilities
│   │   ├── client.ts           # Client FHE operations
│   │   ├── server.ts           # Server FHE operations
│   │   ├── keys.ts             # Key management
│   │   └── types.ts            # FHE type definitions
│   └── utils/                  # Helper utilities
│       ├── security.ts         # Security helpers
│       └── validation.ts       # Validation helpers
│
├── hooks/                      # Custom React hooks
│   ├── useFHE.ts               # FHE operations hook
│   ├── useEncryption.ts        # Encryption hook
│   └── useComputation.ts       # Computation hook
│
└── types/                      # TypeScript types
    ├── fhe.ts                  # FHE types
    └── api.ts                  # API types
```

## Getting Started

### Prerequisites

- Node.js 18+
- MetaMask or compatible Web3 wallet

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the demo.

## SDK Usage Examples

### 1. Basic Setup (Layout)

```tsx
import { FhevmProvider } from '@fhevm/sdk';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <FhevmProvider config={fhevmConfig}>
          {children}
        </FhevmProvider>
      </body>
    </html>
  );
}
```

### 2. Encryption (Component)

```tsx
import { useFhevm } from '@fhevm/sdk';

function MyComponent() {
  const { client } = useFhevm();

  const encrypt = async () => {
    const encrypted = await client
      .createEncryptedInput(contractAddress, userAddress)
      .add32(1000)
      .encrypt();
  };
}
```

### 3. Decryption

```tsx
const decrypt = async () => {
  const value = await client.userDecrypt(
    handle,
    contractAddress,
    userAddress
  );
};
```

### 4. API Routes

```tsx
// app/api/fhe/encrypt/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  // Handle encryption
  return NextResponse.json({ success: true });
}
```

## Features Demonstrated

### Encryption Demo
- Connect wallet
- Encrypt values using FHE
- Display encrypted ciphertext
- Decrypt with EIP-712 signatures

### Computation Demo
- Homomorphic addition
- Homomorphic subtraction
- Homomorphic multiplication
- Encrypted comparison

### Banking Example
- Encrypted balance management
- Confidential deposits
- Private transfers
- Balance queries on encrypted data

### Medical Example
- HIPAA-compliant data storage
- Encrypted health records
- Selective decryption
- Privacy-preserving analytics

## API Endpoints

- `GET /api/fhe` - FHE status
- `POST /api/fhe/encrypt` - Encrypt values
- `POST /api/fhe/decrypt` - Decrypt values
- `POST /api/fhe/compute` - Homomorphic operations
- `GET /api/keys` - Retrieve public keys
- `POST /api/keys` - Generate key pairs

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **SDK**: @fhevm/sdk
- **Blockchain**: Ethers.js v6

## Environment Variables

```env
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_NETWORK_NAME=sepolia
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

## Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## Learn More

- [FHEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Zama FHEVM](https://docs.zama.ai/fhevm)

## License

MIT
