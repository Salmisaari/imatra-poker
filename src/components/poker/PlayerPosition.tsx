import { Player as PlayerType } from '@/lib/poker/types';
import { Card } from './Card';
import { Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlayerPositionProps {
  player: PlayerType;
  isActive: boolean;
  showCards: boolean;
}

export function PlayerPosition({ player, isActive, showCards }: PlayerPositionProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* Player Card - Vertical Rectangle */}
      <div
        className={cn(
          'relative bg-card/90 backdrop-blur-sm rounded-xl p-3 min-w-[120px] border-2 transition-all',
          isActive ? 'border-primary shadow-lg shadow-primary/50 animate-pulse-glow' : 'border-border',
          player.status === 'folded' && 'opacity-50 grayscale'
        )}
      >
        {/* Status Indicators */}
        <div className="flex items-center justify-between mb-2">
          {player.isDealer && (
            <div className="w-6 h-6 rounded-full bg-dealer-button flex items-center justify-center text-xs font-bold text-background">
              D
            </div>
          )}
          {player.isSmallBlind && (
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              SB
            </div>
          )}
          {player.isBigBlind && (
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              BB
            </div>
          )}
        </div>

        {/* Player Info */}
        <div className="text-center space-y-1">
          <div className="font-bold text-sm text-foreground">{player.name}</div>
          <div className="flex items-center justify-center gap-1">
            <Circle className="w-3 h-3 fill-chip-gold text-chip-gold" />
            <span className="text-xs font-medium text-muted-foreground">{player.chips}</span>
          </div>
        </div>

        {/* Current Bet */}
        {player.currentBet > 0 && (
          <div className="mt-2 text-center">
            <div className="text-xs text-primary font-bold">Bet: {player.currentBet}</div>
          </div>
        )}

        {/* Status Badge */}
        {player.status === 'all-in' && (
          <div className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded-full">
            ALL IN
          </div>
        )}
      </div>

      {/* Player Cards */}
      {showCards && player.holeCards.length > 0 && (
        <div className="flex gap-1">
          {player.holeCards.map((card, idx) => (
            <Card key={idx} card={card} delay={idx * 100} />
          ))}
        </div>
      )}
    </div>
  );
}
