import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Share2, Bot, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GameLobbyProps {
  onStartAIGame: (numPlayers: number) => void;
  onCreateOnlineGame: (numPlayers: number) => void;
  onJoinGame: (roomCode: string) => void;
}

export function GameLobby({ onStartAIGame, onCreateOnlineGame, onJoinGame }: GameLobbyProps) {
  const [lobbySize, setLobbySize] = useState(4);
  const { toast } = useToast();

  const handleCreateOnlineGame = () => {
    onCreateOnlineGame(lobbySize);
  };

  const handleStartAI = () => {
    onStartAIGame(lobbySize);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Texas Hold'em Poker</h1>
          <p className="text-muted-foreground">Choose your game mode</p>
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
    </div>
  );
}