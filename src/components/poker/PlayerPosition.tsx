import { Player as PlayerType } from '@/lib/poker/types';
import { Card } from './Card';
import { Circle } from 'lucide-react';

interface PlayerPositionProps {
  player: PlayerType;
  isActive: boolean;
  showCards: boolean;
}

export function PlayerPosition({ player, isActive, showCards }: PlayerPositionProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* Cards */}
      <div className="flex gap-1">
        {player.holeCards.map((card, idx) => (
          <Card
            key={idx}
            card={showCards ? { ...card, faceUp: true } : card}
            delay={idx * 100}
          />
        ))}
      </div>

      {/* Player Info */}
      <div
        className={`
          bg-card rounded-xl px-4 py-2 border-2 min-w-[140px]
          ${isActive ? 'border-primary animate-pulse-glow' : 'border-border'}
          ${player.status === 'folded' ? 'opacity-50' : ''}
        `}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {player.isDealer && (
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                D
              </div>
            )}
            <div>
              <div className="text-sm font-semibold text-foreground">{player.name}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Circle className="w-3 h-3 fill-chip-gold text-chip-gold" />
                {player.chips}
              </div>
            </div>
          </div>
        </div>

        {/* Current Bet */}
        {player.currentBet > 0 && (
          <div className="mt-1 text-xs text-accent font-medium animate-chip-slide">
            Bet: {player.currentBet}
          </div>
        )}

        {/* Status */}
        {player.status !== 'active' && (
          <div className="mt-1 text-xs font-medium capitalize">
            {player.status === 'all-in' && <span className="text-destructive">ALL IN</span>}
            {player.status === 'folded' && <span className="text-muted-foreground">FOLDED</span>}
          </div>
        )}
      </div>
    </div>
  );
}
