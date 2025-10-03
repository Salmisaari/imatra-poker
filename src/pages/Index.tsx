import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PokerTable } from '@/components/poker/PokerTable';
import { GameLobby } from '@/components/poker/GameLobby';
import { AuthPage } from '@/components/auth/AuthPage';
import { useGameRoom } from '@/hooks/useGameRoom';
import { User } from '@supabase/supabase-js';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [gameMode, setGameMode] = useState<'lobby' | 'ai-game' | 'online-game'>('lobby');
  const [numPlayers, setNumPlayers] = useState(4);
  const { createRoom, joinRoom } = useGameRoom();

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Check for join code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const joinCode = urlParams.get('join');
    if (joinCode && user) {
      joinRoom(joinCode);
      setGameMode('online-game');
    }

    return () => subscription.unsubscribe();
  }, [user]);

  const handleStartAIGame = (lobbySize: number) => {
    setNumPlayers(lobbySize);
    setGameMode('ai-game');
  };

  const handleCreateOnlineGame = async (lobbySize: number) => {
    if (!user) return;
    setNumPlayers(lobbySize);
    await createRoom(lobbySize);
    setGameMode('online-game');
  };

  const handleJoinGame = async (roomCode: string) => {
    if (!user) return;
    await joinRoom(roomCode);
    setGameMode('online-game');
  };

  const handleBackToLobby = () => {
    setGameMode('lobby');
  };

  if (!user) {
    return <AuthPage onAuthSuccess={() => {}} />;
  }

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
