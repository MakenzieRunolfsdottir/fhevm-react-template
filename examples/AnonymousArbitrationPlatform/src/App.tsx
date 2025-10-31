import React, { useEffect, useState } from 'react';
import { useWallet } from './hooks/useWallet';
import { useContract } from './hooks/useContract';
import { useMessages } from './hooks/useMessages';
import { Header } from './components/Header';
import { MessageContainer } from './components/MessageContainer';
import { DeploymentNotice } from './components/DeploymentNotice';
import { ArbitratorRegistration } from './components/ArbitratorRegistration';
import { CreateDispute } from './components/CreateDispute';
import { DisputeManagement } from './components/DisputeManagement';
import { VotingInterface } from './components/VotingInterface';
import { ActiveDisputes } from './components/ActiveDisputes';
import { PlatformAnalytics } from './components/PlatformAnalytics';
import { Footer } from './components/Footer';
import { PlatformStats } from './types';
import './styles/App.css';

const App: React.FC = () => {
  const { provider, signer, contract, userAddress, currentChainId, isConnected, connectWallet, disconnectWallet } = useWallet();
  const contractMethods = useContract({ contract, userAddress, currentChainId });
  const { messages, showMessage, removeMessage } = useMessages();
  const [stats, setStats] = useState<PlatformStats>({
    totalDisputes: 0,
    activeArbitrators: 0,
    resolvedDisputes: 0,
    userReputation: 0,
  });

  // Load platform stats when contract is available
  useEffect(() => {
    const loadStats = async () => {
      if (contract && isConnected) {
        try {
          const platformStats = await contractMethods.getPlatformStats();
          setStats(platformStats);
        } catch (error) {
          console.error('Failed to load stats:', error);
        }
      }
    };

    loadStats();
  }, [contract, isConnected, contractMethods]);

  const handleConnect = async () => {
    try {
      await connectWallet(true);
      showMessage('Wallet connected successfully!', 'success');
    } catch (error: any) {
      let errorMessage = 'Failed to connect wallet: ';
      if (error.code === 4001) {
        errorMessage += 'User rejected the connection request';
      } else if (error.code === -32002) {
        errorMessage += 'Connection request already pending';
      } else {
        errorMessage += error.message || 'Unknown error';
      }
      showMessage(errorMessage, 'error');
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    showMessage('Wallet disconnected', 'info');
  };

  const refreshStats = async () => {
    if (contract) {
      const platformStats = await contractMethods.getPlatformStats();
      setStats(platformStats);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <Header
          currentChainId={currentChainId}
          userAddress={userAddress}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          totalDisputes={stats.totalDisputes}
          activeArbitrators={stats.activeArbitrators}
          resolvedDisputes={stats.resolvedDisputes}
          userReputation={stats.userReputation}
        />

        <DeploymentNotice />

        <div className="main-content">
          <ArbitratorRegistration
            onRegister={contractMethods.registerArbitrator}
            getArbitratorInfo={contractMethods.getArbitratorInfo}
            userAddress={userAddress}
            loading={contractMethods.loading}
            showMessage={showMessage}
          />

          <CreateDispute
            onCreate={async (params) => {
              await contractMethods.createDispute(params);
              await refreshStats();
            }}
            loading={contractMethods.loading}
            showMessage={showMessage}
          />

          <DisputeManagement
            onAssignArbitrators={contractMethods.assignArbitrators}
            onGetDisputeInfo={contractMethods.getDisputeInfo}
            loading={contractMethods.loading}
            showMessage={showMessage}
          />

          <VotingInterface
            onSubmitVote={contractMethods.submitVote}
            loading={contractMethods.loading}
            showMessage={showMessage}
          />

          <ActiveDisputes showMessage={showMessage} />

          <PlatformAnalytics
            getUserReputation={contractMethods.getUserReputation}
            getArbitratorInfo={contractMethods.getArbitratorInfo}
            onRefreshStats={refreshStats}
            userAddress={userAddress}
            showMessage={showMessage}
          />
        </div>

        <Footer />
      </div>

      <MessageContainer messages={messages} onRemove={removeMessage} />
    </div>
  );
};

export default App;
