import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Copy, Users, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import pokerTableBg from '@/assets/poker-table-bg.png';

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
  const [copied, setCopied] = useState(false);
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

  const handleCopyInviteLink = () => {
    // Generate invite link with room code
    const inviteLink = `${window.location.origin}?join=ROOM123`; // This will be dynamic with real room code
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast({
      title: 'Link copied!',
      description: 'Share this link with your friends to join',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNameSubmit = () => {
    if (!playerName.trim()) {
      toast({
        title: 'Name required',
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
    <div 
      className="min-h-screen flex items-end justify-center p-4 pb-12 relative"
      style={{
        backgroundImage: `url(${pokerTableBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl">
        {showNamePrompt ? (
          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md bg-background/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Enter your name</CardTitle>
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
          </div>
        ) : (
          <div className="space-y-8">
            {/* Hero Title */}
            <div className="text-center space-y-4">
              <h1 className="font-bold text-white drop-shadow-2xl">Imatra Poker</h1>
              <p className="text-xl text-white/90 drop-shadow-lg">The one poker room where Jaakko cannot cheat</p>
            </div>

            {/* Game Mode Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Play Against AI */}
              <Card className="border-2 hover:border-primary transition-colors bg-background/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>
                  Virtual mode
                </CardTitle>
                <CardDescription>
                  Play against AI opponents: Jaakko, Saku, Veeti, Tuomas, and Johannes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center justify-between">
                    <span>Number of players: {lobbySize}</span>
                    <Users className="w-4 h-4 text-muted-foreground" />
                  </Label>
                  <Slider
                    value={[lobbySize]}
                    onValueChange={(value) => setLobbySize(value[0])}
                    min={2}
                    max={6}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>2</span>
                    <span>6</span>
                  </div>
                </div>
                <Button 
                  onClick={handleStartAI}
                  className="w-full"
                  size="lg"
                >
                  Start virtual game
                </Button>
              </CardContent>
            </Card>

              {/* Play Online */}
              <Card className="border-2 hover:border-primary transition-colors bg-background/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>
                  Play with friends
                </CardTitle>
                <CardDescription>
                  Create a room and invite friends to play
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center justify-between">
                    <span>Lobby size: {lobbySize}</span>
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
                <div className="flex gap-2">
                  <Button 
                    onClick={handleCreateOnlineGame}
                    className="flex-1"
                    size="lg"
                  >
                    Create room
                  </Button>
                  <Button
                    onClick={handleCopyInviteLink}
                    variant="outline"
                    size="lg"
                    className="px-3"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
