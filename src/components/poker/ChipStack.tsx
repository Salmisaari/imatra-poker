import { Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChipStackProps {
  amount: number;
  position: 'center' | 'player';
  animated?: boolean;
}

export function ChipStack({ amount, position, animated = false }: ChipStackProps) {
  const getChipColor = (value: number) => {
    if (value >= 500) return 'bg-chip-purple border-chip-purple/50';
    if (value >= 100) return 'bg-chip-black border-chip-black/50';
    if (value >= 25) return 'bg-chip-green border-chip-green/50';
    if (value >= 5) return 'bg-chip-red border-chip-red/50';
    return 'bg-chip-white border-chip-white/50';
  };

  const chipDenominations = [500, 100, 25, 5, 1];
  const chipStacks: { value: number; count: number }[] = [];
  
  let remaining = amount;
  for (const denom of chipDenominations) {
    const count = Math.floor(remaining / denom);
    if (count > 0) {
      chipStacks.push({ value: denom, count: Math.min(count, 5) }); // Max 5 chips per stack
      remaining -= count * denom;
    }
  }

  return (
    <div className={cn(
      "flex items-end gap-1",
      animated && "animate-chip-slide"
    )}>
      {chipStacks.map((stack, stackIdx) => (
        <div key={stackIdx} className="relative flex flex-col-reverse">
          {Array.from({ length: stack.count }).map((_, chipIdx) => (
            <div
              key={chipIdx}
              className={cn(
                "w-6 h-2 rounded-full border-2 shadow-sm",
                getChipColor(stack.value)
              )}
              style={{
                marginTop: chipIdx === 0 ? '0' : '-4px',
                zIndex: chipIdx,
              }}
            />
          ))}
        </div>
      ))}
      
      {position === 'center' && (
        <div className="ml-2 flex items-center gap-1">
          <Circle className="w-4 h-4 fill-chip-gold text-chip-gold" />
          <span className="text-lg font-bold text-chip-gold">{amount}</span>
        </div>
      )}
    </div>
  );
}
