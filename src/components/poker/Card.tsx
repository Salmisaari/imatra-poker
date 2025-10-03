import { Card as CardType } from '@/lib/poker/types';
import { Heart, Diamond, Club, Spade } from 'lucide-react';

interface CardProps {
  card: CardType;
  delay?: number;
}

export function Card({ card, delay = 0 }: CardProps) {
  const suitIcons = {
    hearts: Heart,
    diamonds: Diamond,
    clubs: Club,
    spades: Spade,
  };

  const suitColors = {
    hearts: 'text-red-500',
    diamonds: 'text-red-500',
    clubs: 'text-foreground',
    spades: 'text-foreground',
  };

  const SuitIcon = suitIcons[card.suit];

  if (!card.faceUp) {
    return (
      <div
        className="w-14 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-lg border-2 border-red-800 flex items-center justify-center animate-card-deal shadow-lg"
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="text-red-300 text-xs font-bold opacity-50">POKER</div>
      </div>
    );
  }

  return (
    <div
      className="w-14 h-20 bg-white rounded-lg border-2 border-gray-300 p-1.5 flex flex-col justify-between animate-card-deal shadow-lg"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex flex-col items-center">
        <div className={`text-base font-bold ${suitColors[card.suit]} leading-none`}>
          {card.rank}
        </div>
        <SuitIcon className={`w-4 h-4 ${suitColors[card.suit]}`} />
      </div>
      <div className="flex flex-col items-center rotate-180">
        <div className={`text-base font-bold ${suitColors[card.suit]} leading-none`}>
          {card.rank}
        </div>
        <SuitIcon className={`w-4 h-4 ${suitColors[card.suit]}`} />
      </div>
    </div>
  );
}
