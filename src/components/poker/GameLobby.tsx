import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Share2, Bot, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import pokerTableImage from '@/assets/poker-table-hero.png';

interface GameLobbyProps {
  onStartAIGame: (numPlayers: number) => void;
  onCreateOnlineGame: (numPlayers: number, playerName: string) => void;
  onJoinGame: (roomCode: string, playerName: string) => void;
}

export function GameLobby({ onStartAIGame, onCreateOnlineGame, onJoinGame }: GameLobbyProps) {
  const [lobbySize, setLobbySize] = useState(4);
  const [playerName, setPlayerName] = useState('');
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [action, setAction] = useState<'create' | 'join'>('create');
  const [joinCode, setJoinCode] = useState('');
  const { toast } = useToast();

  // Check for pending join code from URL
  useEffect(() => {
    const pendingCode = sessionStorage.getItem('pending_join_code');
    if (pendingCode) {
      setJoinCode(pendingCode);
      setAction('join');
      setShowNamePrompt(true);
      sessionStorage.removeItem('pending_join_code');
    }
  }, []);

  const handleCreateOnlineGame = () => {
    if (!playerName.trim()) {
      setAction('create');
      setShowNamePrompt(true);
      return;
    }
    onCreateOnlineGame(lobbySize, playerName);
  };

  const handleStartAI = () => {
    onStartAIGame(lobbySize);
  };

  const handleNameSubmit = () => {
    if (!playerName.trim()) {
      toast({
        title: 'Name Required',
        description: 'Please enter your name',
        variant: 'destructive',
      });
      return;
    }
    setShowNamePrompt(false);
    if (action === 'create') {
      onCreateOnlineGame(lobbySize, playerName);
    } else if (action === 'join' && joinCode) {
      onJoinGame(joinCode, playerName);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {showNamePrompt ? (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Enter Your Name</CardTitle>
            <CardDescription>
              {action === 'join' && joinCode 
                ? `Joining room: ${joinCode}` 
                : 'Choose a name for the game'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Your name..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
              autoFocus
            />
            <div className="flex gap-2">
              <Button onClick={handleNameSubmit} className="flex-1">
                Continue
              </Button>
              <Button onClick={() => setShowNamePrompt(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="w-full max-w-6xl space-y-6">
          {/* Hero Image */}
          <div className="relative rounded-xl overflow-hidden shadow-2xl">
            <img 
              src={pokerTableImage} 
              alt="Poker Table" 
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
              <h1 className="text-5xl font-bold text-foreground mb-2">Texas Hold'em Poker</h1>
              <p className="text-xl text-muted-foreground">Play with friends online or practice against AI</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Play Against AI */}
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-6 h-6 text-primary" />
                  Play Against AI
                </CardTitle>
                <CardDescription>
                  Practice your skills with computer opponents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center justify-between">
                    <span>Number of Players: {lobbySize}</span>
                    <Users className="w-4 h-4 text-muted-foreground" />
                  </Label>
                  <Slider
                    value={[lobbySize]}
                    onValueChange={(value) => setLobbySize(value[0])}
                    min={2}
                    max={8}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>2</span>
                    <span>8</span>
                  </div>
                </div>
                <Button 
                  onClick={handleStartAI}
                  className="w-full"
                  size="lg"
                >
                  Start AI Game
                </Button>
              </CardContent>
            </Card>

            {/* Play Online */}
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="w-6 h-6 text-primary" />
                  Play Online
                </CardTitle>
                <CardDescription>
                  Create a room and invite friends to play
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center justify-between">
                    <span>Lobby Size: {lobbySize}</span>
                    <Users className="w-4 h-4 text-muted-foreground" />
                  </Label>
                  <Slider
                    value={[lobbySize]}
                    onValueChange={(value) => setLobbySize(value[0])}
                    min={2}
                    max={8}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>2</span>
                    <span>8</span>
                  </div>
                </div>
                <Button 
                  onClick={handleCreateOnlineGame}
                  className="w-full"
                  size="lg"
                >
                  Create Online Room
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
