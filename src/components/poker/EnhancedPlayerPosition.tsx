import { Player } from '@/lib/poker/types';
import { Card } from './Card';
import { cn } from '@/lib/utils';

interface EnhancedPlayerPositionProps {
  player: Player;
  isActive: boolean;
  showCards: boolean;
  timeRemaining?: number;
}

export function EnhancedPlayerPosition({ player, isActive, showCards, timeRemaining }: EnhancedPlayerPositionProps) {
  const getBadgeText = () => {
    if (player.isDealer) return 'D';
    if (player.isBigBlind) return 'BB';
    if (player.isSmallBlind) return 'SB';
    return null;
  };

  const badgeText = getBadgeText();

  return (
    <div className="relative">
      {/* Current Bet Chip - Yellow Oval */}
      {player.currentBet > 0 && (
        <div className="absolute -left-4 top-6 z-10 bg-yellow-300 text-black font-bold text-sm px-3 py-2 rounded-full min-w-[60px] text-center border-2 border-yellow-400">
          {player.currentBet}
        </div>
      )}

      {/* Dealer/Blind Badge - White Circle */}
      {badgeText && (
        <div className="absolute -left-4 top-20 z-10 bg-white text-blue-600 font-bold text-lg w-12 h-12 flex items-center justify-center rounded-full border-4 border-white shadow-lg">
          {badgeText}
        </div>
      )}

      {/* Main Player Card */}
      <div
        className={cn(
          'relative bg-white rounded-2xl p-4 min-w-[200px] shadow-xl transition-all',
          isActive && 'ring-4 ring-yellow-400 ring-offset-2',
          player.status === 'folded' && 'opacity-50 grayscale'
        )}
      >
        {/* Position Badge - Green Circle Top Right */}
        <div className="absolute -top-3 -right-3 bg-green-600 text-white font-bold text-lg w-12 h-12 flex items-center justify-center rounded-full border-4 border-white shadow-lg">
          {player.position + 1}
        </div>

        {/* All-In Badge */}
        {player.status === 'all-in' && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
            All in
          </div>
        )}

        <div className="flex items-start gap-3">
        {/* Cards */}
        {player.holeCards.length > 0 && (
          <div className="flex gap-1 flex-shrink-0">
            {player.holeCards.map((card, index) => (
              <div
                key={index}
                className="animate-card-deal"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <Card
                  card={showCards ? { ...card, faceUp: true } : card}
                  delay={0}
                  size="normal"
                />
              </div>
            ))}
          </div>
        )}

          {/* Player Info */}
          <div className="flex-1">
            <div className="font-bold text-xl text-black mb-1">{player.name}</div>
            <div className="text-black text-lg font-semibold">{player.chips}</div>
          </div>
        </div>

        {/* Progress Bar */}
        {isActive && timeRemaining !== undefined && (
          <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-1000",
                timeRemaining > 20 ? "bg-gradient-to-r from-purple-500 to-lime-400" :
                timeRemaining > 10 ? "bg-gradient-to-r from-purple-500 to-yellow-400" :
                "bg-gradient-to-r from-red-500 to-orange-400"
              )}
              style={{ width: `${(timeRemaining / 30) * 100}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
