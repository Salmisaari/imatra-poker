import { Player } from '@/lib/poker/types';
import { Card } from './Card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Circle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedPlayerPositionProps {
  player: Player;
  isActive: boolean;
  showCards: boolean;
  timeRemaining?: number;
}

export function EnhancedPlayerPosition({ player, isActive, showCards, timeRemaining }: EnhancedPlayerPositionProps) {
  const getStackColor = () => {
    if (player.chips > 1500) return 'text-chip-gold';
    if (player.chips < 500) return 'text-destructive';
    return 'text-foreground';
  };

  const getBadgeText = () => {
    if (player.isDealer) return 'D';
    if (player.isBigBlind) return 'BB';
    if (player.isSmallBlind) return 'SB';
    return null;
  };

  const badgeText = getBadgeText();

  return (
    <div
      className={cn(
        'relative bg-card/90 backdrop-blur-sm rounded-xl p-3 min-w-[140px] border-2 transition-all shadow-lg',
        isActive ? 'border-primary shadow-primary/50 animate-pulse-glow' : 'border-border',
        player.status === 'folded' && 'opacity-50 grayscale'
      )}
    >
      {/* Position Badge */}
      {badgeText && (
        <Badge 
          className={cn(
            "absolute -top-2 -left-2 font-bold text-xs w-6 h-6 flex items-center justify-center rounded-full",
            player.isDealer ? "bg-primary text-primary-foreground" : "bg-chip-gold text-black"
          )}
        >
          {badgeText}
        </Badge>
      )}

      {/* All-In Badge */}
      {player.status === 'all-in' && (
        <Badge className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground animate-pulse font-bold">
          All in
        </Badge>
      )}

      {/* Timer */}
      {isActive && timeRemaining !== undefined && (
        <div className={cn(
          "absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold",
          timeRemaining > 20 ? "bg-success text-success-foreground" :
          timeRemaining > 10 ? "bg-primary text-primary-foreground" :
          "bg-destructive text-destructive-foreground animate-pulse"
        )}>
          <Clock className="w-3 h-3" />
          {timeRemaining}s
        </div>
      )}

      {/* Player Info */}
      <div className="flex items-center gap-2 mb-2">
        <Avatar className="w-10 h-10 border-2 border-primary/30">
          <AvatarFallback className="bg-muted text-foreground font-bold">
            {player.name[0]}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="font-bold text-sm text-foreground">{player.name}</div>
          <div className={cn("text-xs font-mono", getStackColor())}>
            <Circle className="w-3 h-3 inline fill-current mr-1" />
            {player.chips}
          </div>
        </div>
      </div>

      {/* Current Bet */}
      {player.currentBet > 0 && (
        <div className="mb-2 bg-primary/20 rounded px-2 py-1">
          <div className="text-xs text-chip-gold font-bold">
            Bet: {player.currentBet}
          </div>
        </div>
      )}

      {/* Cards */}
      {player.holeCards.length > 0 && (
        <div className="flex gap-1 justify-center">
          {player.holeCards.map((card, index) => (
            <div
              key={index}
              className="animate-card-deal"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <Card
                card={showCards ? { ...card, faceUp: true } : card}
                delay={0}
                size={showCards ? 'normal' : 'small'}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
