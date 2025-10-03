import { useState, useEffect } from 'react';
import { PokerTable } from '@/components/poker/PokerTable';
import { GameLobby } from '@/components/poker/GameLobby';
import { useGameRoom } from '@/hooks/useGameRoom';

const Index = () => {
  const [gameMode, setGameMode] = useState<'lobby' | 'ai-game' | 'online-game'>('lobby');
  const [numPlayers, setNumPlayers] = useState(4);
  const { createRoom, joinRoom } = useGameRoom();

  useEffect(() => {
    // Check for join code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const joinCode = urlParams.get('join');
    if (joinCode) {
      sessionStorage.setItem('pending_join_code', joinCode);
    }
  }, []);

  const handleStartAIGame = (lobbySize: number) => {
    setNumPlayers(lobbySize);
    setGameMode('ai-game');
  };

  const handleCreateOnlineGame = async (lobbySize: number, playerName: string) => {
    setNumPlayers(lobbySize);
    await createRoom(lobbySize, playerName);
    setGameMode('online-game');
  };

  const handleJoinGame = async (roomCode: string, playerName: string) => {
    await joinRoom(roomCode, playerName);
    setGameMode('online-game');
  };

  if (gameMode === 'lobby') {
    return (
      <GameLobby
        onStartAIGame={handleStartAIGame}
        onCreateOnlineGame={handleCreateOnlineGame}
        onJoinGame={handleJoinGame}
      />
    );
  }

  return <PokerTable />;
};

export default Index;
