import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import {
  DisputeInfo,
  ArbitratorInfo,
  PlatformStats,
  CreateDisputeParams,
  VoteParams,
  CONTRACT_CONFIG,
} from '../types';
import { useFhevmContext } from '../contexts/FhevmContext';

interface UseContractProps {
  contract: ethers.Contract | null;
  userAddress: string | null;
  currentChainId: number | null;
}

export const useContract = ({ contract, userAddress, currentChainId }: UseContractProps) => {
  const [loading, setLoading] = useState<string | null>(null);
  const { client, createEncryptedInput } = useFhevmContext();

  const checkRequirements = useCallback((): boolean => {
    if (!contract) {
      throw new Error('Please connect your wallet first');
    }
    if (currentChainId !== CONTRACT_CONFIG.REQUIRED_CHAIN_ID) {
      throw new Error(`Please switch to ${CONTRACT_CONFIG.REQUIRED_NETWORK_NAME} testnet`);
    }
    return true;
  }, [contract, currentChainId]);

  const registerArbitrator = useCallback(
    async (identityProof: number): Promise<void> => {
      checkRequirements();
      if (!identityProof) {
        throw new Error('Please enter identity verification code');
      }

      setLoading('registerArbitrator');
      try {
        const tx = await contract!.registerArbitrator(identityProof);
        await tx.wait();
      } finally {
        setLoading(null);
      }
    },
    [contract, checkRequirements]
  );

  const createDispute = useCallback(
    async (params: CreateDisputeParams): Promise<void> => {
      checkRequirements();

      if (!params.defendant || !params.stakeAmount || !params.evidenceHash) {
        throw new Error('Please fill all required fields');
      }

      if (!ethers.isAddress(params.defendant)) {
        throw new Error('Please enter a valid defendant address');
      }

      setLoading('createDispute');
      try {
        const stakeWei = ethers.parseEther(params.stakeAmount);
        const evidenceHashUint32 = params.evidenceHash % 2 ** 32;

        // Use FHEVM SDK to encrypt evidence hash if available
        if (client && userAddress) {
          try {
            const encryptedInput = createEncryptedInput(CONTRACT_CONFIG.ADDRESS, userAddress);

            // Encrypt evidence hash using SDK
            const encrypted = await encryptedInput
              .add32(evidenceHashUint32)
              .encrypt();

            const tx = await contract!.createDispute(
              params.defendant,
              encrypted.handles[0],
              encrypted.inputProof,
              { value: stakeWei }
            );
            await tx.wait();
            console.log('Dispute created with FHE encrypted evidence');
          } catch (encryptError) {
            console.warn('FHE encryption failed, using standard method:', encryptError);
            // Fallback to non-encrypted method
            const tx = await contract!.createDispute(
              params.defendant,
              evidenceHashUint32,
              evidenceHashUint32,
              { value: stakeWei }
            );
            await tx.wait();
          }
        } else {
          // Fallback if SDK not initialized
          const tx = await contract!.createDispute(
            params.defendant,
            evidenceHashUint32,
            evidenceHashUint32,
            { value: stakeWei }
          );
          await tx.wait();
        }
      } finally {
        setLoading(null);
      }
    },
    [contract, checkRequirements, client, createEncryptedInput, userAddress]
  );

  const assignArbitrators = useCallback(
    async (disputeId: number): Promise<void> => {
      checkRequirements();

      if (!disputeId) {
        throw new Error('Please enter dispute ID');
      }

      setLoading('assignArbitrators');
      try {
        const tx = await contract!.assignArbitrators(disputeId);
        await tx.wait();
      } finally {
        setLoading(null);
      }
    },
    [contract, checkRequirements]
  );

  const submitVote = useCallback(
    async (params: VoteParams): Promise<void> => {
      checkRequirements();

      if (!params.disputeId || !params.vote || !params.justification) {
        throw new Error('Please fill all fields');
      }

      setLoading('submitVote');
      try {
        // Use FHEVM SDK to encrypt sensitive vote data
        if (client && userAddress) {
          try {
            const encryptedInput = createEncryptedInput(CONTRACT_CONFIG.ADDRESS, userAddress);

            // Encrypt the vote and justification using SDK
            const encrypted = await encryptedInput
              .add32(params.vote)
              .add32(params.justification)
              .encrypt();

            // Submit encrypted vote to contract
            const tx = await contract!.submitVote(
              params.disputeId,
              encrypted.handles[0],
              encrypted.handles[1],
              encrypted.inputProof
            );
            await tx.wait();
            console.log('Vote submitted with FHE encryption');
          } catch (encryptError) {
            console.warn('FHE encryption failed, using standard method:', encryptError);
            // Fallback to non-encrypted method
            const justificationUint32 = params.justification % 2 ** 32;
            const tx = await contract!.submitVote(params.disputeId, params.vote, justificationUint32);
            await tx.wait();
          }
        } else {
          // Fallback if SDK not initialized
          const justificationUint32 = params.justification % 2 ** 32;
          const tx = await contract!.submitVote(params.disputeId, params.vote, justificationUint32);
          await tx.wait();
        }
      } finally {
        setLoading(null);
      }
    },
    [contract, checkRequirements, client, createEncryptedInput, userAddress]
  );

  const getDisputeInfo = useCallback(
    async (disputeId: number): Promise<DisputeInfo> => {
      checkRequirements();

      if (!disputeId) {
        throw new Error('Please enter dispute ID');
      }

      const info = await contract!.getDisputeInfo(disputeId);
      return {
        plaintiff: info[0],
        defendant: info[1],
        status: info[2],
        createdAt: info[3],
        votingDeadline: info[4],
        arbitratorsCount: info[5],
        decisionRevealed: info[6],
        winner: info[7],
      };
    },
    [contract, checkRequirements]
  );

  const getArbitratorInfo = useCallback(
    async (address: string): Promise<ArbitratorInfo> => {
      if (!contract) return {
        isActive: false,
        reputation: BigInt(0),
        casesHandled: BigInt(0),
        successfulCases: BigInt(0),
        identityVerified: false,
      };

      const info = await contract.getArbitratorInfo(address);
      return {
        isActive: info[0],
        reputation: info[1],
        casesHandled: info[2],
        successfulCases: info[3],
        identityVerified: info[4],
      };
    },
    [contract]
  );

  const getUserReputation = useCallback(
    async (address: string): Promise<bigint> => {
      if (!contract) return BigInt(0);
      return await contract.getUserReputation(address);
    },
    [contract]
  );

  const getPlatformStats = useCallback(async (): Promise<PlatformStats> => {
    if (!contract) {
      return {
        totalDisputes: 0,
        activeArbitrators: 0,
        resolvedDisputes: 0,
        userReputation: 0,
      };
    }

    try {
      const totalDisputes = await contract.disputeCounter();
      const activeArbitrators = await contract.arbitratorPool();

      let resolvedCount = 0;
      const maxToCheck = Math.min(Number(totalDisputes), 10);
      for (let i = 1; i <= maxToCheck; i++) {
        try {
          const disputeInfo = await contract.getDisputeInfo(i);
          if (disputeInfo[6]) {
            resolvedCount++;
          }
        } catch (error) {
          // Dispute might not exist or be accessible
        }
      }

      let userReputation = 0;
      if (userAddress) {
        const reputation = await contract.getUserReputation(userAddress);
        userReputation = Number(reputation);
      }

      return {
        totalDisputes: Number(totalDisputes),
        activeArbitrators: Number(activeArbitrators),
        resolvedDisputes: resolvedCount,
        userReputation,
      };
    } catch (error) {
      console.error('Failed to load platform stats:', error);
      return {
        totalDisputes: 0,
        activeArbitrators: 0,
        resolvedDisputes: 0,
        userReputation: 0,
      };
    }
  }, [contract, userAddress]);

  return {
    loading,
    registerArbitrator,
    createDispute,
    assignArbitrators,
    submitVote,
    getDisputeInfo,
    getArbitratorInfo,
    getUserReputation,
    getPlatformStats,
  };
};
