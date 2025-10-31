import { ethers } from 'ethers';

export interface DisputeInfo {
  plaintiff: string;
  defendant: string;
  status: number;
  createdAt: bigint;
  votingDeadline: bigint;
  arbitratorsCount: bigint;
  decisionRevealed: boolean;
  winner: string;
}

export interface ArbitratorInfo {
  isActive: boolean;
  reputation: bigint;
  casesHandled: bigint;
  successfulCases: bigint;
  identityVerified: boolean;
}

export interface PlatformStats {
  totalDisputes: number;
  activeArbitrators: number;
  resolvedDisputes: number;
  userReputation: number;
}

export type MessageType = 'success' | 'error' | 'info';

export interface Message {
  id: string;
  text: string;
  type: MessageType;
}

export interface WalletState {
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  contract: ethers.Contract | null;
  userAddress: string | null;
  currentChainId: number | null;
  isConnected: boolean;
}

export enum DisputeStatus {
  Created = 0,
  InArbitration = 1,
  Voting = 2,
  Resolved = 3,
  Cancelled = 4,
}

export interface CreateDisputeParams {
  defendant: string;
  stakeAmount: string;
  evidenceHash: number;
  description?: string;
}

export interface VoteParams {
  disputeId: number;
  vote: number;
  justification: number;
}

// Contract configuration
export const CONTRACT_CONFIG = {
  ADDRESS: '0x019487001FaCC26883f8760b72B0DAef2cbFa1bd',
  REQUIRED_CHAIN_ID: 11155111,
  REQUIRED_NETWORK_NAME: 'Sepolia',
  ABI: [
    'function registerArbitrator(uint32 _identityProof) external',
    'function createDispute(address _defendant, uint32 _stakeAmount, uint32 _evidenceHash) external payable',
    'function assignArbitrators(uint256 _disputeId) external',
    'function submitVote(uint256 _disputeId, uint8 _vote, uint32 _justification) external',
    'function getDisputeInfo(uint256 _disputeId) external view returns (address, address, uint8, uint256, uint256, uint256, bool, address)',
    'function getArbitratorInfo(address _arbitrator) external view returns (bool, uint256, uint256, uint256, bool)',
    'function getUserReputation(address _user) external view returns (uint256)',
    'function disputeCounter() external view returns (uint256)',
    'function arbitratorPool() external view returns (uint256)',
    'event DisputeCreated(uint256 indexed disputeId, address indexed plaintiff, address indexed defendant)',
    'event ArbitratorsAssigned(uint256 indexed disputeId, address[] arbitrators)',
    'event VoteSubmitted(uint256 indexed disputeId, address indexed arbitrator)',
    'event DisputeResolved(uint256 indexed disputeId, address indexed winner)',
    'event ArbitratorRegistered(address indexed arbitrator)',
  ],
};
