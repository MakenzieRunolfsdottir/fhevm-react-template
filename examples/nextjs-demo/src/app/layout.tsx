/**
 * Root Layout - Next.js 13+ App Router
 * Provides FHEVM context and global styling
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { FhevmProvider } from '@fhevm/sdk';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FHEVM SDK Demo - Next.js App Router',
  description: 'Demonstrating FHEVM SDK integration with Next.js App Router',
};

/**
 * FHEVM Configuration
 */
const fhevmConfig = {
  network: {
    chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID) || 11155111,
    name: process.env.NEXT_PUBLIC_NETWORK_NAME || 'sepolia',
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.infura.io/v3/',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FhevmProvider config={fhevmConfig}>
          {children}
        </FhevmProvider>
      </body>
    </html>
  );
}
