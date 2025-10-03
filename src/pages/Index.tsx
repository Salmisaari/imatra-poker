import { useState, useEffect } from 'react';
import { PokerTable } from '@/components/poker/PokerTable';
import { GameLobby } from '@/components/poker/GameLobby';
import { NamePrompt } from '@/components/poker/NamePrompt';
import { useGameRoom } from '@/hooks/useGameRoom';

const Index = () => {
  const [playerName, setPlayerName] = useState<string>('');
  const [gameMode, setGameMode] = useState<'lobby' | 'ai-game' | 'online-game' | 'name-prompt'>('name-prompt');
  const [numPlayers, setNumPlayers] = useState(4);
  const [pendingAction, setPendingAction] = useState<{ type: 'create' | 'join'; data: any } | null>(null);
  const { createRoom, joinRoom } = useGameRoom();

  useEffect(() => {
    // Check for join code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const joinCode = urlParams.get('join');
    if (joinCode) {
      setPendingAction({ type: 'join', data: joinCode });
      setGameMode('name-prompt');
    }
  }, []);

  const handleNameSubmit = async (name: string) => {
    setPlayerName(name);
    
    if (pendingAction) {
      if (pendingAction.type === 'join') {
        await joinRoom(pendingAction.data, name);
        setGameMode('online-game');
      } else if (pendingAction.type === 'create') {
        await createRoom(pendingAction.data, name);
        setGameMode('online-game');
      }
      setPendingAction(null);
    } else {
      setGameMode('lobby');
    }
  };

  const handleStartAIGame = (lobbySize: number) => {
    setNumPlayers(lobbySize);
    setGameMode('ai-game');
  };

  const handleCreateOnlineGame = (lobbySize: number) => {
    setNumPlayers(lobbySize);
    setPendingAction({ type: 'create', data: lobbySize });
    setGameMode('name-prompt');
  };

  if (gameMode === 'name-prompt') {
    return (
      <NamePrompt 
        onSubmit={handleNameSubmit}
        title={pendingAction?.type === 'join' ? 'Join Game' : 'Enter Your Name'}
        description={pendingAction?.type === 'join' ? 'Enter your name to join the game' : 'Choose a name to play poker'}
      />
    );
  }

  if (gameMode === 'lobby') {
    return (
      <GameLobby
        onStartAIGame={handleStartAIGame}
        onCreateOnlineGame={handleCreateOnlineGame}
      />
    );
  }

  return <PokerTable />;
};

export default Index;
